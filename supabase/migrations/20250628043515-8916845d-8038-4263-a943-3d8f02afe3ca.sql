
-- 執行用戶同步函數，確保所有 Supabase Auth 用戶都有對應的 staff 記錄
SELECT public.sync_users_to_staff();

-- 檢查同步結果
SELECT * FROM public.check_user_staff_sync();

-- 特別檢查 endless640c@gmail.com 的同步狀況
SELECT 
  s.id,
  s.user_id,
  s.name,
  s.email,
  s.role,
  s.created_at
FROM public.staff s
WHERE s.email = 'endless640c@gmail.com';

-- 也檢查該用戶在 auth.users 中的狀態
SELECT 
  au.id,
  au.email,
  au.created_at,
  au.email_confirmed_at
FROM auth.users au
WHERE au.email = 'endless640c@gmail.com';
