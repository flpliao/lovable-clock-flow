
-- 首先檢查廖俊雄目前的資料狀況
SELECT id, user_id, name, email, role, role_id 
FROM public.staff 
WHERE email = 'flpliao@gmail.com' OR name = '廖俊雄';

-- 更新廖俊雄的角色為 admin（不修改 ID，避免衝突）
UPDATE public.staff 
SET role = 'admin', 
    role_id = 'admin',
    name = '廖俊雄',
    position = '系統管理員',
    department = '資訊部'
WHERE email = 'flpliao@gmail.com' OR name = '廖俊雄';

-- 確保廖俊雄有正確的 user_id 關聯
UPDATE public.staff 
SET user_id = (SELECT id FROM auth.users WHERE email = 'flpliao@gmail.com' LIMIT 1)
WHERE (email = 'flpliao@gmail.com' OR name = '廖俊雄') 
  AND user_id IS NULL;

-- 檢查更新後的結果
SELECT id, user_id, name, email, role, role_id, position, department
FROM public.staff 
WHERE email = 'flpliao@gmail.com' OR name = '廖俊雄';
