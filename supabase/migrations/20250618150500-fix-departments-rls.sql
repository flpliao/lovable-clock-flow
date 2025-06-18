
-- 為 departments 表格創建 RLS 政策

-- 先檢查並刪除現有的政策（如果存在）
DROP POLICY IF EXISTS "Allow authenticated users to view departments" ON public.departments;
DROP POLICY IF EXISTS "Allow admin and authorized users to manage departments" ON public.departments;

-- 允許所有認證用戶查看部門
CREATE POLICY "Allow authenticated users to view departments" ON public.departments
FOR SELECT USING (auth.uid() IS NOT NULL);

-- 允許管理員和授權用戶管理部門
CREATE POLICY "Allow admin and authorized users to manage departments" ON public.departments
FOR ALL USING (
  auth.uid() IS NOT NULL AND (
    public.get_current_user_role_safe() = 'admin' OR
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE id = auth.uid() 
      AND (role = 'admin' OR name = '廖俊雄')
    )
  )
);
