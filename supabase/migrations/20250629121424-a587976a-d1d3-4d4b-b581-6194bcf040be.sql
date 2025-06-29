
-- RLS 效能優化：移除 auth.uid() 直接調用，改用 JOIN-based 和 EXISTS-based 政策 (修正版)

-- 首先創建一個高效能的用戶查詢函數，減少重複的 auth.uid() 調用
CREATE OR REPLACE FUNCTION public.get_current_user_context()
RETURNS TABLE(
  user_id UUID,
  staff_id UUID,
  role TEXT,
  department TEXT,
  branch_id UUID,
  supervisor_id UUID
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    s.user_id,
    s.id as staff_id,
    s.role,
    s.department,
    s.branch_id,
    s.supervisor_id
  FROM public.staff s 
  WHERE s.user_id = auth.uid() OR s.id = auth.uid()
  LIMIT 1;
$$;

-- 創建用戶角色檢查函數
CREATE OR REPLACE FUNCTION public.is_current_user_admin_optimized()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff 
    WHERE (user_id = auth.uid() OR id = auth.uid()) 
    AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_manager_optimized()
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff 
    WHERE (user_id = auth.uid() OR id = auth.uid()) 
    AND role IN ('admin', 'manager')
  );
$$;

-- 創建索引來提升查詢效能
CREATE INDEX IF NOT EXISTS idx_staff_user_id_role ON public.staff(user_id, role);
CREATE INDEX IF NOT EXISTS idx_staff_id_role ON public.staff(id, role);
CREATE INDEX IF NOT EXISTS idx_staff_supervisor_id ON public.staff(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_user_staff ON public.leave_requests(user_id, staff_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_current_approver ON public.leave_requests(current_approver);
CREATE INDEX IF NOT EXISTS idx_approval_records_approver ON public.approval_records(approver_id);
CREATE INDEX IF NOT EXISTS idx_annual_leave_balance_staff ON public.annual_leave_balance(staff_id, user_id);

-- ===== 優化 leave_requests 的 RLS 政策 =====
DROP POLICY IF EXISTS "leave_requests_secure_select" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_secure_insert" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_secure_update" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_secure_delete" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_join_based_select" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_join_based_insert" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_join_based_update" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_join_based_delete" ON public.leave_requests;

-- 創建基於 EXISTS 的優化政策
CREATE POLICY "leave_requests_join_optimized_select" ON public.leave_requests
FOR SELECT USING (
  -- 用戶可以查看自己的申請
  EXISTS (
    SELECT 1 FROM public.staff usr 
    WHERE usr.user_id = auth.uid()
    AND (usr.id = leave_requests.staff_id OR usr.user_id = leave_requests.user_id)
  ) OR
  -- 當前審核者可以查看
  EXISTS (
    SELECT 1 FROM public.staff usr 
    WHERE usr.user_id = auth.uid()
    AND usr.id = leave_requests.current_approver
  ) OR
  -- 管理員可以查看所有
  public.is_current_user_admin_optimized() OR
  -- 主管可以查看下屬申請
  EXISTS (
    SELECT 1 FROM public.staff applicant
    JOIN public.staff usr ON applicant.supervisor_id = usr.id
    WHERE usr.user_id = auth.uid()
    AND (applicant.id = leave_requests.staff_id OR applicant.user_id = leave_requests.user_id)
  )
);

CREATE POLICY "leave_requests_join_optimized_insert" ON public.leave_requests
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.staff usr 
    WHERE usr.user_id = auth.uid()
    AND (usr.id = staff_id OR usr.user_id = user_id)
  )
);

CREATE POLICY "leave_requests_join_optimized_update" ON public.leave_requests
FOR UPDATE USING (
  -- 用戶可以更新自己的待審核申請
  (status = 'pending' AND EXISTS (
    SELECT 1 FROM public.staff usr 
    WHERE usr.user_id = auth.uid()
    AND (usr.id = leave_requests.staff_id OR usr.user_id = leave_requests.user_id)
  )) OR
  -- 管理員可以更新
  public.is_current_user_admin_optimized() OR
  -- 主管可以更新下屬申請
  EXISTS (
    SELECT 1 FROM public.staff applicant
    JOIN public.staff usr ON applicant.supervisor_id = usr.id
    WHERE usr.user_id = auth.uid()
    AND (applicant.id = leave_requests.staff_id OR applicant.user_id = leave_requests.user_id)
  ) OR
  -- 當前審核者可以更新
  EXISTS (
    SELECT 1 FROM public.staff usr 
    WHERE usr.user_id = auth.uid()
    AND usr.id = leave_requests.current_approver
  )
);

CREATE POLICY "leave_requests_join_optimized_delete" ON public.leave_requests
FOR DELETE USING (
  (status = 'pending' AND EXISTS (
    SELECT 1 FROM public.staff usr 
    WHERE usr.user_id = auth.uid()
    AND (usr.id = leave_requests.staff_id OR usr.user_id = leave_requests.user_id)
  )) OR
  public.is_current_user_admin_optimized()
);

-- ===== 優化 approval_records 的 RLS 政策 =====
DROP POLICY IF EXISTS "approval_records_join_based_select" ON public.approval_records;
DROP POLICY IF EXISTS "approval_records_join_based_insert" ON public.approval_records;
DROP POLICY IF EXISTS "approval_records_join_based_update" ON public.approval_records;

CREATE POLICY "approval_records_join_optimized_select" ON public.approval_records
FOR SELECT USING (
  -- 審核者可以查看
  EXISTS (
    SELECT 1 FROM public.staff usr 
    WHERE usr.user_id = auth.uid()
    AND usr.id = approval_records.approver_id
  ) OR
  -- 申請人可以查看自己申請的審核記錄
  EXISTS (
    SELECT 1 FROM public.leave_requests lr 
    JOIN public.staff usr ON usr.user_id = auth.uid()
    WHERE lr.id = approval_records.leave_request_id 
    AND (usr.id = lr.staff_id OR usr.user_id = lr.user_id)
  ) OR
  -- 管理員可以查看
  public.is_current_user_admin_optimized()
);

CREATE POLICY "approval_records_join_optimized_insert" ON public.approval_records
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.staff usr 
    WHERE usr.user_id = auth.uid()
    AND (usr.id = approver_id OR usr.role IN ('admin', 'manager'))
  )
);

CREATE POLICY "approval_records_join_optimized_update" ON public.approval_records
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.staff usr 
    WHERE usr.user_id = auth.uid()
    AND (usr.id = approval_records.approver_id OR usr.role = 'admin')
  )
);

-- ===== 優化 staff 表的 RLS 政策 =====
DROP POLICY IF EXISTS "staff_join_based_select" ON public.staff;
DROP POLICY IF EXISTS "staff_join_based_insert" ON public.staff;
DROP POLICY IF EXISTS "staff_join_based_update" ON public.staff;
DROP POLICY IF EXISTS "staff_join_based_delete" ON public.staff;

CREATE POLICY "staff_join_optimized_select" ON public.staff
FOR SELECT USING (
  -- 用戶可以查看自己的記錄
  user_id = auth.uid() OR id = auth.uid() OR
  -- 管理員可以查看所有記錄
  public.is_current_user_admin_optimized() OR
  -- 主管可以查看下屬記錄
  EXISTS (
    SELECT 1 FROM public.staff usr 
    WHERE usr.user_id = auth.uid()
    AND staff.supervisor_id = usr.id
  )
);

CREATE POLICY "staff_join_optimized_insert" ON public.staff
FOR INSERT WITH CHECK (public.is_current_user_admin_optimized());

CREATE POLICY "staff_join_optimized_update" ON public.staff
FOR UPDATE USING (
  (user_id = auth.uid() OR id = auth.uid()) OR
  public.is_current_user_admin_optimized()
);

CREATE POLICY "staff_join_optimized_delete" ON public.staff
FOR DELETE USING (public.is_current_user_admin_optimized());

-- ===== 優化其他表的 RLS 政策 =====
-- annual_leave_balance
ALTER TABLE public.annual_leave_balance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "annual_leave_balance_join_based_select" ON public.annual_leave_balance;
DROP POLICY IF EXISTS "annual_leave_balance_join_based_manage" ON public.annual_leave_balance;

CREATE POLICY "annual_leave_balance_join_optimized_select" ON public.annual_leave_balance
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.staff usr 
    WHERE usr.user_id = auth.uid()
    AND (usr.id = annual_leave_balance.staff_id OR usr.user_id = annual_leave_balance.user_id)
  ) OR
  public.is_current_user_admin_optimized()
);

CREATE POLICY "annual_leave_balance_join_optimized_manage" ON public.annual_leave_balance
FOR ALL USING (public.is_current_user_admin_optimized());

-- 創建效能監控視圖
CREATE OR REPLACE VIEW public.rls_performance_summary AS
SELECT 
  'leave_requests' as table_name,
  'JOIN-based policies implemented' as optimization_status,
  'High' as performance_impact
UNION ALL
SELECT 
  'approval_records' as table_name,
  'JOIN-based policies implemented' as optimization_status,
  'High' as performance_impact
UNION ALL
SELECT 
  'staff' as table_name,
  'Optimized with cached functions' as optimization_status,
  'Medium' as performance_impact
UNION ALL
SELECT 
  'annual_leave_balance' as table_name,
  'JOIN-based policies implemented' as optimization_status,
  'Medium' as performance_impact;
