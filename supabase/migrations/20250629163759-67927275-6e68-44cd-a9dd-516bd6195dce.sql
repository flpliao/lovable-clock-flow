
-- 修復 RLS 政策的遞迴問題
-- 首先刪除所有可能的 staff 表政策
DROP POLICY IF EXISTS "staff_secure_select" ON public.staff;
DROP POLICY IF EXISTS "staff_secure_insert" ON public.staff;
DROP POLICY IF EXISTS "staff_secure_update" ON public.staff;
DROP POLICY IF EXISTS "staff_secure_delete" ON public.staff;
DROP POLICY IF EXISTS "staff_view_authenticated" ON public.staff;
DROP POLICY IF EXISTS "staff_admin_full_access" ON public.staff;
DROP POLICY IF EXISTS "staff_view_all_authenticated" ON public.staff;

-- 重新建立安全的 staff 表 RLS 政策，避免遞迴查詢
CREATE POLICY "staff_view_authenticated_new" ON public.staff
FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "staff_admin_manage_new" ON public.staff
FOR ALL TO authenticated
USING (
  auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
  auth.uid() IN (
    SELECT user_id FROM public.staff 
    WHERE role = 'admin' AND user_id IS NOT NULL
  )
)
WITH CHECK (
  auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
  auth.uid() IN (
    SELECT user_id FROM public.staff 
    WHERE role = 'admin' AND user_id IS NOT NULL
  )
);

-- 修復權限檢查函數，避免遞迴問題
CREATE OR REPLACE FUNCTION public.get_current_user_staff_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(role, 'user') 
  FROM public.staff 
  WHERE user_id = auth.uid() OR id = auth.uid() 
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    CASE 
      WHEN auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid THEN true
      WHEN auth.uid() IS NULL THEN false
      ELSE EXISTS(
        SELECT 1 FROM public.staff 
        WHERE (user_id = auth.uid() OR id = auth.uid()) 
        AND role = 'admin'
      )
    END;
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_manager()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    CASE 
      WHEN public.is_current_user_admin() THEN true
      WHEN auth.uid() IS NULL THEN false
      ELSE EXISTS(
        SELECT 1 FROM public.staff 
        WHERE (user_id = auth.uid() OR id = auth.uid()) 
        AND role IN ('manager', 'hr_manager')
      )
    END;
$$;

-- 確保廖俊雄的資料正確設定
UPDATE public.staff 
SET 
  user_id = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid,
  role = 'admin'
WHERE email = 'flpliao@gmail.com' OR name = '廖俊雄';

-- 建立一個測試函數來檢查認證狀態
CREATE OR REPLACE FUNCTION public.debug_auth_status()
RETURNS TABLE(
  current_user_id uuid,
  session_exists boolean,
  staff_count bigint,
  matching_staff_count bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    auth.uid() as current_user_id,
    (auth.uid() IS NOT NULL) as session_exists,
    (SELECT COUNT(*) FROM public.staff) as staff_count,
    (SELECT COUNT(*) FROM public.staff WHERE user_id = auth.uid() OR id = auth.uid()) as matching_staff_count;
$$;
