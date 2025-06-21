
-- 先移除計算欄位 remaining_days
ALTER TABLE public.annual_leave_balance 
DROP COLUMN IF EXISTS remaining_days;

-- 更新其他欄位的型別
ALTER TABLE public.annual_leave_balance 
ALTER COLUMN total_days TYPE NUMERIC(5,1),
ALTER COLUMN used_days TYPE NUMERIC(5,1);

-- 重新加入 remaining_days 作為計算欄位
ALTER TABLE public.annual_leave_balance 
ADD COLUMN remaining_days NUMERIC(5,1) GENERATED ALWAYS AS (total_days - used_days) STORED;

-- 為 staff 表新增入職日期欄位（如果尚未存在）
ALTER TABLE public.staff 
ADD COLUMN IF NOT EXISTS hire_date DATE;

-- 建立計算年資對應特休天數的函數
CREATE OR REPLACE FUNCTION calculate_annual_leave_days(hire_date DATE)
RETURNS NUMERIC(3,1)
LANGUAGE plpgsql
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

-- 建立初始化或更新年假餘額的函數
CREATE OR REPLACE FUNCTION initialize_or_update_annual_leave_balance(
    staff_uuid UUID,
    target_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    staff_hire_date DATE;
    calculated_total_days NUMERIC(3,1);
    current_used_days NUMERIC(5,1) := 0;
BEGIN
    -- 取得員工入職日期
    SELECT hire_date INTO staff_hire_date
    FROM public.staff
    WHERE id = staff_uuid;
    
    IF staff_hire_date IS NULL THEN
        RAISE EXCEPTION '找不到員工資料或入職日期未設定';
    END IF;
    
    -- 計算該員工應有的特休天數
    calculated_total_days := calculate_annual_leave_days(staff_hire_date);
    
    -- 計算已使用天數（從已核准的請假記錄統計）
    SELECT COALESCE(SUM(hours / 8.0), 0) INTO current_used_days
    FROM public.leave_requests
    WHERE (staff_id = staff_uuid OR user_id = staff_uuid)
      AND leave_type = 'annual'
      AND status = 'approved'
      AND EXTRACT(YEAR FROM start_date::date) = target_year;
    
    -- 插入或更新年假餘額記錄
    INSERT INTO public.annual_leave_balance (
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

-- 建立觸發器，當請假申請狀態變更時自動更新年假餘額
CREATE OR REPLACE FUNCTION update_annual_leave_balance_on_leave_change()
RETURNS TRIGGER
LANGUAGE plpgsql
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

-- 建立觸發器
DROP TRIGGER IF EXISTS trigger_update_annual_leave_balance ON public.leave_requests;
CREATE TRIGGER trigger_update_annual_leave_balance
    AFTER UPDATE OF status ON public.leave_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_annual_leave_balance_on_leave_change();

-- 為現有員工初始化年假餘額（如果有入職日期的話）
DO $$
DECLARE
    staff_record RECORD;
BEGIN
    FOR staff_record IN 
        SELECT id FROM public.staff WHERE hire_date IS NOT NULL
    LOOP
        PERFORM initialize_or_update_annual_leave_balance(staff_record.id);
    END LOOP;
END;
$$;
