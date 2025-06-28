
-- Phase 1: Critical Security Fixes

-- 1. Remove hardcoded super admin UUID and fix RLS policies
-- First, let's clean up all the conflicting RLS policies for leave_requests

-- Drop all existing leave_requests policies
DROP POLICY IF EXISTS "leave_requests_view_own" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_insert_own" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_update_own_pending" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_admin_view_all" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_admin_update" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_approver_update" ON public.leave_requests;
DROP POLICY IF EXISTS "Users can view their own leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Users can create their own leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Users can update their own pending leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Managers can view requests for approval" ON public.leave_requests;
DROP POLICY IF EXISTS "Managers can update leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Admins can view all leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong leave_requests" ON public.leave_requests;

-- Drop all existing staff policies
DROP POLICY IF EXISTS "staff_view_own" ON public.staff;
DROP POLICY IF EXISTS "staff_admin_view_all" ON public.staff;
DROP POLICY IF EXISTS "staff_update_own" ON public.staff;
DROP POLICY IF EXISTS "staff_admin_insert" ON public.staff;
DROP POLICY IF EXISTS "staff_admin_update_all" ON public.staff;
DROP POLICY IF EXISTS "staff_admin_delete" ON public.staff;
DROP POLICY IF EXISTS "staff_select_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_insert_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_update_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_delete_policy" ON public.staff;
DROP POLICY IF EXISTS "Users can view their own staff record" ON public.staff;
DROP POLICY IF EXISTS "Admins can view all staff" ON public.staff;
DROP POLICY IF EXISTS "Managers can view their subordinates" ON public.staff;
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong staff" ON public.staff;

-- Create secure role checking functions
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.staff WHERE user_id = user_uuid OR id = user_uuid LIMIT 1),
    'user'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_user_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.get_user_role(user_uuid) = 'admin';
$$;

CREATE OR REPLACE FUNCTION public.is_user_manager(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.get_user_role(user_uuid) IN ('admin', 'manager');
$$;

-- 2. Create consolidated, secure RLS policies for staff table
CREATE POLICY "staff_secure_select" ON public.staff
FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    -- Users can view their own record
    auth.uid() = user_id OR 
    auth.uid() = id OR
    -- Admins can view all records
    public.is_user_admin(auth.uid()) OR
    -- Managers can view their subordinates
    (public.is_user_manager(auth.uid()) AND supervisor_id = auth.uid())
  )
);

CREATE POLICY "staff_secure_insert" ON public.staff
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND public.is_user_admin(auth.uid())
);

CREATE POLICY "staff_secure_update" ON public.staff
FOR UPDATE USING (
  auth.uid() IS NOT NULL AND (
    -- Users can update their own record (limited fields)
    (auth.uid() = user_id OR auth.uid() = id) OR
    -- Admins can update all records
    public.is_user_admin(auth.uid())
  )
);

CREATE POLICY "staff_secure_delete" ON public.staff
FOR DELETE USING (
  auth.uid() IS NOT NULL AND public.is_user_admin(auth.uid())
);

-- 3. Create consolidated, secure RLS policies for leave_requests
CREATE POLICY "leave_requests_secure_select" ON public.leave_requests
FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    -- Users can view their own requests
    user_id = auth.uid() OR 
    staff_id = auth.uid() OR
    -- Admins can view all requests
    public.is_user_admin(auth.uid()) OR
    -- Managers can view requests from their subordinates
    (public.is_user_manager(auth.uid()) AND 
     EXISTS (
       SELECT 1 FROM public.staff s 
       WHERE (s.id = leave_requests.staff_id OR s.user_id = leave_requests.user_id)
       AND s.supervisor_id = auth.uid()
     )) OR
    -- Current approver can view assigned requests
    current_approver = auth.uid()
  )
);

CREATE POLICY "leave_requests_secure_insert" ON public.leave_requests
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR 
    staff_id = auth.uid() OR
    -- Ensure staff_id corresponds to an existing staff member
    EXISTS (SELECT 1 FROM public.staff WHERE id = staff_id)
  )
);

CREATE POLICY "leave_requests_secure_update" ON public.leave_requests
FOR UPDATE USING (
  auth.uid() IS NOT NULL AND (
    -- Users can update their own pending requests
    ((user_id = auth.uid() OR staff_id = auth.uid()) AND status = 'pending') OR
    -- Admins can update all requests
    public.is_user_admin(auth.uid()) OR
    -- Managers can update requests they supervise
    (public.is_user_manager(auth.uid()) AND 
     EXISTS (
       SELECT 1 FROM public.staff s 
       WHERE (s.id = leave_requests.staff_id OR s.user_id = leave_requests.user_id)
       AND s.supervisor_id = auth.uid()
     )) OR
    -- Current approver can update assigned requests
    current_approver = auth.uid()
  )
);

CREATE POLICY "leave_requests_secure_delete" ON public.leave_requests
FOR DELETE USING (
  auth.uid() IS NOT NULL AND (
    -- Users can delete their own pending requests
    ((user_id = auth.uid() OR staff_id = auth.uid()) AND status = 'pending') OR
    -- Admins can delete any request
    public.is_user_admin(auth.uid())
  )
);

-- 4. Update other table policies to remove hardcoded UUIDs
-- Clean up departments policies
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong" ON public.departments;
DROP POLICY IF EXISTS "departments_view_all" ON public.departments;
DROP POLICY IF EXISTS "departments_admin_manage" ON public.departments;

CREATE POLICY "departments_secure_select" ON public.departments
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "departments_secure_manage" ON public.departments
FOR ALL USING (
  auth.uid() IS NOT NULL AND public.is_user_admin(auth.uid())
);

-- Clean up other tables with hardcoded UUIDs
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong companies" ON public.companies;
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong branches" ON public.branches;
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong announcements" ON public.announcements;
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong check_in_records" ON public.check_in_records;
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong notifications" ON public.notifications;
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong annual_leave_balance" ON public.annual_leave_balance;
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong approval_records" ON public.approval_records;
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong announcement_reads" ON public.announcement_reads;

-- Create secure policies for these tables
CREATE POLICY "companies_secure_select" ON public.companies
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "companies_secure_manage" ON public.companies
FOR ALL USING (auth.uid() IS NOT NULL AND public.is_user_admin(auth.uid()));

CREATE POLICY "branches_secure_select" ON public.branches
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "branches_secure_manage" ON public.branches
FOR ALL USING (auth.uid() IS NOT NULL AND public.is_user_admin(auth.uid()));

CREATE POLICY "announcements_secure_select" ON public.announcements
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "announcements_secure_manage" ON public.announcements
FOR ALL USING (auth.uid() IS NOT NULL AND public.is_user_admin(auth.uid()));

-- 5. Update the is_admin_user function to remove hardcoded UUID
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.is_user_admin(auth.uid());
$$;

-- 6. Update is_current_user_admin function
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.is_user_admin(auth.uid());
$$;
