
-- 檢查當前的 departments 表格 RLS 政策並重新設定

-- 先刪除所有現有的 departments 表格政策
DROP POLICY IF EXISTS "Allow authenticated users to view departments" ON public.departments;
DROP POLICY IF EXISTS "Allow admin users to manage departments" ON public.departments;
DROP POLICY IF EXISTS "Allow admin and authorized users to manage departments" ON public.departments;

-- 確保 RLS 啟用
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- 重新創建更寬鬆的查看政策
CREATE POLICY "Allow all authenticated users to view departments" ON public.departments
FOR SELECT USING (auth.uid() IS NOT NULL);

-- 創建廖俊雄專用的管理政策 - 使用更直接的方式
CREATE POLICY "Allow Liao Junxiong admin access" ON public.departments
FOR ALL USING (
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

-- 額外創建一般管理員政策
CREATE POLICY "Allow general admin access" ON public.departments
FOR ALL USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- 確保 is_admin_user 函數正常運作
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE id = auth.uid() 
      AND role = 'admin'
    );
$$;

-- 為了確保廖俊雄能夠操作，也檢查 staff 表格是否有相應記錄
INSERT INTO public.staff (
  id, 
  name, 
  position, 
  department, 
  contact, 
  branch_name, 
  branch_id, 
  role
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  '廖俊雄',
  '最高管理者',
  '管理部',
  '0900-000-000',
  '總部',
  (SELECT id FROM public.branches LIMIT 1),
  'admin'
) ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  name = '廖俊雄',
  position = '最高管理者';
