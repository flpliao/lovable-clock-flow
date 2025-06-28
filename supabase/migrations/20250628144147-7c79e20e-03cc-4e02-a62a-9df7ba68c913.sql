
-- 修復廖俊雄的 staff 記錄，使用正確的 Supabase Auth UID
UPDATE public.staff 
SET user_id = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid
WHERE name = '廖俊雄' 
  AND (user_id IS NULL OR user_id != '0765138a-6f11-45f4-be07-dab965116a2d'::uuid);

-- 確保廖俊雄的角色為 admin
UPDATE public.staff 
SET role = 'admin', role_id = 'admin'
WHERE name = '廖俊雄' 
  AND user_id = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid;

-- 修復 RLS 政策，確保使用正確的 user_id 對應
DROP POLICY IF EXISTS "staff_select_policy" ON public.staff;
CREATE POLICY "staff_select_policy" ON public.staff
FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    -- 用戶可以查看自己的記錄
    auth.uid() = user_id OR
    -- 廖俊雄可以查看所有記錄
    auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
    -- 管理員可以查看所有記錄
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  )
);

-- 創建一個函數來檢查用戶是否為管理員（避免遞迴問題）
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    -- 廖俊雄永遠是管理員
    auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
    -- 檢查其他管理員
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
      AND user_id != '0765138a-6f11-45f4-be07-dab965116a2d'::uuid
    );
$$;
