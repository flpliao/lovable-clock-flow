
-- Check if there are any remaining problematic policies on staff table
DROP POLICY IF EXISTS "Users can view their own staff record" ON public.staff;
DROP POLICY IF EXISTS "Users can update their own staff record" ON public.staff;
DROP POLICY IF EXISTS "Admins can manage all staff records" ON public.staff;
DROP POLICY IF EXISTS "Staff can view own record" ON public.staff;
DROP POLICY IF EXISTS "Admins can view all staff" ON public.staff;

-- Ensure RLS is enabled on staff table
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- Recreate the clean policies (in case the previous ones didn't apply correctly)
DROP POLICY IF EXISTS "staff_select_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_insert_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_update_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_delete_policy" ON public.staff;

-- Create the corrected policies again
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

-- Also check if departments table has any problematic policies
-- Enable RLS on departments if not already enabled
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Create a simple policy for departments (since the error might be coming from departments accessing staff)
DROP POLICY IF EXISTS "departments_policy" ON public.departments;
CREATE POLICY "departments_policy" ON public.departments
FOR ALL USING (
  auth.uid() IS NOT NULL
);
