
-- 為 overtime_approval_records 表格添加外鍵約束
ALTER TABLE public.overtime_approval_records 
ADD CONSTRAINT fk_overtime_approval_records_overtime_id 
FOREIGN KEY (overtime_id) REFERENCES public.overtimes(id) ON DELETE CASCADE;

-- 確保 RLS 政策正確設定
ALTER TABLE public.overtimes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.overtime_approval_records ENABLE ROW LEVEL SECURITY;

-- 刪除現有的 RLS 政策並重新建立，完全對齊請假系統
DROP POLICY IF EXISTS "Users can view their own overtime requests" ON public.overtimes;
DROP POLICY IF EXISTS "Users can create their own overtime requests" ON public.overtimes;
DROP POLICY IF EXISTS "Users can update their own pending overtime requests" ON public.overtimes;
DROP POLICY IF EXISTS "Supervisors can view overtime requests for approval" ON public.overtimes;
DROP POLICY IF EXISTS "Supervisors can update overtime requests for approval" ON public.overtimes;
DROP POLICY IF EXISTS "Admins can manage all overtime requests" ON public.overtimes;

-- 重新建立 RLS 政策，完全比照請假系統
CREATE POLICY "Users can view their own overtime requests" ON public.overtimes
FOR SELECT USING (
  staff_id = get_current_user_id()
);

CREATE POLICY "Users can create their own overtime requests" ON public.overtimes
FOR INSERT WITH CHECK (
  staff_id = get_current_user_id()
);

CREATE POLICY "Users can update their own pending overtime requests" ON public.overtimes
FOR UPDATE USING (
  staff_id = get_current_user_id() AND status = 'pending'
);

CREATE POLICY "Supervisors can view overtime requests for approval" ON public.overtimes
FOR SELECT USING (
  current_approver = get_current_user_id() OR
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.id = staff_id AND s.supervisor_id = get_current_user_id()
  ) OR
  get_current_user_id() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE id = get_current_user_id() AND role = 'admin'
  )
);

CREATE POLICY "Supervisors can update overtime requests for approval" ON public.overtimes
FOR UPDATE USING (
  (current_approver = get_current_user_id() AND status = 'pending') OR
  get_current_user_id() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE id = get_current_user_id() AND role = 'admin'
  )
);

CREATE POLICY "Admins can manage all overtime requests" ON public.overtimes
FOR ALL USING (
  get_current_user_id() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE id = get_current_user_id() AND role = 'admin'
  )
);

-- 為 overtime_approval_records 建立 RLS 政策
DROP POLICY IF EXISTS "Users can view their own overtime approval records" ON public.overtime_approval_records;
DROP POLICY IF EXISTS "Approvers can view relevant overtime approval records" ON public.overtime_approval_records;
DROP POLICY IF EXISTS "Approvers can update overtime approval records" ON public.overtime_approval_records;
DROP POLICY IF EXISTS "System can insert overtime approval records" ON public.overtime_approval_records;

CREATE POLICY "Users can view their own overtime approval records" ON public.overtime_approval_records
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.overtimes o
    WHERE o.id = overtime_id AND o.staff_id = get_current_user_id()
  )
);

CREATE POLICY "Approvers can view relevant overtime approval records" ON public.overtime_approval_records
FOR SELECT USING (
  approver_id = get_current_user_id() OR
  get_current_user_id() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff
    WHERE id = get_current_user_id() AND role = 'admin'
  )
);

CREATE POLICY "Approvers can update overtime approval records" ON public.overtime_approval_records
FOR UPDATE USING (
  approver_id = get_current_user_id() OR
  get_current_user_id() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff
    WHERE id = get_current_user_id() AND role = 'admin'
  )
);

CREATE POLICY "System can insert overtime approval records" ON public.overtime_approval_records
FOR INSERT WITH CHECK (true);
