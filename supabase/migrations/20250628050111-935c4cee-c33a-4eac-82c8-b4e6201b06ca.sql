
-- 更新廖俊雄的記錄，使用實際的 staff ID
UPDATE public.staff 
SET role = 'admin', 
    role_id = 'admin',
    name = '廖俊雄',
    position = '系統管理員',
    department = '資訊部'
WHERE id = 'ae688814-f6ef-460a-b4b1-f3a2c378c044'::uuid 
   OR email = 'flpliao@gmail.com' 
   OR name = '廖俊雄';

-- 確保 user_id 正確關聯到 auth.users
UPDATE public.staff 
SET user_id = (SELECT id FROM auth.users WHERE email = 'flpliao@gmail.com' LIMIT 1)
WHERE (id = 'ae688814-f6ef-460a-b4b1-f3a2c378c044'::uuid 
       OR email = 'flpliao@gmail.com' 
       OR name = '廖俊雄')
  AND user_id IS NULL;

-- 檢查更新後的結果
SELECT id, user_id, name, email, role, role_id, position, department
FROM public.staff 
WHERE id = 'ae688814-f6ef-460a-b4b1-f3a2c378c044'::uuid 
   OR email = 'flpliao@gmail.com' 
   OR name = '廖俊雄';
