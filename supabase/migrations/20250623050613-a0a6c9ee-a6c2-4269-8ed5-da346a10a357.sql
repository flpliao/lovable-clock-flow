
-- 設定資料庫預設時區為 Asia/Taipei
SET timezone = 'Asia/Taipei';

-- 更新資料庫層級的預設時區設定
ALTER DATABASE postgres SET timezone = 'Asia/Taipei';

-- 確保 leave_requests 表格的日期欄位使用正確的時區
-- 這會影響所有新的連線都使用 Asia/Taipei 時區
SHOW timezone;

-- 為了確保一致性，我們也可以在系統設定表中明確記錄時區設定
INSERT INTO public.system_settings (setting_key, setting_value, description)
VALUES ('database_timezone', 'Asia/Taipei', '資料庫時區設定')
ON CONFLICT (setting_key) 
DO UPDATE SET 
  setting_value = 'Asia/Taipei',
  description = '資料庫時區設定',
  updated_at = now();
