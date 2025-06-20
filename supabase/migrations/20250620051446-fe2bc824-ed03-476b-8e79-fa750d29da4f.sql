
-- 為 departments 表新增 GPS 相關欄位
ALTER TABLE public.departments 
ADD COLUMN latitude NUMERIC,
ADD COLUMN longitude NUMERIC,
ADD COLUMN address_verified BOOLEAN DEFAULT false,
ADD COLUMN check_in_radius INTEGER DEFAULT 100;

-- 為現有的部門設定預設打卡半徑為100公尺
UPDATE public.departments 
SET check_in_radius = 100 
WHERE check_in_radius IS NULL;

-- 新增註解說明欄位用途
COMMENT ON COLUMN public.departments.latitude IS '部門地址的緯度座標';
COMMENT ON COLUMN public.departments.longitude IS '部門地址的經度座標';
COMMENT ON COLUMN public.departments.address_verified IS '地址是否已驗證並轉換為GPS座標';
COMMENT ON COLUMN public.departments.check_in_radius IS '允許打卡的半徑範圍（公尺）';
