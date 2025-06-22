
-- 檢查並修正 leave_requests 表的 RLS 政策，確保員工可以提交請假申請

-- 首先刪除現有的政策（如果存在）
DROP POLICY IF EXISTS "Users can view their own leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Users can create their own leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Users can update their own pending leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Managers can view requests for approval" ON public.leave_requests;
DROP POLICY IF EXISTS "Managers can update leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Admins can view all leave requests" ON public.leave_requests;

-- 確保 RLS 已啟用
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- 允許員工查看自己的請假申請（支援 user_id 和 staff_id）
CREATE POLICY "Users can view their own leave requests" 
  ON public.leave_requests 
  FOR SELECT 
  USING (
    user_id = get_current_user_id() OR 
    staff_id = get_current_user_id()
  );

-- 允許員工建立自己的請假申請（支援 user_id 和 staff_id）
CREATE POLICY "Users can create their own leave requests" 
  ON public.leave_requests 
  FOR INSERT 
  WITH CHECK (
    user_id = get_current_user_id() OR 
    staff_id = get_current_user_id()
  );

-- 允許員工更新自己的待審核請假申請
CREATE POLICY "Users can update their own pending leave requests" 
  ON public.leave_requests 
  FOR UPDATE 
  USING (
    (user_id = get_current_user_id() OR staff_id = get_current_user_id()) 
    AND status = 'pending'
  );

-- 允許主管查看需要審核的申請
CREATE POLICY "Managers can view requests for approval" 
  ON public.leave_requests 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.staff s1, public.staff s2 
      WHERE (s1.id = user_id OR s1.id = staff_id)
      AND s2.id = get_current_user_id()
      AND (s2.role = 'admin' OR s1.supervisor_id = s2.id)
    )
  );

-- 允許主管更新請假申請狀態
CREATE POLICY "Managers can update leave requests" 
  ON public.leave_requests 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.staff s1, public.staff s2 
      WHERE (s1.id = user_id OR s1.id = staff_id)
      AND s2.id = get_current_user_id()
      AND (s2.role = 'admin' OR s1.supervisor_id = s2.id)
    )
  );

-- 管理員可以查看所有請假申請
CREATE POLICY "Admins can view all leave requests" 
  ON public.leave_requests 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE id = get_current_user_id() 
      AND role = 'admin'
    )
  );

-- 同時檢查 approval_records 表的 RLS 政策
ALTER TABLE public.approval_records ENABLE ROW LEVEL SECURITY;

-- 刪除現有的 approval_records 政策
DROP POLICY IF EXISTS "Users can view approval records for their requests" ON public.approval_records;
DROP POLICY IF EXISTS "Managers can view and create approval records" ON public.approval_records;
DROP POLICY IF EXISTS "Admins can manage all approval records" ON public.approval_records;

-- 允許員工查看自己請假申請的審核記錄
CREATE POLICY "Users can view approval records for their requests" 
  ON public.approval_records 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.leave_requests lr 
      WHERE lr.id = leave_request_id 
      AND (lr.user_id = get_current_user_id() OR lr.staff_id = get_current_user_id())
    )
  );

-- 允許主管查看和建立審核記錄
CREATE POLICY "Managers can view and create approval records" 
  ON public.approval_records 
  FOR ALL 
  USING (
    approver_id = get_current_user_id() OR
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE id = get_current_user_id() 
      AND role IN ('admin', 'manager')
    )
  );

-- 管理員可以管理所有審核記錄
CREATE POLICY "Admins can manage all approval records" 
  ON public.approval_records 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE id = get_current_user_id() 
      AND role = 'admin'
    )
  );
