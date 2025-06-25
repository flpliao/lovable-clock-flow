
-- 清空測試資料
TRUNCATE TABLE public.overtime_approval_records CASCADE;
TRUNCATE TABLE public.overtimes CASCADE;

-- 重新設計 overtimes 表格結構，完全對齊 leave_requests
ALTER TABLE public.overtimes 
DROP COLUMN IF EXISTS approver_id,
DROP COLUMN IF EXISTS approver_name,
DROP COLUMN IF EXISTS approved_by_name,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.staff(id),
ADD COLUMN IF NOT EXISTS approved_by_name TEXT,
ADD COLUMN IF NOT EXISTS attachment_url TEXT;

-- 確保 overtime_approval_records 表格結構與 approval_records 一致
-- 檢查並調整欄位
DO $$
BEGIN
    -- 確保所有必要欄位存在
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'overtime_approval_records' AND column_name = 'updated_at') THEN
        ALTER TABLE public.overtime_approval_records ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    END IF;
END $$;

-- 完全重建 RLS 政策，完全對齊請假系統
DROP POLICY IF EXISTS "Staff can view own overtime requests" ON public.overtimes;
DROP POLICY IF EXISTS "Staff can create own overtime requests" ON public.overtimes;
DROP POLICY IF EXISTS "Staff can update own pending overtime requests" ON public.overtimes;
DROP POLICY IF EXISTS "Supervisors can view overtime for approval" ON public.overtimes;
DROP POLICY IF EXISTS "Supervisors can update overtime for approval" ON public.overtimes;
DROP POLICY IF EXISTS "Admins can manage all overtime requests" ON public.overtimes;

-- 重新建立 RLS 政策，完全比照請假系統
-- 1. 員工可以查看自己的加班申請
CREATE POLICY "Users can view their own overtime requests" ON public.overtimes
FOR SELECT USING (
  staff_id = get_current_user_id()
);

-- 2. 員工可以創建自己的加班申請
CREATE POLICY "Users can create their own overtime requests" ON public.overtimes
FOR INSERT WITH CHECK (
  staff_id = get_current_user_id()
);

-- 3. 員工可以更新自己待審核的加班申請
CREATE POLICY "Users can update their own pending overtime requests" ON public.overtimes
FOR UPDATE USING (
  staff_id = get_current_user_id() AND status = 'pending'
);

-- 4. 主管可以查看需要審核的加班申請
CREATE POLICY "Supervisors can view overtime requests for approval" ON public.overtimes
FOR SELECT USING (
  -- 是當前審核人
  current_approver = get_current_user_id() OR
  -- 是申請人的直屬主管
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.id = staff_id AND s.supervisor_id = get_current_user_id()
  ) OR
  -- 是系統管理員或特殊帳號
  get_current_user_id() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE id = get_current_user_id() AND role = 'admin'
  )
);

-- 5. 主管可以更新需要審核的加班申請
CREATE POLICY "Supervisors can update overtime requests for approval" ON public.overtimes
FOR UPDATE USING (
  -- 是當前審核人且狀態為待審核
  (current_approver = get_current_user_id() AND status = 'pending') OR
  -- 是系統管理員或特殊帳號
  get_current_user_id() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE id = get_current_user_id() AND role = 'admin'
  )
);

-- 6. 管理員可以管理所有加班申請
CREATE POLICY "Admins can manage all overtime requests" ON public.overtimes
FOR ALL USING (
  get_current_user_id() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE id = get_current_user_id() AND role = 'admin'
  )
);

-- 重建 overtime_approval_records 的 RLS 政策
DROP POLICY IF EXISTS "Staff can view own overtime approval records" ON public.overtime_approval_records;
DROP POLICY IF EXISTS "Approvers can manage overtime approval records" ON public.overtime_approval_records;

-- 1. 員工可以查看自己加班申請的審核記錄
CREATE POLICY "Users can view their own overtime approval records" ON public.overtime_approval_records
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.overtimes o
    WHERE o.id = overtime_id AND o.staff_id = get_current_user_id()
  )
);

-- 2. 審核人員可以查看和更新相關的審核記錄
CREATE POLICY "Approvers can view relevant overtime approval records" ON public.overtime_approval_records
FOR SELECT USING (
  approver_id = get_current_user_id() OR
  get_current_user_id() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff
    WHERE id = get_current_user_id() AND role = 'admin'
  )
);

-- 3. 審核人員可以更新審核記錄
CREATE POLICY "Approvers can update overtime approval records" ON public.overtime_approval_records
FOR UPDATE USING (
  approver_id = get_current_user_id() OR
  get_current_user_id() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff
    WHERE id = get_current_user_id() AND role = 'admin'
  )
);

-- 4. 系統可以插入審核記錄
CREATE POLICY "System can insert overtime approval records" ON public.overtime_approval_records
FOR INSERT WITH CHECK (true);

-- 重新建立主管階層查詢函數，確保與請假系統一致
CREATE OR REPLACE FUNCTION get_overtime_supervisor_hierarchy(staff_id_param UUID, max_levels INTEGER DEFAULT 5)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_staff_id UUID := staff_id_param;
  supervisor_info JSONB;
  hierarchy JSONB := '[]'::jsonb;
  level_counter INTEGER := 0;
BEGIN
  WHILE current_staff_id IS NOT NULL AND level_counter < max_levels LOOP
    level_counter := level_counter + 1;
    
    SELECT jsonb_build_object(
      'level', level_counter,
      'supervisor_id', s.supervisor_id,
      'supervisor_name', sup.name,
      'supervisor_department', sup.department,
      'supervisor_position', sup.position
    )
    INTO supervisor_info
    FROM public.staff s
    LEFT JOIN public.staff sup ON s.supervisor_id = sup.id
    WHERE s.id = current_staff_id;
    
    IF supervisor_info->>'supervisor_id' IS NOT NULL THEN
      hierarchy := hierarchy || supervisor_info;
      current_staff_id := (supervisor_info->>'supervisor_id')::UUID;
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  RETURN hierarchy;
END;
$$;

-- 重新建立加班申請自動審核流程觸發器函數
CREATE OR REPLACE FUNCTION setup_overtime_approval_workflow()
RETURNS TRIGGER AS $$
DECLARE
  supervisor_hierarchy JSONB;
  first_supervisor JSONB;
  supervisor_id UUID;
  supervisor_name TEXT;
BEGIN
  -- 獲取主管階層
  supervisor_hierarchy := get_overtime_supervisor_hierarchy(NEW.staff_id);
  
  -- 儲存主管階層資訊
  NEW.supervisor_hierarchy := supervisor_hierarchy;
  
  -- 如果有主管，設定第一層審核
  IF jsonb_array_length(supervisor_hierarchy) > 0 THEN
    first_supervisor := supervisor_hierarchy->0;
    supervisor_id := (first_supervisor->>'supervisor_id')::UUID;
    supervisor_name := first_supervisor->>'supervisor_name';
    
    NEW.current_approver := supervisor_id;
    NEW.approval_level := 1;
    
    -- 建立所有層級的審核記錄
    FOR i IN 0..jsonb_array_length(supervisor_hierarchy)-1 LOOP
      INSERT INTO public.overtime_approval_records (
        overtime_id,
        approver_id,
        approver_name,
        level,
        status
      ) VALUES (
        NEW.id,
        ((supervisor_hierarchy->i)->>'supervisor_id')::UUID,
        (supervisor_hierarchy->i)->>'supervisor_name',
        i + 1,
        CASE WHEN i = 0 THEN 'pending' ELSE 'waiting' END
      );
    END LOOP;
    
    -- 發送通知給第一層主管
    PERFORM create_overtime_notification(
      supervisor_id,
      '新的加班申請等待審核',
      '員工 ' || (SELECT name FROM public.staff WHERE id = NEW.staff_id) || ' 提交了加班申請，請及時處理',
      'overtime_approval',
      NEW.id,
      true
    );
  ELSE
    -- 沒有主管時自動核准
    NEW.status := 'approved';
    NEW.approval_date := now();
    NEW.approval_comment := '系統自動核准（無指定主管）';
    NEW.approved_by := NEW.staff_id;
    NEW.approved_by_name := (SELECT name FROM public.staff WHERE id = NEW.staff_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 重新建立觸發器
DROP TRIGGER IF EXISTS setup_overtime_approval_flow_trigger ON public.overtimes;
DROP TRIGGER IF EXISTS setup_overtime_approval_workflow_trigger ON public.overtimes;
CREATE TRIGGER setup_overtime_approval_workflow_trigger
  BEFORE INSERT ON public.overtimes
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION setup_overtime_approval_workflow();

-- 重新建立加班審核結果通知觸發器函數
CREATE OR REPLACE FUNCTION notify_overtime_status_change()
RETURNS TRIGGER AS $$
DECLARE
  applicant_info RECORD;
  status_text TEXT;
  next_approver_id UUID;
  next_approver_name TEXT;
BEGIN
  -- 獲取申請人資訊
  SELECT name, department INTO applicant_info
  FROM public.staff
  WHERE id = NEW.staff_id;
  
  -- 如果是審核狀態變更
  IF OLD.status != NEW.status THEN
    -- 設定狀態文字
    status_text := CASE 
      WHEN NEW.status = 'approved' THEN '已核准'
      WHEN NEW.status = 'rejected' THEN '已拒絕'
      ELSE NEW.status
    END;
    
    -- 發送通知給申請人
    PERFORM create_overtime_notification(
      NEW.staff_id,
      '加班申請' || status_text,
      '您的加班申請已' || status_text || 
      CASE 
        WHEN NEW.approval_comment IS NOT NULL THEN '，審核意見：' || NEW.approval_comment
        WHEN NEW.rejection_reason IS NOT NULL THEN '，拒絕原因：' || NEW.rejection_reason
        ELSE ''
      END,
      'overtime_status',
      NEW.id,
      false
    );
  END IF;
  
  -- 如果是多層級審核且當前層級核准
  IF OLD.status = 'pending' AND NEW.status = 'approved' AND 
     NEW.approval_level < jsonb_array_length(NEW.supervisor_hierarchy) THEN
    
    -- 取得下一層審核人
    SELECT 
      ((NEW.supervisor_hierarchy->(NEW.approval_level))->>'supervisor_id')::UUID,
      (NEW.supervisor_hierarchy->(NEW.approval_level))->>'supervisor_name'
    INTO next_approver_id, next_approver_name;
    
    -- 更新為下一層審核
    UPDATE public.overtimes 
    SET 
      current_approver = next_approver_id,
      approval_level = NEW.approval_level + 1,
      status = 'pending'
    WHERE id = NEW.id;
    
    -- 更新審核記錄狀態
    UPDATE public.overtime_approval_records 
    SET status = 'pending'
    WHERE overtime_id = NEW.id AND level = NEW.approval_level + 1;
    
    -- 發送通知給下一層主管
    PERFORM create_overtime_notification(
      next_approver_id,
      '加班申請等待審核',
      '員工 ' || applicant_info.name || ' (' || applicant_info.department || ') 的加班申請已通過第' || NEW.approval_level || '層審核，請進行審核',
      'overtime_approval',
      NEW.id,
      true
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 重新建立審核結果通知觸發器
DROP TRIGGER IF EXISTS notify_overtime_approval_result_trigger ON public.overtimes;
DROP TRIGGER IF EXISTS notify_overtime_status_change_trigger ON public.overtimes;
CREATE TRIGGER notify_overtime_status_change_trigger
  AFTER UPDATE ON public.overtimes
  FOR EACH ROW
  EXECUTE FUNCTION notify_overtime_status_change();

-- 確保審核記錄更新時間觸發器存在
DROP TRIGGER IF EXISTS update_overtime_approval_records_updated_at ON public.overtime_approval_records;
CREATE TRIGGER update_overtime_approval_records_updated_at
    BEFORE UPDATE ON public.overtime_approval_records
    FOR EACH ROW
    EXECUTE FUNCTION update_overtime_approval_records_updated_at();
