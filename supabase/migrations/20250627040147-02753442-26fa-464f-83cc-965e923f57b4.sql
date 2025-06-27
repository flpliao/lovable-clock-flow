
-- 更新 overtime_requests 表格，完全對齊 leave_requests 結構
ALTER TABLE public.overtime_requests 
ADD COLUMN IF NOT EXISTS supervisor_hierarchy JSONB,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.staff(id),
ADD COLUMN IF NOT EXISTS approved_by_name TEXT,
ADD COLUMN IF NOT EXISTS approval_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS approval_comment TEXT;

-- 確保 overtime_approval_records 表格有正確的外鍵關聯
ALTER TABLE public.overtime_approval_records 
DROP CONSTRAINT IF EXISTS fk_overtime_approval_records_request_id,
ADD CONSTRAINT fk_overtime_approval_records_request_id 
FOREIGN KEY (overtime_request_id) REFERENCES public.overtime_requests(id) ON DELETE CASCADE;

-- 創建加班申請自動審核流程函數，完全比照請假系統
CREATE OR REPLACE FUNCTION setup_overtime_approval_workflow()
RETURNS TRIGGER AS $$
DECLARE
  supervisor_hierarchy JSONB;
  first_supervisor JSONB;
  supervisor_id UUID;
  supervisor_name TEXT;
BEGIN
  -- 獲取主管階層，重用請假系統的邏輯
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
        overtime_request_id,
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
    -- 沒有主管時自動核准，比照請假系統邏輯
    NEW.status := 'approved';
    NEW.approval_date := now();
    NEW.approval_comment := '系統自動核准（無指定主管）';
    NEW.approved_by := NEW.staff_id;
    NEW.approved_by_name := (SELECT name FROM public.staff WHERE id = NEW.staff_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 創建加班審核狀態變更通知函數
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
    UPDATE public.overtime_requests 
    SET 
      current_approver = next_approver_id,
      approval_level = NEW.approval_level + 1,
      status = 'pending'
    WHERE id = NEW.id;
    
    -- 更新審核記錄狀態
    UPDATE public.overtime_approval_records 
    SET status = 'pending'
    WHERE overtime_request_id = NEW.id AND level = NEW.approval_level + 1;
    
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

-- 重新建立觸發器
DROP TRIGGER IF EXISTS setup_overtime_approval_workflow_trigger ON public.overtime_requests;
DROP TRIGGER IF EXISTS notify_overtime_status_change_trigger ON public.overtime_requests;

CREATE TRIGGER setup_overtime_approval_workflow_trigger
  BEFORE INSERT ON public.overtime_requests
  FOR EACH ROW
  WHEN (NEW.status = 'pending')
  EXECUTE FUNCTION setup_overtime_approval_workflow();

CREATE TRIGGER notify_overtime_status_change_trigger
  AFTER UPDATE ON public.overtime_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_overtime_status_change();
