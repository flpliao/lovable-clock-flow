
-- 啟用剩餘表格的 RLS
ALTER TABLE public.approval_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.i18n_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- 為 approval_records 創建 RLS 政策
DROP POLICY IF EXISTS "Users can view approval records they are involved in" ON public.approval_records;
CREATE POLICY "Users can view approval records they are involved in" ON public.approval_records
FOR SELECT USING (
  approver_id = auth.uid() OR
  public.get_current_user_role_safe() = 'admin'
);

DROP POLICY IF EXISTS "Approvers can insert approval records" ON public.approval_records;
CREATE POLICY "Approvers can insert approval records" ON public.approval_records
FOR INSERT WITH CHECK (
  approver_id = auth.uid() OR
  public.get_current_user_role_safe() = 'admin'
);

DROP POLICY IF EXISTS "Approvers can update their own approval records" ON public.approval_records;
CREATE POLICY "Approvers can update their own approval records" ON public.approval_records
FOR UPDATE USING (
  approver_id = auth.uid() OR
  public.get_current_user_role_safe() = 'admin'
);

-- 為 holidays 創建 RLS 政策（系統參考資料，所有認證用戶可查看）
DROP POLICY IF EXISTS "All authenticated users can view holidays" ON public.holidays;
CREATE POLICY "All authenticated users can view holidays" ON public.holidays
FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin can manage holidays" ON public.holidays;
CREATE POLICY "Admin can manage holidays" ON public.holidays
FOR ALL USING (
  public.get_current_user_role_safe() = 'admin'
);

-- 為 payrolls 創建 RLS 政策
DROP POLICY IF EXISTS "Users can view their own payroll" ON public.payrolls;
CREATE POLICY "Users can view their own payroll" ON public.payrolls
FOR SELECT USING (
  staff_id = auth.uid() OR
  public.get_current_user_role_safe() IN ('admin', 'hr_manager')
);

DROP POLICY IF EXISTS "HR and Admin can manage payrolls" ON public.payrolls;
CREATE POLICY "HR and Admin can manage payrolls" ON public.payrolls
FOR ALL USING (
  public.get_current_user_role_safe() IN ('admin', 'hr_manager')
);

-- 為 reminder_settings 創建 RLS 政策
DROP POLICY IF EXISTS "Users can view their own reminder settings" ON public.reminder_settings;
CREATE POLICY "Users can view their own reminder settings" ON public.reminder_settings
FOR SELECT USING (
  staff_id = auth.uid() OR
  public.get_current_user_role_safe() = 'admin'
);

DROP POLICY IF EXISTS "Admin can manage all reminder settings" ON public.reminder_settings;
CREATE POLICY "Admin can manage all reminder settings" ON public.reminder_settings
FOR ALL USING (
  public.get_current_user_role_safe() = 'admin'
);

-- 為 i18n_labels 創建 RLS 政策（系統參考資料，所有認證用戶可查看）
DROP POLICY IF EXISTS "All authenticated users can view i18n labels" ON public.i18n_labels;
CREATE POLICY "All authenticated users can view i18n labels" ON public.i18n_labels
FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin can manage i18n labels" ON public.i18n_labels;
CREATE POLICY "Admin can manage i18n labels" ON public.i18n_labels
FOR ALL USING (
  public.get_current_user_role_safe() = 'admin'
);

-- 為 leave_types 創建 RLS 政策（系統參考資料，所有認證用戶可查看）
DROP POLICY IF EXISTS "All authenticated users can view leave types" ON public.leave_types;
CREATE POLICY "All authenticated users can view leave types" ON public.leave_types
FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin can manage leave types" ON public.leave_types;
CREATE POLICY "Admin can manage leave types" ON public.leave_types
FOR ALL USING (
  public.get_current_user_role_safe() = 'admin'
);

-- 為 time_slots 創建 RLS 政策（系統參考資料，所有認證用戶可查看）
DROP POLICY IF EXISTS "All authenticated users can view time slots" ON public.time_slots;
CREATE POLICY "All authenticated users can view time slots" ON public.time_slots
FOR SELECT USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Admin can manage time slots" ON public.time_slots;
CREATE POLICY "Admin can manage time slots" ON public.time_slots
FOR ALL USING (
  public.get_current_user_role_safe() = 'admin'
);

-- 為 schedules 創建 RLS 政策
DROP POLICY IF EXISTS "Users can view their own schedules" ON public.schedules;
CREATE POLICY "Users can view their own schedules" ON public.schedules
FOR SELECT USING (
  user_id = auth.uid() OR
  created_by = auth.uid() OR
  public.get_current_user_role_safe() IN ('admin', 'department_manager')
);

DROP POLICY IF EXISTS "Users can create schedules" ON public.schedules;
CREATE POLICY "Users can create schedules" ON public.schedules
FOR INSERT WITH CHECK (
  created_by = auth.uid() OR
  public.get_current_user_role_safe() IN ('admin', 'department_manager')
);

DROP POLICY IF EXISTS "Managers can update schedules" ON public.schedules;
CREATE POLICY "Managers can update schedules" ON public.schedules
FOR UPDATE USING (
  created_by = auth.uid() OR
  public.get_current_user_role_safe() IN ('admin', 'department_manager')
);

DROP POLICY IF EXISTS "Managers can delete schedules" ON public.schedules;
CREATE POLICY "Managers can delete schedules" ON public.schedules
FOR DELETE USING (
  created_by = auth.uid() OR
  public.get_current_user_role_safe() IN ('admin', 'department_manager')
);
