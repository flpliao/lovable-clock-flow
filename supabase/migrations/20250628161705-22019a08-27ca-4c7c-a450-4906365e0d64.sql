
-- 修正所有函式的 search_path 設定以符合 Supabase Security Advisor 要求

-- 1. calculate_annual_leave_days - 計算年假天數
CREATE OR REPLACE FUNCTION public.calculate_annual_leave_days(hire_date date)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    years_of_service NUMERIC;
    months_of_service INTEGER;
    annual_days NUMERIC(3,1);
BEGIN
    -- 計算總月數
    months_of_service := EXTRACT(YEAR FROM AGE(CURRENT_DATE, hire_date)) * 12 + 
                        EXTRACT(MONTH FROM AGE(CURRENT_DATE, hire_date));
    
    years_of_service := months_of_service / 12.0;
    
    -- 根據勞基法第38條計算特休天數
    IF months_of_service < 6 THEN
        annual_days := 0;
    ELSIF years_of_service < 1 THEN
        annual_days := 3;
    ELSIF years_of_service < 2 THEN
        annual_days := 7;
    ELSIF years_of_service < 3 THEN
        annual_days := 10;
    ELSIF years_of_service < 5 THEN
        annual_days := 14;
    ELSIF years_of_service < 10 THEN
        annual_days := 15;
    ELSE
        -- 滿10年後每滿一年增加一天，最高30天
        annual_days := LEAST(30, 15 + FLOOR(years_of_service - 10) + 1);
    END IF;
    
    RETURN annual_days;
END;
$$;

-- 2. initialize_or_update_annual_leave_balance - 初始化或更新年假餘額
CREATE OR REPLACE FUNCTION public.initialize_or_update_annual_leave_balance(
    staff_uuid uuid,
    target_year integer DEFAULT EXTRACT(year FROM CURRENT_DATE)
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    staff_hire_date DATE;
    calculated_total_days NUMERIC(3,1);
    current_used_days NUMERIC(5,1) := 0;
BEGIN
    -- 取得員工入職日期
    SELECT hire_date INTO staff_hire_date
    FROM staff
    WHERE id = staff_uuid;
    
    IF staff_hire_date IS NULL THEN
        RAISE EXCEPTION '找不到員工資料或入職日期未設定';
    END IF;
    
    -- 計算該員工應有的特休天數
    calculated_total_days := calculate_annual_leave_days(staff_hire_date);
    
    -- 計算已使用天數（從已核准的請假記錄統計）
    SELECT COALESCE(SUM(hours / 8.0), 0) INTO current_used_days
    FROM leave_requests
    WHERE (staff_id = staff_uuid OR user_id = staff_uuid)
      AND leave_type = 'annual'
      AND status = 'approved'
      AND EXTRACT(YEAR FROM start_date::date) = target_year;
    
    -- 插入或更新年假餘額記錄
    INSERT INTO annual_leave_balance (
        staff_id, 
        user_id, 
        year, 
        total_days, 
        used_days
    )
    VALUES (
        staff_uuid,
        staff_uuid,
        target_year,
        calculated_total_days,
        current_used_days
    )
    ON CONFLICT (staff_id, year) 
    DO UPDATE SET
        total_days = calculated_total_days,
        used_days = current_used_days,
        updated_at = CURRENT_TIMESTAMP;
END;
$$;

-- 3. update_annual_leave_balance_on_leave_change - 請假狀態變更時更新年假餘額
CREATE OR REPLACE FUNCTION public.update_annual_leave_balance_on_leave_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    -- 當年假申請被核准或拒絕時，更新餘額
    IF (NEW.leave_type = 'annual' AND NEW.status = 'approved') OR
       (OLD.leave_type = 'annual' AND OLD.status = 'approved' AND NEW.status != 'approved') THEN
        
        -- 更新年假餘額
        PERFORM initialize_or_update_annual_leave_balance(
            COALESCE(NEW.staff_id, NEW.user_id),
            EXTRACT(YEAR FROM NEW.start_date::date)::INTEGER
        );
    END IF;
    
    RETURN NEW;
END;
$$;

-- 4. update_missed_checkin_approval_records_updated_at - 更新漏打卡審核記錄時間戳
CREATE OR REPLACE FUNCTION public.update_missed_checkin_approval_records_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- 5. setup_overtime_approval_workflow - 設定加班審核流程
CREATE OR REPLACE FUNCTION public.setup_overtime_approval_workflow()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
      INSERT INTO overtime_approval_records (
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
      '員工 ' || (SELECT name FROM staff WHERE user_id = NEW.staff_id OR id = NEW.staff_id) || ' 提交了加班申請，請及時處理',
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
    NEW.approved_by_name := (SELECT name FROM staff WHERE user_id = NEW.staff_id OR id = NEW.staff_id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- 6. update_overtime_updated_at - 更新加班記錄時間戳
CREATE OR REPLACE FUNCTION public.update_overtime_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 7. notify_overtime_status_change - 加班狀態變更通知
CREATE OR REPLACE FUNCTION public.notify_overtime_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  applicant_info RECORD;
  status_text TEXT;
  next_approver_id UUID;
  next_approver_name TEXT;
BEGIN
  -- 獲取申請人資訊
  SELECT name, department INTO applicant_info
  FROM staff
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
    UPDATE overtime_requests 
    SET 
      current_approver = next_approver_id,
      approval_level = NEW.approval_level + 1,
      status = 'pending'
    WHERE id = NEW.id;
    
    -- 更新審核記錄狀態
    UPDATE overtime_approval_records 
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
$$;

-- 8. get_overtime_supervisor_hierarchy - 取得加班審核主管階層
CREATE OR REPLACE FUNCTION public.get_overtime_supervisor_hierarchy(staff_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
    hierarchy JSONB := '[]'::JSONB;
    current_staff_id UUID := staff_uuid;
    supervisor_info RECORD;
    level_count INTEGER := 0;
    max_levels INTEGER := 5; -- 防止無窮迴圈
BEGIN
    -- 建構主管階層鏈
    WHILE current_staff_id IS NOT NULL AND level_count < max_levels LOOP
        -- 查找當前員工的直屬主管
        SELECT 
            s.supervisor_id,
            sup.name as supervisor_name,
            sup.position as supervisor_position,
            sup.department as supervisor_department
        INTO supervisor_info
        FROM staff s
        LEFT JOIN staff sup ON s.supervisor_id = sup.id
        WHERE s.id = current_staff_id;
        
        -- 如果找到主管，加入階層中
        IF supervisor_info.supervisor_id IS NOT NULL THEN
            hierarchy := hierarchy || jsonb_build_object(
                'level', level_count + 1,
                'supervisor_id', supervisor_info.supervisor_id,
                'supervisor_name', supervisor_info.supervisor_name,
                'supervisor_position', supervisor_info.supervisor_position,
                'supervisor_department', supervisor_info.supervisor_department
            );
            
            current_staff_id := supervisor_info.supervisor_id;
            level_count := level_count + 1;
        ELSE
            -- 沒有更多主管，結束迴圈
            current_staff_id := NULL;
        END IF;
    END LOOP;
    
    RETURN hierarchy;
END;
$$;

-- 9. 另外修正其他已存在但需要加上 search_path 的函式

-- create_overtime_notification - 建立加班通知
CREATE OR REPLACE FUNCTION public.create_overtime_notification(
    p_user_id uuid, 
    p_title text, 
    p_message text, 
    p_type text DEFAULT 'overtime_approval'::text, 
    p_overtime_request_id uuid DEFAULT NULL::uuid, 
    p_action_required boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    leave_request_id, -- 重用這個欄位存放 overtime_request_id
    action_required,
    is_read,
    created_at
  ) VALUES (
    p_user_id,
    p_title,
    p_message,
    p_type,
    p_overtime_request_id,
    p_action_required,
    false,
    now()
  )
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- update_updated_at_column - 通用更新時間戳函式
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;
