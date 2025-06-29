
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

-- 創建材化視圖來快取用戶權限信息（可選）
CREATE MATERIALIZED VIEW IF NOT EXISTS public.user_permissions_cache AS
SELECT 
  s.user_id,
  s.id as staff_id,
  s.role,
  s.department,
  s.branch_id,
  s.supervisor_id,
  CASE 
    WHEN s.role = 'admin' THEN true 
    ELSE false 
  END as is_admin,
  CASE 
    WHEN s.role IN ('admin', 'manager') THEN true 
    ELSE false 
  END as is_manager
FROM public.staff s;

-- 創建索引來提升查詢效能
CREATE INDEX IF NOT EXISTS idx_user_permissions_cache_user_id ON public.user_permissions_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_cache_staff_id ON public.user_permissions_cache(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON public.staff(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_supervisor_id ON public.staff(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_user_staff ON public.leave_requests(user_id, staff_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_current_approver ON public.leave_requests(current_approver);

-- 優化 leave_requests 的 RLS 政策
-- 刪除現有政策
DROP POLICY IF EXISTS "leave_requests_secure_select" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_secure_insert" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_secure_update" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_secure_delete" ON public.leave_requests;

-- 創建優化後的政策 - 減少 auth.uid() 調用
CREATE POLICY "leave_requests_optimized_select" ON public.leave_requests
FOR SELECT USING (
  -- 直接比對用戶ID，避免函數調用
  user_id IN (SELECT auth.uid()) OR 
  staff_id IN (SELECT auth.uid()) OR
  current_approver IN (SELECT auth.uid()) OR
  -- 使用 EXISTS 進行管理員檢查
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.user_id = auth.uid() 
    AND s.role = 'admin'
  ) OR
  -- 使用 EXISTS 進行主管檢查
  EXISTS (
    SELECT 1 FROM public.staff s1
    JOIN public.staff s2 ON s1.supervisor_id = s2.id
    WHERE s2.user_id = auth.uid()
    AND (s1.id = leave_requests.staff_id OR s1.user_id = leave_requests.user_id)
  )
);

CREATE POLICY "leave_requests_optimized_insert" ON public.leave_requests
FOR INSERT WITH CHECK (
  user_id IN (SELECT auth.uid()) OR 
  staff_id IN (SELECT auth.uid()) OR
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.id = staff_id AND s.user_id = auth.uid()
  )
);

CREATE POLICY "leave_requests_optimized_update" ON public.leave_requests
FOR UPDATE USING (
  -- 用戶可以更新自己的待審核申請
  ((user_id IN (SELECT auth.uid()) OR staff_id IN (SELECT auth.uid())) AND status = 'pending') OR
  -- 管理員可以更新
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.user_id = auth.uid() AND s.role = 'admin'
  ) OR
  -- 主管可以更新下屬申請
  EXISTS (
    SELECT 1 FROM public.staff s1
    JOIN public.staff s2 ON s1.supervisor_id = s2.id
    WHERE s2.user_id = auth.uid()
    AND (s1.id = leave_requests.staff_id OR s1.user_id = leave_requests.user_id)
  ) OR
  -- 當前審核者可以更新
  current_approver IN (SELECT auth.uid())
);

CREATE POLICY "leave_requests_optimized_delete" ON public.leave_requests
FOR DELETE USING (
  ((user_id IN (SELECT auth.uid()) OR staff_id IN (SELECT auth.uid())) AND status = 'pending') OR
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.user_id = auth.uid() AND s.role = 'admin'
  )
);

-- 優化 approval_records 的 RLS 政策
DROP POLICY IF EXISTS "Users can view approval records for their requests" ON public.approval_records;
DROP POLICY IF EXISTS "System and managers can create approval records" ON public.approval_records;
DROP POLICY IF EXISTS "Managers can view approval records" ON public.approval_records;
DROP POLICY IF EXISTS "Admins can manage all approval records" ON public.approval_records;

CREATE POLICY "approval_records_optimized_select" ON public.approval_records
FOR SELECT USING (
  -- 審核者可以查看
  approver_id IN (SELECT auth.uid()) OR
  -- 申請人可以查看自己申請的審核記錄
  EXISTS (
    SELECT 1 FROM public.leave_requests lr 
    WHERE lr.id = approval_records.leave_request_id 
    AND (lr.user_id IN (SELECT auth.uid()) OR lr.staff_id IN (SELECT auth.uid()))
  ) OR
  -- 管理員可以查看
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.user_id = auth.uid() AND s.role = 'admin'
  )
);

CREATE POLICY "approval_records_optimized_insert" ON public.approval_records
FOR INSERT WITH CHECK (
  approver_id IN (SELECT auth.uid()) OR
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.user_id = auth.uid() AND s.role IN ('admin', 'manager')
  )
);

CREATE POLICY "approval_records_optimized_update" ON public.approval_records
FOR UPDATE USING (
  approver_id IN (SELECT auth.uid()) OR
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.user_id = auth.uid() AND s.role = 'admin'
  )
);

-- 優化 staff 表的RLS政策
DROP POLICY IF EXISTS "staff_secure_select" ON public.staff;
DROP POLICY IF EXISTS "staff_secure_insert" ON public.staff;
DROP POLICY IF EXISTS "staff_secure_update" ON public.staff;
DROP POLICY IF EXISTS "staff_secure_delete" ON public.staff;

CREATE POLICY "staff_optimized_select" ON public.staff
FOR SELECT USING (
  -- 用戶可以查看自己的記錄
  user_id IN (SELECT auth.uid()) OR 
  id IN (SELECT auth.uid()) OR
  -- 管理員可以查看所有記錄
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.user_id = auth.uid() AND s.role = 'admin'
  ) OR
  -- 主管可以查看下屬記錄
  supervisor_id IN (SELECT auth.uid())
);

CREATE POLICY "staff_optimized_insert" ON public.staff
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.user_id = auth.uid() AND s.role = 'admin'
  )
);

CREATE POLICY "staff_optimized_update" ON public.staff
FOR UPDATE USING (
  (user_id IN (SELECT auth.uid()) OR id IN (SELECT auth.uid())) OR
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.user_id = auth.uid() AND s.role = 'admin'
  )
);

CREATE POLICY "staff_optimized_delete" ON public.staff
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.user_id = auth.uid() AND s.role = 'admin'
  )
);

-- 優化 annual_leave_balance 的RLS政策
ALTER TABLE public.annual_leave_balance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own annual leave balance" ON public.annual_leave_balance;
DROP POLICY IF EXISTS "Admins can manage all annual leave balances" ON public.annual_leave_balance;

CREATE POLICY "annual_leave_balance_optimized_select" ON public.annual_leave_balance
FOR SELECT USING (
  staff_id IN (SELECT auth.uid()) OR 
  user_id IN (SELECT auth.uid()) OR
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.user_id = auth.uid() AND s.role = 'admin'
  )
);

CREATE POLICY "annual_leave_balance_optimized_manage" ON public.annual_leave_balance
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.user_id = auth.uid() AND s.role = 'admin'
  )
);

-- 優化 companies 的RLS政策
DROP POLICY IF EXISTS "companies_secure_select" ON public.companies;
DROP POLICY IF EXISTS "companies_secure_manage" ON public.companies;

CREATE POLICY "companies_optimized_select" ON public.companies
FOR SELECT USING (true); -- 所有認證用戶可查看

CREATE POLICY "companies_optimized_manage" ON public.companies
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.user_id = auth.uid() AND s.role = 'admin'
  )
);

-- 創建刷新緩存的函數
CREATE OR REPLACE FUNCTION public.refresh_user_permissions_cache()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  REFRESH MATERIALIZED VIEW public.user_permissions_cache;
$$;

-- 創建觸發器來自動更新緩存（當staff表更新時）
CREATE OR REPLACE FUNCTION public.update_user_permissions_cache()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- 可以選擇性地只刷新特定用戶的緩存
  REFRESH MATERIALIZED VIEW public.user_permissions_cache;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 如果不存在則創建觸發器
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'trigger_update_user_permissions_cache'
  ) THEN
    CREATE TRIGGER trigger_update_user_permissions_cache
      AFTER INSERT OR UPDATE OR DELETE ON public.staff
      FOR EACH STATEMENT
      EXECUTE FUNCTION public.update_user_permissions_cache();
  END IF;
END $$;
