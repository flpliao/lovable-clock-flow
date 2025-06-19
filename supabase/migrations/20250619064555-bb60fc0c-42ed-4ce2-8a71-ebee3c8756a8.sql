
-- 先刪除可能已存在的政策，避免衝突
DROP POLICY IF EXISTS "Allow admin users to insert positions" ON public.positions;
DROP POLICY IF EXISTS "Allow admin users to select positions" ON public.positions;
DROP POLICY IF EXISTS "Allow admin users to update positions" ON public.positions;
DROP POLICY IF EXISTS "Allow admin users to delete positions" ON public.positions;
DROP POLICY IF EXISTS "Allow all authenticated users to view positions" ON public.positions;

-- 確保 positions 表格啟用 RLS
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;

-- 重新建立完整的 RLS 政策
-- 允許所有已認證用戶查看職位（因為職位是公共資料）
CREATE POLICY "Allow all authenticated users to view positions" 
ON public.positions 
FOR SELECT 
TO authenticated 
USING (true);

-- 允許管理員新增職位
CREATE POLICY "Allow admin users to insert positions" 
ON public.positions 
FOR INSERT 
TO authenticated 
WITH CHECK (
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  public.is_admin_user()
);

-- 允許管理員更新職位
CREATE POLICY "Allow admin users to update positions" 
ON public.positions 
FOR UPDATE 
TO authenticated 
USING (
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  public.is_admin_user()
);

-- 允許管理員刪除職位（軟刪除，設定 is_active = false）
CREATE POLICY "Allow admin users to delete positions" 
ON public.positions 
FOR DELETE 
TO authenticated 
USING (
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  public.is_admin_user()
);
