
-- 為 departments 表添加 GPS 狀態欄位
ALTER TABLE public.departments 
ADD COLUMN IF NOT EXISTS gps_status TEXT DEFAULT 'not_converted' CHECK (gps_status IN ('not_converted', 'converted', 'failed'));

-- 更新現有記錄的 GPS 狀態
UPDATE public.departments 
SET gps_status = CASE 
  WHEN latitude IS NOT NULL AND longitude IS NOT NULL AND address_verified = true THEN 'converted'
  WHEN latitude IS NULL OR longitude IS NULL THEN 'not_converted'
  ELSE 'failed'
END;

-- 為 check_in_records 表添加更詳細的 GPS 記錄欄位
ALTER TABLE public.check_in_records 
ADD COLUMN IF NOT EXISTS department_latitude NUMERIC,
ADD COLUMN IF NOT EXISTS department_longitude NUMERIC,
ADD COLUMN IF NOT EXISTS department_name TEXT,
ADD COLUMN IF NOT EXISTS gps_comparison_result JSONB;

-- 添加索引以提升查詢效能
CREATE INDEX IF NOT EXISTS idx_departments_gps_status ON public.departments(gps_status);
CREATE INDEX IF NOT EXISTS idx_check_in_records_gps ON public.check_in_records(department_name, type);
