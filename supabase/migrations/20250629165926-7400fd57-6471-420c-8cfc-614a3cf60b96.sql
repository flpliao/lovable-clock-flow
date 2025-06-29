
-- 修正 staff 表的 RLS 政策，確保權限邏輯正確
-- 首先刪除現有的政策
DROP POLICY IF EXISTS "staff_view_authenticated_new" ON public.staff;
DROP POLICY IF EXISTS "staff_admin_manage_new" ON public.staff;

-- 建立新的安全 RLS 政策
-- 1. 所有認證用戶都可以查看 staff 資料（符合現有邏輯）
CREATE POLICY "staff_authenticated_select" ON public.staff
FOR SELECT TO authenticated
USING (true);

-- 2. 管理員可以進行所有操作
CREATE POLICY "staff_admin_all_operations" ON public.staff
FOR ALL TO authenticated
USING (
  -- 超級管理員（廖俊雄）
  auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
  -- 或者是 role 為 admin 的用戶
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE (s.user_id = auth.uid() OR s.id = auth.uid()) 
    AND s.role = 'admin'
  )
)
WITH CHECK (
  -- 同樣的檢查邏輯用於 INSERT/UPDATE
  auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE (s.user_id = auth.uid() OR s.id = auth.uid()) 
    AND s.role = 'admin'
  )
);

-- 3. 員工可以更新自己的基本資料
CREATE POLICY "staff_self_update" ON public.staff
FOR UPDATE TO authenticated
USING (
  auth.uid() = user_id OR auth.uid() = id
)
WITH CHECK (
  auth.uid() = user_id OR auth.uid() = id
);

-- 確保 RLS 已啟用
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- 修正權限檢查函數，避免在 RLS 政策中造成遞迴
CREATE OR REPLACE FUNCTION public.is_current_user_admin_safe()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    CASE 
      -- 超級管理員檢查
      WHEN auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid THEN true
      WHEN auth.uid() IS NULL THEN false
      -- 直接查詢 staff 表，不觸發 RLS
      ELSE EXISTS(
        SELECT 1 FROM public.staff 
        WHERE (user_id = auth.uid() OR id = auth.uid()) 
        AND role = 'admin'
      )
    END;
$$;

-- 測試 RLS 政策是否正常運作
CREATE OR REPLACE FUNCTION public.test_staff_rls()
RETURNS TABLE(
  test_name text,
  result boolean,
  message text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'RLS_ENABLED'::text,
    (SELECT relrowsecurity FROM pg_class WHERE relname = 'staff' AND relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public'))::boolean,
    'Staff table RLS status'::text
  UNION ALL
  SELECT 
    'POLICY_COUNT'::text,
    (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'staff' AND schemaname = 'public') > 0,
    'Number of policies on staff table'::text
  UNION ALL
  SELECT 
    'ADMIN_FUNCTION'::text,
    public.is_current_user_admin_safe(),
    'Admin function test'::text;
END;
$$;
