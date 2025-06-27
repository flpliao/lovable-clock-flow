
-- 修正 get_current_user_id() 函數，使用實際的 Supabase Auth 用戶 ID
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  -- 使用 Supabase Auth 的實際用戶 ID
  SELECT auth.uid();
$function$;

-- 同時檢查並修正相關的加班服務函數，確保使用正確的用戶驗證
-- 更新 overtime 觸發器以使用正確的用戶 ID 驗證
CREATE OR REPLACE FUNCTION public.setup_overtime_approval_workflow()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  supervisor_hierarchy JSONB;
  first_supervisor JSONB;
  supervisor_id UUID;
  supervisor_name TEXT;
BEGIN
  -- 確保使用正確的用戶 ID（使用 auth.uid() 而非硬編碼）
  -- 驗證申請人是否為當前登入用戶
  IF NEW.staff_id != auth.uid() AND NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION '只能為自己提交加班申請';
  END IF;
  
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
      '員工 ' || (SELECT name FROM public.staff WHERE user_id = NEW.staff_id OR id = NEW.staff_id) || ' 提交了加班申請，請及時處理',
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
    NEW.approved_by_name := (SELECT name FROM public.staff WHERE user_id = NEW.staff_id OR id = NEW.staff_id);
  END IF;
  
  RETURN NEW;
END;
$function$;
