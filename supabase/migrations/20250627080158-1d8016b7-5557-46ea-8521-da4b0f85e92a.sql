
-- 創建一個修正版的函數來同步 auth.users 到 staff 表
CREATE OR REPLACE FUNCTION public.sync_users_to_staff()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- 插入所有在 auth.users 中但不在 staff 表中的用戶
  -- 使用 ON CONFLICT 來處理重複的 email
  INSERT INTO public.staff (
    id,
    user_id,
    name,
    position,
    department,
    branch_id,
    branch_name,
    contact,
    role,
    role_id,
    email
  )
  SELECT 
    au.id,
    au.id as user_id,
    COALESCE(au.raw_user_meta_data->>'name', au.email) as name,
    '一般職員' as position,
    '待分配部門' as department,
    (SELECT id FROM public.branches LIMIT 1) as branch_id,
    (SELECT name FROM public.branches LIMIT 1) as branch_name,
    au.email as contact,
    'user' as role,
    'user' as role_id,
    au.email
  FROM auth.users au
  WHERE au.id NOT IN (SELECT COALESCE(user_id, id) FROM public.staff WHERE user_id IS NOT NULL)
    AND au.email IS NOT NULL
    AND au.email NOT IN (SELECT email FROM public.staff WHERE email IS NOT NULL)
  ON CONFLICT (email) DO NOTHING;

  -- 更新沒有 user_id 的現有 staff 記錄
  UPDATE public.staff 
  SET user_id = id 
  WHERE user_id IS NULL 
    AND id IN (SELECT id FROM auth.users);

  -- 對於已存在 email 但沒有 user_id 的記錄，嘗試匹配並更新
  UPDATE public.staff s
  SET user_id = au.id
  FROM auth.users au
  WHERE s.email = au.email 
    AND s.user_id IS NULL
    AND au.id IS NOT NULL;

  -- 確保所有 staff 記錄都有 email（如果沒有的話）
  UPDATE public.staff s
  SET email = au.email
  FROM auth.users au
  WHERE s.user_id = au.id 
    AND (s.email IS NULL OR s.email = '');

END;
$$;

-- 執行同步函數
SELECT public.sync_users_to_staff();

-- 創建觸發器函數，當新用戶註冊時自動創建 staff 記錄
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- 插入新的 staff 記錄，使用 ON CONFLICT 處理重複情況
  INSERT INTO public.staff (
    id,
    user_id,
    name,
    position,
    department,
    branch_id,
    branch_name,
    contact,
    role,
    role_id,
    email
  )
  VALUES (
    NEW.id,
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    '一般職員',
    '待分配部門',
    (SELECT id FROM public.branches LIMIT 1),
    (SELECT name FROM public.branches LIMIT 1),
    NEW.email,
    'user',
    'user',
    NEW.email
  )
  ON CONFLICT (email) DO UPDATE SET
    user_id = NEW.id
  WHERE staff.user_id IS NULL;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- 如果插入失敗，忽略錯誤
    RETURN NEW;
END;
$$;

-- 創建觸發器（如果不存在）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 創建一個檢查同步狀態的函數
CREATE OR REPLACE FUNCTION public.check_user_staff_sync()
RETURNS TABLE(
  total_auth_users bigint,
  total_staff_records bigint,
  synced_records bigint,
  unsynced_auth_users bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    (SELECT COUNT(*) FROM auth.users) as total_auth_users,
    (SELECT COUNT(*) FROM public.staff) as total_staff_records,
    (SELECT COUNT(*) FROM public.staff WHERE user_id IS NOT NULL) as synced_records,
    (SELECT COUNT(*) FROM auth.users au WHERE au.id NOT IN 
      (SELECT COALESCE(user_id, id) FROM public.staff WHERE user_id IS NOT NULL)
    ) as unsynced_auth_users;
$$;
