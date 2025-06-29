
-- 修正 staff 表的 RLS 政策無限遞迴問題
-- 首先刪除所有現有的 staff 表 RLS 政策
DROP POLICY IF EXISTS "Users can view own staff record" ON public.staff;
DROP POLICY IF EXISTS "Admins can view all staff records" ON public.staff;
DROP POLICY IF EXISTS "Users can update own staff record" ON public.staff;
DROP POLICY IF EXISTS "Admins can manage all staff records" ON public.staff;
DROP POLICY IF EXISTS "staff_view_own" ON public.staff;
DROP POLICY IF EXISTS "staff_admin_view_all" ON public.staff;
DROP POLICY IF EXISTS "staff_update_own" ON public.staff;
DROP POLICY IF EXISTS "staff_admin_insert" ON public.staff;
DROP POLICY IF EXISTS "staff_admin_update_all" ON public.staff;
DROP POLICY IF EXISTS "staff_admin_delete" ON public.staff;

-- 創建新的安全 RLS 政策，避免遞迴查詢
-- 1. 員工可以查看自己的資料
CREATE POLICY "staff_view_own" ON public.staff
FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    auth.uid() = user_id OR 
    auth.uid() = id
  )
);

-- 2. 管理員可以查看所有資料（使用固定的超級管理員 UUID）
CREATE POLICY "staff_admin_view_all" ON public.staff
FOR SELECT USING (
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

-- 3. 員工可以更新自己的資料
CREATE POLICY "staff_update_own" ON public.staff
FOR UPDATE USING (
  auth.uid() IS NOT NULL AND (
    auth.uid() = user_id OR 
    auth.uid() = id
  )
);

-- 4. 管理員可以插入新員工資料
CREATE POLICY "staff_admin_insert" ON public.staff
FOR INSERT WITH CHECK (
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

-- 5. 管理員可以更新所有員工資料
CREATE POLICY "staff_admin_update_all" ON public.staff
FOR UPDATE USING (
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

-- 6. 管理員可以刪除員工資料
CREATE POLICY "staff_admin_delete" ON public.staff
FOR DELETE USING (
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

-- 創建一個簡單的輔助函數，避免在 RLS 政策中查詢 staff 表
CREATE OR REPLACE FUNCTION public.get_current_user_role_simple()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  -- 直接檢查是否為超級管理員，避免查詢 staff 表
  SELECT CASE 
    WHEN auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid THEN 'admin'
    ELSE 'user'
  END;
$$;

-- 為其他需要角色檢查的表格創建更安全的政策，先刪除現有政策
-- departments 表
DROP POLICY IF EXISTS "departments_select_policy" ON public.departments;
DROP POLICY IF EXISTS "departments_management_policy" ON public.departments;
DROP POLICY IF EXISTS "departments_view_all" ON public.departments;
DROP POLICY IF EXISTS "departments_admin_manage" ON public.departments;

CREATE POLICY "departments_view_all" ON public.departments
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "departments_admin_manage" ON public.departments
FOR ALL USING (
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

-- positions 表
DROP POLICY IF EXISTS "positions_select_policy" ON public.positions;
DROP POLICY IF EXISTS "positions_management_policy" ON public.positions;
DROP POLICY IF EXISTS "positions_view_all" ON public.positions;
DROP POLICY IF EXISTS "positions_admin_manage" ON public.positions;

CREATE POLICY "positions_view_all" ON public.positions
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "positions_admin_manage" ON public.positions
FOR ALL USING (
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);
