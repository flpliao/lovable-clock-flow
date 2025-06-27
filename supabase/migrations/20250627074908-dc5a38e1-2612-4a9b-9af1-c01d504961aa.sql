
-- First, drop the existing problematic policies
DROP POLICY IF EXISTS "staff_select_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_management_policy" ON public.staff;

-- Create a security definer function to get user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role_safe()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  -- For the authenticated user, check their role from staff table
  -- This function runs with elevated privileges to avoid recursion
  SELECT COALESCE(
    (SELECT role FROM public.staff WHERE id = auth.uid() LIMIT 1),
    'user'
  );
$$;

-- Create a function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    -- Check if user is the super admin (廖俊雄)
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- Check if user has admin role
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE id = auth.uid() 
      AND role = 'admin'
    );
$$;

-- Create new RLS policies using the security definer functions
CREATE POLICY "staff_select_policy" ON public.staff
FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    -- Users can view their own record
    auth.uid() = id OR
    -- Admins can view all records (using security definer function)
    public.is_admin_user()
  )
);

CREATE POLICY "staff_insert_policy" ON public.staff
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND public.is_admin_user()
);

CREATE POLICY "staff_update_policy" ON public.staff
FOR UPDATE USING (
  auth.uid() IS NOT NULL AND (
    -- Users can update their own record
    auth.uid() = id OR
    -- Admins can update all records
    public.is_admin_user()
  )
);

CREATE POLICY "staff_delete_policy" ON public.staff
FOR DELETE USING (
  auth.uid() IS NOT NULL AND public.is_admin_user()
);
