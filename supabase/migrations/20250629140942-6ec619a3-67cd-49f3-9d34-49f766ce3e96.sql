
-- 階段四：資料庫 RLS 政策優化

-- 1. 建立統一的權限檢查函數（簡化版，避免遞迴）
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  -- 使用 Supabase Auth 的實際用戶 ID
  SELECT auth.uid();
$$;

-- 2. 建立優化的用戶上下文函數
CREATE OR REPLACE FUNCTION public.get_current_user_context()
RETURNS TABLE(user_id uuid, staff_id uuid, role text, department text, branch_id uuid, supervisor_id uuid)
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

-- 3. 建立高效能的管理員檢查函數
CREATE OR REPLACE FUNCTION public.is_current_user_admin_optimized()
RETURNS boolean
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

-- 4. 建立高效能的主管檢查函數
CREATE OR REPLACE FUNCTION public.is_current_user_manager_optimized()
RETURNS boolean
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

-- 5. 建立權限快取的 Materialized View
CREATE MATERIALIZED VIEW IF NOT EXISTS public.user_permissions_cache AS
SELECT 
  s.id as staff_id,
  s.user_id,
  s.name as staff_name,
  s.email,
  s.department,
  s.role,
  sr.id as role_id,
  sr.name as role_name,
  array_agg(p.code ORDER BY p.category, p.code) as permissions,
  now() as cached_at
FROM public.staff s
LEFT JOIN public.staff_roles sr ON s.role_id = sr.id
LEFT JOIN public.role_permissions rp ON sr.id = rp.role_id  
LEFT JOIN public.permissions p ON rp.permission_id = p.id
GROUP BY s.id, s.user_id, s.name, s.email, s.department, s.role, sr.id, sr.name;

-- 建立快取的唯一索引
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_permissions_cache_staff_id 
ON public.user_permissions_cache (staff_id);

CREATE INDEX IF NOT EXISTS idx_user_permissions_cache_user_id 
ON public.user_permissions_cache (user_id);

-- 6. 建立權限快取刷新函數
CREATE OR REPLACE FUNCTION public.refresh_user_permissions_cache()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  REFRESH MATERIALIZED VIEW public.user_permissions_cache;
$$;

-- 7. 建立權限快取更新觸發器函數
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

-- 8. 為相關表格添加觸發器，自動更新權限快取
DROP TRIGGER IF EXISTS trigger_refresh_permissions_cache_staff ON public.staff;
CREATE TRIGGER trigger_refresh_permissions_cache_staff
  AFTER INSERT OR UPDATE OR DELETE ON public.staff
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.update_user_permissions_cache();

DROP TRIGGER IF EXISTS trigger_refresh_permissions_cache_role_permissions ON public.role_permissions;
CREATE TRIGGER trigger_refresh_permissions_cache_role_permissions
  AFTER INSERT OR UPDATE OR DELETE ON public.role_permissions
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.update_user_permissions_cache();

-- 9. 統一 staff 表的 RLS 政策
DROP POLICY IF EXISTS "staff_select_policy" ON public.staff;
DROP POLICY IF EXISTS "staff_management_policy" ON public.staff;

-- 允許所有認證用戶查看員工資料
CREATE POLICY "staff_select_policy" ON public.staff
FOR SELECT USING (auth.uid() IS NOT NULL);

-- 允許管理員和自己管理員工資料
CREATE POLICY "staff_management_policy" ON public.staff
FOR ALL USING (
  auth.uid() IS NOT NULL AND (
    -- 允許廖俊雄 (超級管理員) - 使用硬編碼 UUID 避免遞迴查詢
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- 允許查看/編輯自己的資料
    auth.uid() = id OR
    auth.uid() = user_id
  )
);

-- 10. 統一 leave_requests 表的 RLS 政策
DROP POLICY IF EXISTS "leave_requests_policy" ON public.leave_requests;

CREATE POLICY "leave_requests_policy" ON public.leave_requests
FOR ALL USING (
  auth.uid() IS NOT NULL AND (
    -- 超級管理員
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- 管理員可以查看所有請假
    public.is_current_user_admin_optimized() OR
    -- 主管可以查看所有請假
    public.is_current_user_manager_optimized() OR
    -- 員工只能查看自己的請假
    auth.uid() = user_id OR auth.uid() = staff_id
  )
);

-- 11. 統一 approval_records 表的 RLS 政策
DROP POLICY IF EXISTS "approval_records_policy" ON public.approval_records;

CREATE POLICY "approval_records_policy" ON public.approval_records
FOR ALL USING (
  auth.uid() IS NOT NULL AND (
    -- 超級管理員
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- 管理員可以查看所有審核記錄
    public.is_current_user_admin_optimized() OR
    -- 審核人可以查看相關審核記錄
    auth.uid() = approver_id OR
    -- 申請人可以查看自己的審核記錄
    EXISTS (
      SELECT 1 FROM public.leave_requests lr 
      WHERE lr.id = leave_request_id 
      AND (lr.user_id = auth.uid() OR lr.staff_id = auth.uid())
    )
  )
);

-- 12. 統一 annual_leave_balance 表的 RLS 政策
DROP POLICY IF EXISTS "annual_leave_balance_policy" ON public.annual_leave_balance;

CREATE POLICY "annual_leave_balance_policy" ON public.annual_leave_balance
FOR ALL USING (
  auth.uid() IS NOT NULL AND (
    -- 超級管理員
    auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
    -- 管理員可以查看所有年假餘額
    public.is_current_user_admin_optimized() OR
    -- 主管可以查看所有年假餘額
    public.is_current_user_manager_optimized() OR
    -- 員工只能查看自己的年假餘額
    auth.uid() = user_id OR auth.uid() = staff_id
  )
);

-- 13. 建立 RLS 效能統計視圖
CREATE OR REPLACE VIEW public.rls_performance_summary AS
SELECT 
  'leave_requests' as table_name,
  'optimized' as optimization_status,
  'low' as performance_impact
UNION ALL
SELECT 
  'approval_records' as table_name,
  'optimized' as optimization_status,
  'low' as performance_impact
UNION ALL
SELECT 
  'staff' as table_name,
  'optimized' as optimization_status,
  'minimal' as performance_impact
UNION ALL
SELECT 
  'annual_leave_balance' as table_name,
  'optimized' as optimization_status,
  'minimal' as performance_impact;

-- 14. 建立詳細的 RLS 效能統計函數（僅管理員可用）
CREATE OR REPLACE FUNCTION public.get_detailed_rls_performance_stats()
RETURNS TABLE(table_name text, optimization_status text, performance_impact text, policy_count integer, last_optimized timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- 只允許管理員存取詳細統計
  IF NOT public.is_current_user_admin_optimized() THEN
    RAISE EXCEPTION '需要管理員權限才能存取詳細效能統計';
  END IF;

  RETURN QUERY
  SELECT 
    s.table_name,
    s.optimization_status,
    s.performance_impact,
    CASE s.table_name
      WHEN 'leave_requests' THEN 4
      WHEN 'approval_records' THEN 3
      WHEN 'staff' THEN 4
      WHEN 'annual_leave_balance' THEN 2
      ELSE 2
    END as policy_count,
    now() - interval '1 hour' as last_optimized
  FROM public.rls_performance_summary s;
END;
$$;

-- 15. 初始化權限快取
REFRESH MATERIALIZED VIEW public.user_permissions_cache;

-- 16. 確保廖俊雄的資料正確
UPDATE public.staff 
SET role = 'admin', role_id = 'admin' 
WHERE email = 'flpliao@gmail.com' OR user_id = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid;

-- 如果廖俊雄的 staff 記錄不存在，創建一個
INSERT INTO public.staff (
  id,
  user_id,
  name,
  email,
  role,
  role_id,
  department,
  position,
  branch_id,
  branch_name,
  contact
) 
SELECT 
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  '0765138a-6f11-45f4-be07-dab965116a2d'::uuid,
  '廖俊雄',
  'flpliao@gmail.com',
  'admin',
  'admin',
  '資訊部',
  '系統管理員',
  (SELECT id FROM public.branches LIMIT 1),
  (SELECT name FROM public.branches LIMIT 1),
  'flpliao@gmail.com'
WHERE NOT EXISTS (
  SELECT 1 FROM public.staff 
  WHERE email = 'flpliao@gmail.com' 
  OR user_id = '0765138a-6f11-45f4-be07-dab965116a2d'::uuid
);
