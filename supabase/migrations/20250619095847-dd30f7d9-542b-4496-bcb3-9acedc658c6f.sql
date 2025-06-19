
-- 修正 departments 表格的 RLS 政策錯誤

-- 先刪除現有的政策
DROP POLICY IF EXISTS "Allow authenticated users to view departments" ON public.departments;
DROP POLICY IF EXISTS "Allow admin users to manage departments" ON public.departments;
DROP POLICY IF EXISTS "Allow Liao Junxiong admin access" ON public.departments;
DROP POLICY IF EXISTS "Allow general admin access" ON public.departments;

-- 確保 RLS 已啟用
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- 創建新的 RLS 政策 - 允許所有認證用戶查看部門
CREATE POLICY "departments_select_policy" ON public.departments
FOR SELECT USING (auth.uid() IS NOT NULL);

-- 創建新的 RLS 政策 - 允許管理員和特定用戶管理部門
CREATE POLICY "departments_management_policy" ON public.departments
FOR ALL USING (
  auth.uid() IS NOT NULL AND (
    -- 允許廖俊雄 (超級管理員)
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- 允許其他管理員
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
);

-- 確保 staff 表格也有正確的 RLS 政策
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- 為 staff 表格創建查看政策
DROP POLICY IF EXISTS "staff_select_policy" ON public.staff;
CREATE POLICY "staff_select_policy" ON public.staff
FOR SELECT USING (auth.uid() IS NOT NULL);

-- 為 staff 表格創建管理政策
DROP POLICY IF EXISTS "staff_management_policy" ON public.staff;
CREATE POLICY "staff_management_policy" ON public.staff
FOR ALL USING (
  auth.uid() IS NOT NULL AND (
    -- 允許廖俊雄 (超級管理員)
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- 允許查看/編輯自己的資料
    auth.uid() = id OR
    -- 允許管理員管理所有員工
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.id = auth.uid() 
      AND s.role = 'admin'
    )
  )
);

-- 確保其他相關表格也有適當的 RLS 政策
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "positions_select_policy" ON public.positions;
CREATE POLICY "positions_select_policy" ON public.positions
FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "positions_management_policy" ON public.positions;
CREATE POLICY "positions_management_policy" ON public.positions
FOR ALL USING (
  auth.uid() IS NOT NULL AND (
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  )
);
