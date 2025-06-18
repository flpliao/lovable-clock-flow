
-- 修正 departments 表格的 RLS 政策和相關函數

-- 先刪除現有的政策
DROP POLICY IF EXISTS "Allow authenticated users to view departments" ON public.departments;
DROP POLICY IF EXISTS "Allow admin and authorized users to manage departments" ON public.departments;

-- 重新創建更簡單的 get_current_user_role_safe 函數
CREATE OR REPLACE FUNCTION public.get_current_user_role_safe()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.staff WHERE id = auth.uid() LIMIT 1),
    'user'
  );
$$;

-- 創建一個檢查廖俊雄權限的函數
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    (SELECT role FROM public.staff WHERE id = auth.uid() LIMIT 1) = 'admin';
$$;

-- 確保 RLS 已啟用
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- 允許所有認證用戶查看部門
CREATE POLICY "Allow authenticated users to view departments" ON public.departments
FOR SELECT USING (auth.uid() IS NOT NULL);

-- 允許管理員和廖俊雄管理部門
CREATE POLICY "Allow admin users to manage departments" ON public.departments
FOR ALL USING (public.is_admin_user());
