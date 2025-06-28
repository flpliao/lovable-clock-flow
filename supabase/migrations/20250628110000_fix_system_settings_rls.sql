
-- 修復 system_settings 表格的 RLS 政策

-- 先刪除現有可能有問題的政策
DO $$ 
BEGIN
  -- 刪除可能存在的舊政策
  DROP POLICY IF EXISTS "Enable read access for all users" ON public.system_settings;
  DROP POLICY IF EXISTS "Enable write access for admins" ON public.system_settings;
  DROP POLICY IF EXISTS "Allow authenticated users to read system settings" ON public.system_settings;
  DROP POLICY IF EXISTS "Allow admins to manage system settings" ON public.system_settings;
EXCEPTION
  WHEN OTHERS THEN
    NULL; -- 忽略錯誤
END $$;

-- 創建新的 RLS 政策
-- 1. 允許所有認證用戶讀取系統設定
CREATE POLICY "authenticated_users_can_read_system_settings" 
ON public.system_settings FOR SELECT 
TO authenticated 
USING (true);

-- 2. 允許管理員和有權限的用戶寫入系統設定
CREATE POLICY "authorized_users_can_write_system_settings" 
ON public.system_settings FOR ALL 
TO authenticated 
USING (
  -- 廖俊雄永遠有權限
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  -- 管理員有權限
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
)
WITH CHECK (
  -- 廖俊雄永遠有權限
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  -- 管理員有權限
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager')
  )
);

-- 確保 RLS 已啟用
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
