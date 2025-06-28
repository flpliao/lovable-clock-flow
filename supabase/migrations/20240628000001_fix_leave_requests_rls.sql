
-- 確保 leave_requests 表有正確的 RLS 政策
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- 清除現有政策
DROP POLICY IF EXISTS "Users can view own leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Users can insert own leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Users can update own leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Managers can view all leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Managers can update all leave requests" ON public.leave_requests;

-- 創建新的 RLS 政策
-- 用戶可以查看自己的請假申請
CREATE POLICY "Users can view own leave requests" ON public.leave_requests
FOR SELECT TO authenticated
USING (
  user_id = auth.uid() OR 
  staff_id = auth.uid() OR
  user_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()) OR
  staff_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid())
);

-- 用戶可以插入自己的請假申請
CREATE POLICY "Users can insert own leave requests" ON public.leave_requests
FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid() OR 
  staff_id = auth.uid() OR
  user_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()) OR
  staff_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid())
);

-- 用戶可以更新自己的請假申請（僅限 pending 狀態）
CREATE POLICY "Users can update own pending leave requests" ON public.leave_requests
FOR UPDATE TO authenticated
USING (
  (user_id = auth.uid() OR staff_id = auth.uid()) AND 
  status = 'pending'
);

-- 管理員和主管可以查看所有請假申請
CREATE POLICY "Managers can view all leave requests" ON public.leave_requests
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'hr_manager')
  )
);

-- 管理員和主管可以更新請假申請狀態
CREATE POLICY "Managers can update leave requests" ON public.leave_requests
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'hr_manager')
  )
);

-- 確保審核人可以更新他們負責審核的申請
CREATE POLICY "Approvers can update assigned leave requests" ON public.leave_requests
FOR UPDATE TO authenticated
USING (
  current_approver = auth.uid() OR
  current_approver IN (SELECT id FROM public.staff WHERE user_id = auth.uid())
);
