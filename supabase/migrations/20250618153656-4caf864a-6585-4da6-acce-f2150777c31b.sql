
-- 檢查並更新 departments 表格的 RLS 政策

-- 先刪除現有的政策（如果存在）
DROP POLICY IF EXISTS "Allow authenticated users to view departments" ON public.departments;
DROP POLICY IF EXISTS "Allow admin and authorized users to manage departments" ON public.departments;

-- 確保 RLS 已啟用
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- 允許所有認證用戶查看部門
CREATE POLICY "Allow authenticated users to view departments" ON public.departments
FOR SELECT USING (auth.uid() IS NOT NULL);

-- 允許管理員和廖俊雄新增、編輯、刪除部門
CREATE POLICY "Allow admin and authorized users to manage departments" ON public.departments
FOR ALL USING (
  auth.uid() IS NOT NULL AND (
    -- 檢查是否為廖俊雄（特定 UUID）
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- 或者檢查是否為管理員角色
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
);
