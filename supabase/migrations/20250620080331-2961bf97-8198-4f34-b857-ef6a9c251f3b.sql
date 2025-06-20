
-- 首先確保 system_settings 表格已啟用 RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 更新 toggle_table_rls 函數，加入 system_settings 表格的支援
CREATE OR REPLACE FUNCTION public.toggle_table_rls(table_name text, enabled boolean)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- 只允許操作特定的表格，包含 system_settings
  IF table_name NOT IN ('staff', 'departments', 'positions', 'companies', 'branches', 'announcements', 'leave_requests', 'check_in_records', 'notifications', 'annual_leave_balance', 'approval_records', 'announcement_reads', 'system_settings') THEN
    RAISE EXCEPTION 'Table % is not allowed for RLS management', table_name;
  END IF;
  
  -- 執行 ALTER TABLE 指令
  IF enabled THEN
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
  ELSE
    EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', table_name);
  END IF;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error toggling RLS for table %: %', table_name, SQLERRM;
    RETURN false;
END;
$function$;

-- 為 system_settings 表格創建基本的 RLS 政策（如果不存在的話）
DO $$
BEGIN
  -- 檢查是否已存在政策
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'system_settings' 
    AND policyname = 'Enable read access for all users'
  ) THEN
    -- 創建允許所有用戶讀取的政策
    CREATE POLICY "Enable read access for all users" ON public.system_settings
      FOR SELECT USING (true);
  END IF;

  -- 檢查管理員寫入政策是否存在
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'system_settings' 
    AND policyname = 'Enable write access for admins'
  ) THEN
    -- 創建允許管理員寫入的政策
    CREATE POLICY "Enable write access for admins" ON public.system_settings
      FOR ALL USING (public.is_admin_user());
  END IF;
END $$;
