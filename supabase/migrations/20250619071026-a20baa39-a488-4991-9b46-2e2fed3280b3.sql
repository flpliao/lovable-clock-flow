
-- 更新 toggle_table_rls 函數，加入 positions 表格支援
CREATE OR REPLACE FUNCTION public.toggle_table_rls(table_name text, enabled boolean)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- 只允許操作特定的表格，加入 positions 表格
  IF table_name NOT IN ('staff', 'departments', 'positions', 'companies', 'branches', 'announcements', 'leave_requests', 'check_in_records', 'notifications', 'annual_leave_balance', 'approval_records', 'announcement_reads') THEN
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
    RETURN false;
END;
$function$
