
-- 首先檢查 staff 表是否有 user_id 欄位，如果沒有則添加（但不設定外鍵約束）
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'staff' AND column_name = 'user_id') THEN
        ALTER TABLE public.staff ADD COLUMN user_id UUID;
    END IF;
END $$;

-- 只更新那些 id 確實存在於 auth.users 表中的記錄
UPDATE public.staff 
SET user_id = id 
WHERE user_id IS NULL 
  AND id IN (SELECT id FROM auth.users);

-- 對於廖俊雄的特殊記錄，確保設定正確的 user_id
UPDATE public.staff 
SET user_id = '550e8400-e29b-41d4-a716-446655440001'::uuid
WHERE name = '廖俊雄' 
  AND id = '550e8400-e29b-41d4-a716-446655440001'::uuid;

-- 修正 RLS 政策，使用正確的 user_id 對應
DROP POLICY IF EXISTS "staff_select_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_insert_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_update_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_delete_policy" ON public.staff;

-- 創建正確的 RLS 政策，使用 user_id 而不是 id
CREATE POLICY "staff_select_policy" ON public.staff
FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    -- Users can view their own record using user_id
    auth.uid() = user_id OR
    -- 廖俊雄 (super admin) 可以查看所有記錄
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- Admins can view all records
    public.is_admin_user()
  )
);

CREATE POLICY "staff_insert_policy" ON public.staff
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND (
    -- 廖俊雄 (super admin) 可以新增記錄
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- Admins can insert records
    public.is_admin_user()
  )
);

CREATE POLICY "staff_update_policy" ON public.staff
FOR UPDATE USING (
  auth.uid() IS NOT NULL AND (
    -- Users can update their own record using user_id
    auth.uid() = user_id OR
    -- 廖俊雄 (super admin) 可以更新所有記錄
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- Admins can update all records
    public.is_admin_user()
  )
);

CREATE POLICY "staff_delete_policy" ON public.staff
FOR DELETE USING (
  auth.uid() IS NOT NULL AND (
    -- 廖俊雄 (super admin) 可以刪除記錄
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- Admins can delete records
    public.is_admin_user()
  )
);

-- 更新 is_admin_user 函數，使用正確的 user_id 欄位
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    -- Check if user is the super admin (廖俊雄)
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- Check if user has admin role using user_id
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    );
$$;

-- 更新 get_current_user_role_safe 函數，使用正確的 user_id 欄位
CREATE OR REPLACE FUNCTION public.get_current_user_role_safe()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.staff WHERE user_id = auth.uid() LIMIT 1),
    'user'
  );
$$;
