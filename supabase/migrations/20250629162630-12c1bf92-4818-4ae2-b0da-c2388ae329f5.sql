
-- 完整清理所有依賴於舊函數的 RLS 政策，然後重建權限系統

-- 第一階段：清理所有可能依賴舊函數的 RLS 政策
-- 清理 leave_requests 表的所有政策
DROP POLICY IF EXISTS "Users can view own leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Users can create their own leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Users can update their own pending leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Managers can view requests for approval" ON public.leave_requests;
DROP POLICY IF EXISTS "Managers can update leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Admins can view all leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Approvers can update leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Managers can view all leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Approvers can update assigned leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_select_policy" ON public.leave_requests;

-- 清理 check_in_records 表的政策
DROP POLICY IF EXISTS "Users can view own check-in records" ON public.check_in_records;
DROP POLICY IF EXISTS "Managers can view all check-in records" ON public.check_in_records;
DROP POLICY IF EXISTS "Users can insert own check-in records" ON public.check_in_records;

-- 清理 annual_leave_balance 表的政策
DROP POLICY IF EXISTS "Users can view own leave balance" ON public.annual_leave_balance;
DROP POLICY IF EXISTS "Managers can view all leave balances" ON public.annual_leave_balance;
DROP POLICY IF EXISTS "System can manage leave balances" ON public.annual_leave_balance;

-- 清理 approval_records 表的政策
DROP POLICY IF EXISTS "Users can view related approval records" ON public.approval_records;
DROP POLICY IF EXISTS "Approvers can manage approval records" ON public.approval_records;

-- 清理 notifications 表的政策
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Managers can manage notifications" ON public.notifications;

-- 清理 announcements 表的政策
DROP POLICY IF EXISTS "All authenticated users can view announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can manage announcements" ON public.announcements;

-- 清理 system_settings 表的政策
DROP POLICY IF EXISTS "Admins can manage system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.system_settings;
DROP POLICY IF EXISTS "Enable write access for admins" ON public.system_settings;

-- 清理 staff 表的所有政策
DROP POLICY IF EXISTS "Users can view own staff record" ON public.staff;
DROP POLICY IF EXISTS "Admins can view all staff records" ON public.staff;
DROP POLICY IF EXISTS "Users can update own staff record" ON public.staff;
DROP POLICY IF EXISTS "Admins can manage all staff records" ON public.staff;

-- 清理 missed_checkin_requests 表的政策
DROP POLICY IF EXISTS "Users can view their own missed checkin requests" ON public.missed_checkin_requests;
DROP POLICY IF EXISTS "Users can create missed checkin requests" ON public.missed_checkin_requests;
DROP POLICY IF EXISTS "Managers can view pending requests for approval" ON public.missed_checkin_requests;
DROP POLICY IF EXISTS "Managers can update missed checkin requests" ON public.missed_checkin_requests;

-- 第二階段：現在可以安全地刪除舊函數
DROP FUNCTION IF EXISTS public.get_current_user_role_simple() CASCADE;
DROP FUNCTION IF EXISTS public.is_current_user_admin_optimized() CASCADE;
DROP FUNCTION IF EXISTS public.is_current_user_manager_optimized() CASCADE;

-- 第三階段：建立新的統一權限檢查函數
CREATE OR REPLACE FUNCTION public.get_current_user_staff_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.staff 
     WHERE user_id = auth.uid() OR id = auth.uid() 
     LIMIT 1),
    'user'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
    public.get_current_user_staff_role() = 'admin';
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_manager()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    public.is_current_user_admin() OR
    public.get_current_user_staff_role() IN ('manager', 'hr_manager');
$$;

-- 第四階段：重建所有必要的 RLS 政策
-- Staff 表 - 允許所有認證用戶查看，管理員完全管理
CREATE POLICY "staff_view_all_authenticated" ON public.staff
FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "staff_admin_full_access" ON public.staff
FOR ALL TO authenticated
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

-- Leave Requests 表 - 用戶看自己的，管理員看全部
CREATE POLICY "leave_requests_user_access" ON public.leave_requests
FOR SELECT TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR 
    staff_id = auth.uid() OR
    public.is_current_user_manager()
  )
);

CREATE POLICY "leave_requests_user_insert" ON public.leave_requests
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR 
    staff_id = auth.uid()
  )
);

CREATE POLICY "leave_requests_user_update" ON public.leave_requests
FOR UPDATE TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    ((user_id = auth.uid() OR staff_id = auth.uid()) AND status = 'pending') OR
    public.is_current_user_manager() OR
    current_approver = auth.uid()
  )
);

-- Check-in Records 表
CREATE POLICY "check_in_records_user_access" ON public.check_in_records
FOR SELECT TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR
    staff_id = auth.uid() OR
    public.is_current_user_manager()
  )
);

CREATE POLICY "check_in_records_user_insert" ON public.check_in_records
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR
    staff_id = auth.uid()
  )
);

-- Annual Leave Balance 表
CREATE POLICY "annual_leave_balance_user_access" ON public.annual_leave_balance
FOR SELECT TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    staff_id = auth.uid() OR
    user_id = auth.uid() OR
    public.is_current_user_manager()
  )
);

CREATE POLICY "annual_leave_balance_admin_manage" ON public.annual_leave_balance
FOR ALL TO authenticated
USING (public.is_current_user_admin())
WITH CHECK (auth.uid() IS NOT NULL);

-- Approval Records 表
CREATE POLICY "approval_records_user_access" ON public.approval_records
FOR SELECT TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    approver_id = auth.uid() OR
    public.is_current_user_manager()
  )
);

CREATE POLICY "approval_records_manage" ON public.approval_records
FOR ALL TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    approver_id = auth.uid() OR
    public.is_current_user_admin()
  )
)
WITH CHECK (auth.uid() IS NOT NULL);

-- Notifications 表
CREATE POLICY "notifications_user_access" ON public.notifications
FOR SELECT TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR
    public.is_current_user_manager()
  )
);

CREATE POLICY "notifications_admin_manage" ON public.notifications
FOR ALL TO authenticated
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

-- Announcements 表
CREATE POLICY "announcements_view_all" ON public.announcements
FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "announcements_manager_manage" ON public.announcements
FOR ALL TO authenticated
USING (public.is_current_user_manager())
WITH CHECK (public.is_current_user_manager());

-- System Settings 表
CREATE POLICY "system_settings_view_all" ON public.system_settings
FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "system_settings_admin_manage" ON public.system_settings
FOR ALL TO authenticated
USING (public.is_current_user_admin())
WITH CHECK (public.is_current_user_admin());

-- Missed Checkin Requests 表
CREATE POLICY "missed_checkin_requests_user_access" ON public.missed_checkin_requests
FOR SELECT TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    staff_id = auth.uid() OR
    public.is_current_user_manager()
  )
);

CREATE POLICY "missed_checkin_requests_user_insert" ON public.missed_checkin_requests
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND staff_id = auth.uid()
);

CREATE POLICY "missed_checkin_requests_manager_update" ON public.missed_checkin_requests
FOR UPDATE TO authenticated
USING (public.is_current_user_manager());

-- 確保廖俊雄的資料正確設定
UPDATE public.staff 
SET 
  user_id = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid,
  role = 'admin',
  role_id = 'admin'
WHERE email = 'flpliao@gmail.com' OR name = '廖俊雄';
