
-- 更新 leave_requests 表的 RLS 政策，允許認證用戶根據 staff 角色訪問
DROP POLICY IF EXISTS "leave_requests_view_own" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_insert_own" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_update_own_pending" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_admin_view_all" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_admin_update" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_approver_update" ON public.leave_requests;

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

-- 2. 管理員和主管可以查看所有請假申請
CREATE POLICY "leave_requests_managers_view_all" ON public.leave_requests
FOR SELECT TO authenticated
USING (
  auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE (user_id = auth.uid() OR id = auth.uid())
    AND role IN ('admin', 'manager', 'hr_manager')
  )
);

-- 3. 用戶可以插入自己的請假申請
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

-- 4. 用戶可以更新自己的待審核請假申請
CREATE POLICY "leave_requests_update_own_pending" ON public.leave_requests
FOR UPDATE TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  (user_id = auth.uid() OR staff_id = auth.uid() OR
   user_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()) OR
   staff_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid())) AND 
  status = 'pending'
);

-- 5. 管理員和主管可以更新請假申請狀態
CREATE POLICY "leave_requests_managers_update" ON public.leave_requests
FOR UPDATE TO authenticated
USING (
  auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE (user_id = auth.uid() OR id = auth.uid())
    AND role IN ('admin', 'manager', 'hr_manager')
  )
);

-- 6. 審核人可以更新他們負責審核的申請
CREATE POLICY "leave_requests_approver_update" ON public.leave_requests
FOR UPDATE TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    current_approver = auth.uid() OR
    current_approver IN (SELECT id FROM public.staff WHERE user_id = auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.approval_records ar
      WHERE ar.leave_request_id = leave_requests.id
      AND (ar.approver_id = auth.uid() OR 
           ar.approver_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()))
      AND ar.status = 'pending'
    )
  )
);

-- 更新 approval_records 表的 RLS 政策
DROP POLICY IF EXISTS "approval_records_view_related" ON public.approval_records;
DROP POLICY IF EXISTS "approval_records_insert_system" ON public.approval_records;
DROP POLICY IF EXISTS "approval_records_update_approver" ON public.approval_records;

-- 1. 用戶可以查看與自己相關的審核記錄
CREATE POLICY "approval_records_view_related" ON public.approval_records
FOR SELECT TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    -- 申請人可以看到自己申請的審核記錄
    leave_request_id IN (
      SELECT id FROM public.leave_requests 
      WHERE user_id = auth.uid() OR staff_id = auth.uid() OR
            user_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()) OR
            staff_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid())
    ) OR
    -- 審核人可以看到自己負責的審核記錄
    approver_id = auth.uid() OR
    approver_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()) OR
    -- 管理員可以看到所有審核記錄
    auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE (user_id = auth.uid() OR id = auth.uid())
      AND role IN ('admin', 'manager', 'hr_manager')
    )
  )
);

-- 2. 系統可以插入審核記錄
CREATE POLICY "approval_records_insert_system" ON public.approval_records
FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- 3. 審核人可以更新自己的審核記錄
CREATE POLICY "approval_records_update_approver" ON public.approval_records
FOR UPDATE TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    approver_id = auth.uid() OR
    approver_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()) OR
    auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE (user_id = auth.uid() OR id = auth.uid())
      AND role IN ('admin', 'manager', 'hr_manager')
    )
  )
);

-- 更新 annual_leave_balance 表的 RLS 政策
DROP POLICY IF EXISTS "annual_leave_balance_view_own" ON public.annual_leave_balance;
DROP POLICY IF EXISTS "annual_leave_balance_managers_view_all" ON public.annual_leave_balance;
DROP POLICY IF EXISTS "annual_leave_balance_system_manage" ON public.annual_leave_balance;

-- 1. 用戶可以查看自己的年假餘額
CREATE POLICY "annual_leave_balance_view_own" ON public.annual_leave_balance
FOR SELECT TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    staff_id = auth.uid() OR
    user_id = auth.uid() OR
    staff_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid()) OR
    user_id IN (SELECT id FROM public.staff WHERE user_id = auth.uid())
  )
);

-- 2. 管理員和主管可以查看所有年假餘額
CREATE POLICY "annual_leave_balance_managers_view_all" ON public.annual_leave_balance
FOR SELECT TO authenticated
USING (
  auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE (user_id = auth.uid() OR id = auth.uid())
    AND role IN ('admin', 'manager', 'hr_manager')
  )
);

-- 3. 系統可以管理年假餘額記錄
CREATE POLICY "annual_leave_balance_system_manage" ON public.annual_leave_balance
FOR ALL TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- 確保所有認證用戶都能查看基本資料表
DROP POLICY IF EXISTS "notifications_view_own" ON public.notifications;
CREATE POLICY "notifications_view_own" ON public.notifications
FOR SELECT TO authenticated
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "notifications_system_manage" ON public.notifications
FOR ALL TO authenticated
USING (
  auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE (user_id = auth.uid() OR id = auth.uid())
    AND role IN ('admin', 'manager', 'hr_manager')
  )
)
WITH CHECK (
  auth.uid() = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE (user_id = auth.uid() OR id = auth.uid())
    AND role IN ('admin', 'manager', 'hr_manager')
  )
);
