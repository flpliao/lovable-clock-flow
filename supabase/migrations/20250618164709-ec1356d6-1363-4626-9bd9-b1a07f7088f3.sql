
-- 檢查目前的約束條件並修正部門類型約束
ALTER TABLE public.departments DROP CONSTRAINT IF EXISTS departments_type_check;

-- 重新建立約束，允許所有必要的部門類型
ALTER TABLE public.departments ADD CONSTRAINT departments_type_check 
CHECK (type IN ('headquarters', 'branch', 'store', 'department'));
