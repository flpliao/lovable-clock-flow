
-- 首先檢查 positions 表格是否有啟用 RLS 但沒有適當的政策
-- 如果啟用了 RLS，我們需要添加適當的政策讓管理員可以新增職位

-- 為 positions 表格創建適當的 RLS 政策
CREATE POLICY "Allow admin users to insert positions" 
ON public.positions 
FOR INSERT 
TO authenticated 
WITH CHECK (
  -- 允許廖俊雄（最高管理員）或其他管理員新增職位
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  public.is_admin_user()
);

CREATE POLICY "Allow admin users to select positions" 
ON public.positions 
FOR SELECT 
TO authenticated 
USING (
  -- 允許所有已認證用戶查看職位
  true
);

CREATE POLICY "Allow admin users to update positions" 
ON public.positions 
FOR UPDATE 
TO authenticated 
USING (
  -- 允許廖俊雄（最高管理員）或其他管理員更新職位
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  public.is_admin_user()
);

CREATE POLICY "Allow admin users to delete positions" 
ON public.positions 
FOR DELETE 
TO authenticated 
USING (
  -- 允許廖俊雄（最高管理員）或其他管理員刪除職位
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  public.is_admin_user()
);
