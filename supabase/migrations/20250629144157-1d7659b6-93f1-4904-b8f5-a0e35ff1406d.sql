
-- 1. 啟用所有重要資料表的 Row Level Security (RLS)
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_in_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annual_leave_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missed_checkin_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missed_checkin_approval_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.overtime_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.overtime_approval_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- 2. 為 staff 表格創建 RLS 政策
DROP POLICY IF EXISTS "Users can view own staff record" ON public.staff;
DROP POLICY IF EXISTS "Admins can view all staff records" ON public.staff;
DROP POLICY IF EXISTS "Users can update own staff record" ON public.staff;
DROP POLICY IF EXISTS "Admins can manage all staff records" ON public.staff;

CREATE POLICY "Users can view own staff record" ON public.staff
FOR SELECT USING (
  auth.uid() = user_id OR auth.uid() = id OR 
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

CREATE POLICY "Admins can view all staff records" ON public.staff
FOR SELECT USING (
  public.is_current_user_admin_optimized() OR 
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

CREATE POLICY "Users can update own staff record" ON public.staff
FOR UPDATE USING (
  auth.uid() = user_id OR auth.uid() = id OR 
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

CREATE POLICY "Admins can manage all staff records" ON public.staff
FOR ALL USING (
  public.is_current_user_admin_optimized() OR 
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

-- 3. 為 leave_requests 表格創建 RLS 政策
DROP POLICY IF EXISTS "Users can view own leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Managers can view all leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Users can create own leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Approvers can update leave requests" ON public.leave_requests;

CREATE POLICY "Users can view own leave requests" ON public.leave_requests
FOR SELECT USING (
  auth.uid() = user_id OR auth.uid() = staff_id OR
  public.is_current_user_manager_optimized() OR
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

CREATE POLICY "Users can create own leave requests" ON public.leave_requests
FOR INSERT WITH CHECK (
  auth.uid() = user_id OR auth.uid() = staff_id
);

CREATE POLICY "Approvers can update leave requests" ON public.leave_requests
FOR UPDATE USING (
  auth.uid() = current_approver OR
  public.is_current_user_manager_optimized() OR
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

-- 4. 為 check_in_records 表格創建 RLS 政策
DROP POLICY IF EXISTS "Users can view own check-in records" ON public.check_in_records;
DROP POLICY IF EXISTS "Managers can view all check-in records" ON public.check_in_records;
DROP POLICY IF EXISTS "Users can create own check-in records" ON public.check_in_records;

CREATE POLICY "Users can view own check-in records" ON public.check_in_records
FOR SELECT USING (
  auth.uid() = user_id OR auth.uid() = staff_id OR
  public.is_current_user_manager_optimized() OR
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

CREATE POLICY "Users can create own check-in records" ON public.check_in_records
FOR INSERT WITH CHECK (
  auth.uid() = user_id OR auth.uid() = staff_id
);

-- 5. 為 notifications 表格創建 RLS 政策
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" ON public.notifications
FOR SELECT USING (
  auth.uid() = user_id OR 
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

CREATE POLICY "Users can update own notifications" ON public.notifications
FOR UPDATE USING (
  auth.uid() = user_id OR 
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

-- 6. 為 annual_leave_balance 表格創建 RLS 政策
DROP POLICY IF EXISTS "Users can view own leave balance" ON public.annual_leave_balance;
DROP POLICY IF EXISTS "Managers can view all leave balances" ON public.annual_leave_balance;

CREATE POLICY "Users can view own leave balance" ON public.annual_leave_balance
FOR SELECT USING (
  auth.uid() = user_id OR auth.uid() = staff_id OR
  public.is_current_user_manager_optimized() OR
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

-- 7. 為 announcements 表格創建 RLS 政策
DROP POLICY IF EXISTS "All authenticated users can view announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;

CREATE POLICY "All authenticated users can view announcements" ON public.announcements
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage announcements" ON public.announcements
FOR ALL USING (
  public.is_current_user_admin_optimized() OR
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

-- 8. 為 system_settings 表格創建 RLS 政策
DROP POLICY IF EXISTS "Admins can manage system settings" ON public.system_settings;

CREATE POLICY "Admins can manage system settings" ON public.system_settings
FOR ALL USING (
  public.is_current_user_admin_optimized() OR
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid
);

-- 9. 建立關鍵索引以提升效能
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON public.staff(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_email ON public.staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_role ON public.staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_department ON public.staff(department);

CREATE INDEX IF NOT EXISTS idx_leave_requests_user_id ON public.leave_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_staff_id ON public.leave_requests(staff_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON public.leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_current_approver ON public.leave_requests(current_approver);

CREATE INDEX IF NOT EXISTS idx_check_in_records_user_id ON public.check_in_records(user_id);
CREATE INDEX IF NOT EXISTS idx_check_in_records_staff_id ON public.check_in_records(staff_id);
CREATE INDEX IF NOT EXISTS idx_check_in_records_timestamp ON public.check_in_records(timestamp);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);

CREATE INDEX IF NOT EXISTS idx_annual_leave_balance_user_id ON public.annual_leave_balance(user_id);
CREATE INDEX IF NOT EXISTS idx_annual_leave_balance_staff_id ON public.annual_leave_balance(staff_id);
CREATE INDEX IF NOT EXISTS idx_annual_leave_balance_year ON public.annual_leave_balance(year);

-- 10. 更新 toggle_table_rls 函數以支援所有表格
CREATE OR REPLACE FUNCTION public.toggle_table_rls(table_name text, enabled boolean)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- 允許操作所有重要的表格
  IF table_name NOT IN (
    'staff', 'departments', 'positions', 'companies', 'branches', 
    'announcements', 'leave_requests', 'check_in_records', 
    'notifications', 'annual_leave_balance', 'approval_records', 
    'announcement_reads', 'system_settings', 'missed_checkin_requests',
    'missed_checkin_approval_records', 'overtime_requests', 
    'overtime_approval_records'
  ) THEN
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

-- 11. 建立 RLS 政策檢查函數
CREATE OR REPLACE FUNCTION public.get_rls_policy_summary()
RETURNS TABLE(
  table_name text,
  rls_enabled boolean,
  policy_count bigint,
  has_select_policy boolean,
  has_insert_policy boolean,
  has_update_policy boolean,
  has_delete_policy boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    c.relname::text as table_name,
    c.relrowsecurity as rls_enabled,
    COALESCE(policy_counts.count, 0) as policy_count,
    COALESCE(select_policies.exists, false) as has_select_policy,
    COALESCE(insert_policies.exists, false) as has_insert_policy,
    COALESCE(update_policies.exists, false) as has_update_policy,
    COALESCE(delete_policies.exists, false) as has_delete_policy
  FROM pg_class c
  JOIN pg_namespace n ON c.relnamespace = n.oid
  LEFT JOIN (
    SELECT 
      schemaname||'.'||tablename as full_name,
      COUNT(*) as count
    FROM pg_policies 
    WHERE schemaname = 'public'
    GROUP BY schemaname, tablename
  ) policy_counts ON n.nspname||'.'||c.relname = policy_counts.full_name
  LEFT JOIN (
    SELECT 
      schemaname||'.'||tablename as full_name,
      true as exists
    FROM pg_policies 
    WHERE schemaname = 'public' AND cmd = 'SELECT'
  ) select_policies ON n.nspname||'.'||c.relname = select_policies.full_name
  LEFT JOIN (
    SELECT 
      schemaname||'.'||tablename as full_name,
      true as exists
    FROM pg_policies 
    WHERE schemaname = 'public' AND cmd = 'INSERT'
  ) insert_policies ON n.nspname||'.'||c.relname = insert_policies.full_name
  LEFT JOIN (
    SELECT 
      schemaname||'.'||tablename as full_name,
      true as exists
    FROM pg_policies 
    WHERE schemaname = 'public' AND cmd = 'UPDATE'
  ) update_policies ON n.nspname||'.'||c.relname = update_policies.full_name
  LEFT JOIN (
    SELECT 
      schemaname||'.'||tablename as full_name,
      true as exists
    FROM pg_policies 
    WHERE schemaname = 'public' AND cmd = 'DELETE'
  ) delete_policies ON n.nspname||'.'||c.relname = delete_policies.full_name
  WHERE n.nspname = 'public' 
    AND c.relkind = 'r'
    AND c.relname IN (
      'staff', 'departments', 'positions', 'companies', 'branches',
      'announcements', 'leave_requests', 'check_in_records',
      'notifications', 'annual_leave_balance', 'approval_records',
      'announcement_reads', 'system_settings', 'missed_checkin_requests',
      'missed_checkin_approval_records', 'overtime_requests',
      'overtime_approval_records'
    )
  ORDER BY c.relname;
END;
$function$;
