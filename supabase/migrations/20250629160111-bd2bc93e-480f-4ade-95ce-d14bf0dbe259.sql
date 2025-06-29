
-- 更新所有 RLS 政策中的硬編碼超級管理員 UUID
-- 從 550e8400-e29b-41d4-a716-446655440001 更新為實際的 0765138a-6f11-45f4-be07-dab965116a2d

-- 1. 更新 staff 表的 RLS 政策
DROP POLICY IF EXISTS "staff_view_own" ON public.staff;
DROP POLICY IF EXISTS "staff_admin_view_all" ON public.staff;
DROP POLICY IF EXISTS "staff_update_own" ON public.staff;
DROP POLICY IF EXISTS "staff_admin_insert" ON public.staff;
DROP POLICY IF EXISTS "staff_admin_update_all" ON public.staff;
DROP POLICY IF EXISTS "staff_admin_delete" ON public.staff;

-- 重新創建 staff 表的 RLS 政策
CREATE POLICY "staff_view_own" ON public.staff
FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    auth.uid() = user_id OR 
    auth.uid() = id
  )
);

CREATE POLICY "staff_admin_view_all" ON public.staff
FOR SELECT USING (
  auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid
);

CREATE POLICY "staff_update_own" ON public.staff
FOR UPDATE USING (
  auth.uid() IS NOT NULL AND (
    auth.uid() = user_id OR 
    auth.uid() = id
  )
);

CREATE POLICY "staff_admin_insert" ON public.staff
FOR INSERT WITH CHECK (
  auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid
);

CREATE POLICY "staff_admin_update_all" ON public.staff
FOR UPDATE USING (
  auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid
);

CREATE POLICY "staff_admin_delete" ON public.staff
FOR DELETE USING (
  auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid
);

-- 2. 更新 departments 表的 RLS 政策
DROP POLICY IF EXISTS "departments_view_all" ON public.departments;
DROP POLICY IF EXISTS "departments_admin_manage" ON public.departments;

CREATE POLICY "departments_view_all" ON public.departments
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "departments_admin_manage" ON public.departments
FOR ALL USING (
  auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid
);

-- 3. 更新 positions 表的 RLS 政策
DROP POLICY IF EXISTS "positions_view_all" ON public.positions;
DROP POLICY IF EXISTS "positions_admin_manage" ON public.positions;

CREATE POLICY "positions_view_all" ON public.positions
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "positions_admin_manage" ON public.positions
FOR ALL USING (
  auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid
);

-- 4. 更新 system_settings 表的 RLS 政策
DROP POLICY IF EXISTS "Admins can manage system settings" ON public.system_settings;

CREATE POLICY "Admins can manage system settings" ON public.system_settings
FOR ALL USING (
  auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
  public.is_current_user_admin_optimized()
);

-- 5. 更新所有相關的輔助函數
CREATE OR REPLACE FUNCTION public.get_current_user_role_simple()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  -- 檢查是否為超級管理員（使用正確的 UUID）
  SELECT CASE 
    WHEN auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid THEN 'admin'
    ELSE 'user'
  END;
$$;

-- 6. 更新 announcements 表的 RLS 政策
DROP POLICY IF EXISTS "All authenticated users can view announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;

CREATE POLICY "All authenticated users can view announcements" ON public.announcements
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage announcements" ON public.announcements
FOR ALL USING (
  public.is_current_user_admin_optimized() OR
  auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid
);

-- 7. 更新 companies 表的 RLS 政策
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong companies" ON public.companies;

CREATE POLICY "Enable all access for Liao Junxiong companies" ON public.companies
FOR ALL 
TO authenticated
USING (auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid)
WITH CHECK (auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid);

-- 8. 更新 branches 表的 RLS 政策
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong branches" ON public.branches;

CREATE POLICY "Enable all access for Liao Junxiong branches" ON public.branches
FOR ALL 
TO authenticated
USING (auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid)
WITH CHECK (auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid);

-- 9. 確保廖俊雄在 staff 表中的記錄有正確的 user_id
UPDATE public.staff 
SET user_id = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid,
    role = 'admin',
    role_id = 'admin'
WHERE email = 'flpliao@gmail.com' OR name = '廖俊雄';

-- 10. 驗證更新結果
SELECT id, user_id, name, email, role, role_id FROM public.staff 
WHERE email = 'flpliao@gmail.com' OR name = '廖俊雄';
