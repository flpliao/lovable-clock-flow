
-- 更新 departments 表格的 RLS 政策以確保廖俊雄可以新增部門

-- 先刪除現有的政策
DROP POLICY IF EXISTS "Allow authenticated users to view departments" ON public.departments;
DROP POLICY IF EXISTS "Allow admin and authorized users to manage departments" ON public.departments;

-- 確保 RLS 已啟用
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- 允許所有認證用戶查看部門
CREATE POLICY "Allow authenticated users to view departments" ON public.departments
FOR SELECT USING (auth.uid() IS NOT NULL);

-- 允許廖俊雄和管理員管理部門（使用更簡單直接的條件）
CREATE POLICY "Allow admin and authorized users to manage departments" ON public.departments
FOR ALL USING (
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  public.get_current_user_role_safe() = 'admin'
);
