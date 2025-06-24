
-- 為 overtimes 表添加完整的審核流程欄位
ALTER TABLE public.overtimes 
ADD COLUMN IF NOT EXISTS approver_id uuid,
ADD COLUMN IF NOT EXISTS approver_name text;

-- 創建加班審核記錄表的完整結構（如果不存在）
CREATE TABLE IF NOT EXISTS public.overtime_approval_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  overtime_id uuid NOT NULL,
  approver_id uuid,
  approver_name text NOT NULL,
  level integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  approval_date timestamp with time zone,
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 為 overtimes 表添加 RLS 政策（先刪除現有政策再重新創建）
ALTER TABLE public.overtimes ENABLE ROW LEVEL SECURITY;

-- 刪除現有政策
DROP POLICY IF EXISTS "staff_can_view_own_overtime" ON public.overtimes;
DROP POLICY IF EXISTS "staff_can_create_own_overtime" ON public.overtimes;
DROP POLICY IF EXISTS "staff_can_update_own_pending_overtime" ON public.overtimes;
DROP POLICY IF EXISTS "supervisors_can_view_subordinate_overtime" ON public.overtimes;
DROP POLICY IF EXISTS "supervisors_can_update_subordinate_overtime" ON public.overtimes;

-- 員工可以查看自己的加班記錄
CREATE POLICY "staff_can_view_own_overtime" ON public.overtimes
FOR SELECT USING (
  staff_id = get_current_user_id()
);

-- 員工可以創建自己的加班申請
CREATE POLICY "staff_can_create_own_overtime" ON public.overtimes
FOR INSERT WITH CHECK (
  staff_id = get_current_user_id()
);

-- 員工可以更新自己待審核的加班申請
CREATE POLICY "staff_can_update_own_pending_overtime" ON public.overtimes
FOR UPDATE USING (
  staff_id = get_current_user_id() AND status = 'pending'
);

-- 主管可以查看需要審核的加班申請
CREATE POLICY "supervisors_can_view_subordinate_overtime" ON public.overtimes
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.staff s1, public.staff s2 
    WHERE s1.id = staff_id
    AND s2.id = get_current_user_id()
    AND (s2.role = 'admin' OR s1.supervisor_id = s2.id OR current_approver = s2.id)
  )
);

-- 主管可以更新需要審核的加班申請
CREATE POLICY "supervisors_can_update_subordinate_overtime" ON public.overtimes
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.staff s1, public.staff s2 
    WHERE s1.id = staff_id
    AND s2.id = get_current_user_id()
    AND (s2.role = 'admin' OR s1.supervisor_id = s2.id OR current_approver = s2.id)
  )
);

-- 為 overtime_approval_records 表添加 RLS 政策
ALTER TABLE public.overtime_approval_records ENABLE ROW LEVEL SECURITY;

-- 刪除現有政策
DROP POLICY IF EXISTS "staff_can_view_own_overtime_approval_records" ON public.overtime_approval_records;
DROP POLICY IF EXISTS "approvers_can_manage_approval_records" ON public.overtime_approval_records;

-- 員工可以查看自己加班申請的審核記錄
CREATE POLICY "staff_can_view_own_overtime_approval_records" ON public.overtime_approval_records
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.overtimes o
    WHERE o.id = overtime_id AND o.staff_id = get_current_user_id()
  )
);

-- 審核人員可以查看和創建審核記錄
CREATE POLICY "approvers_can_manage_approval_records" ON public.overtime_approval_records
FOR ALL USING (
  approver_id = get_current_user_id() OR
  EXISTS (
    SELECT 1 FROM public.staff
    WHERE id = get_current_user_id() AND role = 'admin'
  )
);

-- 創建加班申請時自動設定審核流程的觸發器函數
CREATE OR REPLACE FUNCTION setup_overtime_approval_flow()
RETURNS TRIGGER AS $$
DECLARE
  supervisor_id uuid;
  supervisor_name text;
BEGIN
  -- 獲取申請人的主管資訊
  SELECT s.supervisor_id, supervisor.name
  INTO supervisor_id, supervisor_name
  FROM public.staff s
  LEFT JOIN public.staff supervisor ON s.supervisor_id = supervisor.id
  WHERE s.id = NEW.staff_id;
  
  -- 如果有主管，設定審核流程
  IF supervisor_id IS NOT NULL THEN
    NEW.current_approver := supervisor_id;
    NEW.approver_id := supervisor_id;
    NEW.approver_name := supervisor_name;
    NEW.approval_level := 1;
    
    -- 創建第一級審核記錄
    INSERT INTO public.overtime_approval_records (
      overtime_id,
      approver_id,
      approver_name,
      level,
      status
    ) VALUES (
      NEW.id,
      supervisor_id,
      supervisor_name,
      1,
      'pending'
    );
    
    -- 發送通知給主管
    PERFORM create_overtime_notification(
      supervisor_id,
      '新的加班申請等待審核',
      '員工 ' || (SELECT name FROM public.staff WHERE id = NEW.staff_id) || ' 提交了加班申請，請及時審核',
      'overtime_approval',
      NEW.id,
      true
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 創建觸發器
DROP TRIGGER IF EXISTS setup_overtime_approval_flow_trigger ON public.overtimes;
CREATE TRIGGER setup_overtime_approval_flow_trigger
  BEFORE INSERT ON public.overtimes
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION setup_overtime_approval_flow();

-- 創建審核完成後的通知函數
CREATE OR REPLACE FUNCTION notify_overtime_approval_result()
RETURNS TRIGGER AS $$
DECLARE
  applicant_name text;
  status_text text;
BEGIN
  -- 獲取申請人姓名
  SELECT name INTO applicant_name
  FROM public.staff
  WHERE id = NEW.staff_id;
  
  -- 設定狀態文字
  status_text := CASE 
    WHEN NEW.status = 'approved' THEN '已核准'
    WHEN NEW.status = 'rejected' THEN '已拒絕'
    ELSE NEW.status
  END;
  
  -- 發送通知給申請人
  IF OLD.status = 'pending' AND NEW.status IN ('approved', 'rejected') THEN
    PERFORM create_overtime_notification(
      NEW.staff_id,
      '加班申請' || status_text,
      '您的加班申請已' || status_text || COALESCE('，原因：' || NEW.rejection_reason, ''),
      'overtime_status',
      NEW.id,
      false
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 創建審核結果通知觸發器
DROP TRIGGER IF EXISTS notify_overtime_approval_result_trigger ON public.overtimes;
CREATE TRIGGER notify_overtime_approval_result_trigger
  AFTER UPDATE ON public.overtimes
  FOR EACH ROW
  WHEN (OLD.status != NEW.status)
  EXECUTE FUNCTION notify_overtime_approval_result();
