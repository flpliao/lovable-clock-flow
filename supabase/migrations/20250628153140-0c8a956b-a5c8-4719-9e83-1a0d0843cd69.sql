
-- 檢查現有政策並安全地重建 leave_requests RLS 政策
DO $$
BEGIN
    -- 清除所有現有的 leave_requests 政策
    DROP POLICY IF EXISTS "Users can view own leave requests" ON public.leave_requests;
    DROP POLICY IF EXISTS "Users can insert own leave requests" ON public.leave_requests;
    DROP POLICY IF EXISTS "Users can update own leave requests" ON public.leave_requests;
    DROP POLICY IF EXISTS "Users can update own pending leave requests" ON public.leave_requests;
    DROP POLICY IF EXISTS "Managers can view all leave requests" ON public.leave_requests;
    DROP POLICY IF EXISTS "Managers can update all leave requests" ON public.leave_requests;
    DROP POLICY IF EXISTS "Managers can update leave requests" ON public.leave_requests;
    DROP POLICY IF EXISTS "Approvers can update assigned leave requests" ON public.leave_requests;
    
    -- 其他可能存在的政策名稱
    DROP POLICY IF EXISTS "leave_requests_select_policy" ON public.leave_requests;
    DROP POLICY IF EXISTS "leave_requests_insert_policy" ON public.leave_requests;
    DROP POLICY IF EXISTS "leave_requests_update_policy" ON public.leave_requests;
    DROP POLICY IF EXISTS "leave_requests_delete_policy" ON public.leave_requests;
END $$;

-- 確保 RLS 已啟用
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- 創建新的 RLS 政策
-- 1. 用戶可以查看自己的請假申請
CREATE POLICY "leave_requests_view_own" ON public.leave_requests
FOR SELECT TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR 
    staff_id = auth.uid() OR
    user_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()) OR
    staff_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid())
  )
);

-- 2. 用戶可以插入自己的請假申請
CREATE POLICY "leave_requests_insert_own" ON public.leave_requests
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    user_id = auth.uid() OR 
    staff_id = auth.uid() OR
    user_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()) OR
    staff_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid())
  )
);

-- 3. 用戶可以更新自己的請假申請（僅限 pending 狀態）
CREATE POLICY "leave_requests_update_own_pending" ON public.leave_requests
FOR UPDATE TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  (user_id = auth.uid() OR staff_id = auth.uid()) AND 
  status = 'pending'
);

-- 4. 管理員可以查看所有請假申請
CREATE POLICY "leave_requests_admin_view_all" ON public.leave_requests
FOR SELECT TO authenticated
USING (
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'hr_manager')
  )
);

-- 5. 管理員可以更新請假申請狀態
CREATE POLICY "leave_requests_admin_update" ON public.leave_requests
FOR UPDATE TO authenticated
USING (
  auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE user_id = auth.uid() 
    AND role IN ('admin', 'manager', 'hr_manager')
  )
);

-- 6. 審核人可以更新他們負責審核的申請
CREATE POLICY "leave_requests_approver_update" ON public.leave_requests
FOR UPDATE TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    current_approver = auth.uid() OR
    current_approver IN (SELECT id FROM public.staff WHERE user_id = auth.uid())
  )
);
