
-- Update staff table RLS policies to use role_id instead of role

-- First, drop existing policies
DROP POLICY IF EXISTS "staff_select_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_insert_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_update_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_delete_policy" ON public.staff;

-- Update the is_admin_user function to check role_id instead of role
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    -- Check if user is the super admin (廖俊雄)
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- Check if user has admin role_id using user_id
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE user_id = auth.uid() 
      AND role_id = 'admin'
    );
$$;

-- Update the get_current_user_role_safe function to use role_id
CREATE OR REPLACE FUNCTION public.get_current_user_role_safe()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(
    (SELECT role_id FROM public.staff WHERE user_id = auth.uid() LIMIT 1),
    'user'
  );
$$;

-- Create new RLS policies using role_id
CREATE POLICY "staff_select_policy" ON public.staff
FOR SELECT USING (
  auth.uid() IS NOT NULL AND (
    -- Users can view their own record using user_id
    auth.uid() = user_id OR
    -- 廖俊雄 (super admin) can view all records
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- Admins (role_id = 'admin') can view all records
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.user_id = auth.uid() 
      AND s.role_id = 'admin'
    )
  )
);

CREATE POLICY "staff_insert_policy" ON public.staff
FOR INSERT WITH CHECK (
  auth.uid() IS NOT NULL AND (
    -- 廖俊雄 (super admin) can insert records
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- Admins (role_id = 'admin') can insert records
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.user_id = auth.uid() 
      AND s.role_id = 'admin'
    )
  )
);

CREATE POLICY "staff_update_policy" ON public.staff
FOR UPDATE USING (
  auth.uid() IS NOT NULL AND (
    -- Users can update their own record using user_id
    auth.uid() = user_id OR
    -- 廖俊雄 (super admin) can update all records
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- Admins (role_id = 'admin') can update all records
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.user_id = auth.uid() 
      AND s.role_id = 'admin'
    )
  )
);

CREATE POLICY "staff_delete_policy" ON public.staff
FOR DELETE USING (
  auth.uid() IS NOT NULL AND (
    -- 廖俊雄 (super admin) can delete records
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- Admins (role_id = 'admin') can delete records
    EXISTS (
      SELECT 1 FROM public.staff s
      WHERE s.user_id = auth.uid() 
      AND s.role_id = 'admin'
    )
  )
);
