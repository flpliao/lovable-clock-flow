
-- 修正 staff 表格的 RLS 政策無限遞迴問題
-- 先刪除現有的有問題的政策
DROP POLICY IF EXISTS "staff_select_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_management_policy" ON public.staff;

-- 創建新的優化版 RLS 政策，避免無限遞迴
-- 允許所有認證用戶查看員工資料
CREATE POLICY "staff_select_policy" ON public.staff
FOR SELECT USING (auth.uid() IS NOT NULL);

-- 允許管理員和自己管理員工資料
CREATE POLICY "staff_management_policy" ON public.staff
FOR ALL USING (
  auth.uid() IS NOT NULL AND (
    -- 允許廖俊雄 (超級管理員) - 使用硬編碼 UUID 避免遞迴查詢
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- 允許查看/編輯自己的資料
    auth.uid() = id OR
    auth.uid() = user_id
  )
);

-- 確保廖俊雄的用戶資料正確設定為管理員
UPDATE public.staff 
SET role = 'admin', role_id = 'admin' 
WHERE email = 'flpliao@gmail.com' OR user_id = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid;

-- 如果廖俊雄的 staff 記錄不存在，創建一個
INSERT INTO public.staff (
  id,
  user_id,
  name,
  email,
  role,
  role_id,
  department,
  position,
  branch_id,
  branch_name,
  contact
) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  '0765138a-6f11-45f4-be07-dab965116a2d'::uuid,
  '廖俊雄',
  'flpliao@gmail.com',
  'admin',
  'admin',
  '資訊部',
  '系統管理員',
  (SELECT id FROM public.branches LIMIT 1),
  (SELECT name FROM public.branches LIMIT 1),
  'flpliao@gmail.com'
WHERE NOT EXISTS (
  SELECT 1 FROM public.staff 
  WHERE email = 'flpliao@gmail.com' 
  OR user_id = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid
);
