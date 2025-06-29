
-- 修正特定用戶的 staff 記錄對應關係
-- 將 staff 記錄 ae688814-f6ef-460a-b4b1-f3a2c378c044 的 user_id 更新為正確的 Auth UID
UPDATE public.staff 
SET user_id = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid
WHERE id = 'ae688814-f6ef-460a-b4b1-f3a2c378c044'::uuid;

-- 驗證更新結果，檢查是否正確對應
SELECT 
  id as staff_id,
  user_id,
  name,
  email,
  role,
  role_id,
  department
FROM public.staff 
WHERE user_id = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid 
   OR id = 'ae688814-f6ef-460a-b4b1-f3a2c378c044'::uuid;

-- 同時檢查是否有其他需要修正的對應關係
SELECT 
  s.id as staff_id,
  s.user_id,
  s.name,
  s.email,
  s.role,
  s.role_id,
  au.id as auth_user_id,
  au.email as auth_email
FROM public.staff s
LEFT JOIN auth.users au ON s.email = au.email
WHERE s.user_id IS NULL OR s.user_id != au.id;
