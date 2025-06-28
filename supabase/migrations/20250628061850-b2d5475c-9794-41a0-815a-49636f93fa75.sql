
-- 修復 RLS 政策的無限遞迴問題
-- 首先刪除現有有問題的政策
DROP POLICY IF EXISTS "staff_select_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_insert_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_update_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_delete_policy" ON public.staff;

-- 更新 is_admin_user 函數，避免遞迴問題
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    -- Check if user is the super admin (廖俊雄)
    auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
    -- Check if user has admin role using user_id
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    );
$$;

-- 重新建立 RLS 政策
CREATE POLICY "staff_select_policy" ON public.staff
FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    -- Users can view their own record using user_id
    auth.uid() = user_id OR
    -- 廖俊雄 (super admin) can view all records
    auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
    -- Admins can view all records
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.user_id = auth.uid() 
      AND s.role = 'admin'
    )
  )
);

CREATE POLICY "staff_insert_policy" ON public.staff
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND (
    -- 廖俊雄 (super admin) can insert records
    auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
    -- Admins can insert records
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.user_id = auth.uid() 
      AND s.role = 'admin'
    )
  )
);

CREATE POLICY "staff_update_policy" ON public.staff
FOR UPDATE USING (
  auth.uid() IS NOT NULL AND (
    -- Users can update their own record using user_id
    auth.uid() = user_id OR
    -- 廖俊雄 (super admin) can update all records
    auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
    -- Admins can update all records
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.user_id = auth.uid() 
      AND s.role = 'admin'
    )
  )
);

CREATE POLICY "staff_delete_policy" ON public.staff
FOR DELETE USING (
  auth.uid() IS NOT NULL AND (
    -- 廖俊雄 (super admin) can delete records
    auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
    -- Admins can delete records
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.user_id = auth.uid() 
      AND s.role = 'admin'
    )
  )
);

-- 確保廖俊雄的記錄有正確的 user_id 和 role
UPDATE public.staff 
SET user_id = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid,
    role = 'admin',
    role_id = 'admin'
WHERE email = 'flpliao@gmail.com' OR name = '廖俊雄';

-- 檢查更新結果
SELECT id, user_id, name, email, role, role_id FROM public.staff WHERE email = 'flpliao@gmail.com';
