
-- 啟用所有表格的 RLS（如果尚未啟用）
ALTER TABLE public.announcement_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annual_leave_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.overtimes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;

-- 為 announcement_reads 創建 RLS 政策
DROP POLICY IF EXISTS "Users can view their own announcement reads" ON public.announcement_reads;
CREATE POLICY "Users can view their own announcement reads" ON public.announcement_reads
FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own announcement reads" ON public.announcement_reads;
CREATE POLICY "Users can insert their own announcement reads" ON public.announcement_reads
FOR INSERT WITH CHECK (user_id = auth.uid());

-- 為 annual_leave_balance 創建 RLS 政策
DROP POLICY IF EXISTS "Users can view their own leave balance" ON public.annual_leave_balance;
CREATE POLICY "Users can view their own leave balance" ON public.annual_leave_balance
FOR SELECT USING (
  staff_id = auth.uid() OR 
  user_id = auth.uid() OR
  public.get_current_user_role_safe() = 'admin'
);

DROP POLICY IF EXISTS "Admin can manage all leave balances" ON public.annual_leave_balance;
CREATE POLICY "Admin can manage all leave balances" ON public.annual_leave_balance
FOR ALL USING (public.get_current_user_role_safe() = 'admin');

-- 為 payroll_approvals 創建 RLS 政策
DROP POLICY IF EXISTS "HR and Admin can view payroll approvals" ON public.payroll_approvals;
CREATE POLICY "HR and Admin can view payroll approvals" ON public.payroll_approvals
FOR SELECT USING (
  public.get_current_user_role_safe() IN ('admin', 'hr_manager')
);

DROP POLICY IF EXISTS "HR and Admin can manage payroll approvals" ON public.payroll_approvals;
CREATE POLICY "HR and Admin can manage payroll approvals" ON public.payroll_approvals
FOR ALL USING (
  public.get_current_user_role_safe() IN ('admin', 'hr_manager')
);

-- 為 payroll_payments 創建 RLS 政策
DROP POLICY IF EXISTS "HR and Admin can view payroll payments" ON public.payroll_payments;
CREATE POLICY "HR and Admin can view payroll payments" ON public.payroll_payments
FOR SELECT USING (
  public.get_current_user_role_safe() IN ('admin', 'hr_manager')
);

DROP POLICY IF EXISTS "HR and Admin can manage payroll payments" ON public.payroll_payments;
CREATE POLICY "HR and Admin can manage payroll payments" ON public.payroll_payments
FOR ALL USING (
  public.get_current_user_role_safe() IN ('admin', 'hr_manager')
);

-- 為 positions 創建 RLS 政策
DROP POLICY IF EXISTS "All authenticated users can view positions" ON public.positions;
CREATE POLICY "All authenticated users can view positions" ON public.positions
FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin and HR can manage positions" ON public.positions;
CREATE POLICY "Admin and HR can manage positions" ON public.positions
FOR ALL USING (
  public.get_current_user_role_safe() IN ('admin', 'hr_manager')
);

-- 為 attendance_exceptions 創建 RLS 政策
DROP POLICY IF EXISTS "Users can view their own attendance exceptions" ON public.attendance_exceptions;
CREATE POLICY "Users can view their own attendance exceptions" ON public.attendance_exceptions
FOR SELECT USING (
  staff_id = auth.uid() OR
  approved_by = auth.uid() OR
  public.get_current_user_role_safe() = 'admin'
);

DROP POLICY IF EXISTS "Users can create their own attendance exceptions" ON public.attendance_exceptions;
CREATE POLICY "Users can create their own attendance exceptions" ON public.attendance_exceptions
FOR INSERT WITH CHECK (staff_id = auth.uid());

DROP POLICY IF EXISTS "Managers can approve attendance exceptions" ON public.attendance_exceptions;
CREATE POLICY "Managers can approve attendance exceptions" ON public.attendance_exceptions
FOR UPDATE USING (
  public.get_current_user_role_safe() IN ('admin', 'department_manager', 'hr_manager')
);

-- 為 overtimes 創建 RLS 政策
DROP POLICY IF EXISTS "Users can view their own overtime records" ON public.overtimes;
CREATE POLICY "Users can view their own overtime records" ON public.overtimes
FOR SELECT USING (
  staff_id = auth.uid() OR
  approved_by = auth.uid() OR
  public.get_current_user_role_safe() = 'admin'
);

DROP POLICY IF EXISTS "Users can create their own overtime requests" ON public.overtimes;
CREATE POLICY "Users can create their own overtime requests" ON public.overtimes
FOR INSERT WITH CHECK (staff_id = auth.uid());

DROP POLICY IF EXISTS "Managers can approve overtime requests" ON public.overtimes;
CREATE POLICY "Managers can approve overtime requests" ON public.overtimes
FOR UPDATE USING (
  public.get_current_user_role_safe() IN ('admin', 'department_manager', 'hr_manager')
);

-- 為 salary_structures 創建 RLS 政策
DROP POLICY IF EXISTS "HR and Admin can view salary structures" ON public.salary_structures;
CREATE POLICY "HR and Admin can view salary structures" ON public.salary_structures
FOR SELECT USING (
  public.get_current_user_role_safe() IN ('admin', 'hr_manager')
);

DROP POLICY IF EXISTS "Admin can manage salary structures" ON public.salary_structures;
CREATE POLICY "Admin can manage salary structures" ON public.salary_structures
FOR ALL USING (
  public.get_current_user_role_safe() = 'admin'
);

-- 為 countries 創建 RLS 政策（這是系統參考資料，所有認證用戶都可以查看）
DROP POLICY IF EXISTS "All authenticated users can view countries" ON public.countries;
CREATE POLICY "All authenticated users can view countries" ON public.countries
FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin can manage countries" ON public.countries;
CREATE POLICY "Admin can manage countries" ON public.countries
FOR ALL USING (
  public.get_current_user_role_safe() = 'admin'
);
