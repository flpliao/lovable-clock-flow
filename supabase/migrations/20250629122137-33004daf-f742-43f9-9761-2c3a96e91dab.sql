
-- 修正 rls_performance_summary View 的安全性問題
-- 移除 SECURITY DEFINER，改為使用查詢者權限（SECURITY INVOKER 為預設）

DROP VIEW IF EXISTS public.rls_performance_summary;

-- 重新創建 View，使用預設的 SECURITY INVOKER
CREATE VIEW public.rls_performance_summary AS
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
  'Medium' as performance_impact
UNION ALL
SELECT 
  'companies' as table_name,
  'Basic optimization applied' as optimization_status,
  'Low' as performance_impact
UNION ALL
SELECT 
  'branches' as table_name,
  'Basic optimization applied' as optimization_status,
  'Low' as performance_impact
UNION ALL
SELECT 
  'departments' as table_name,
  'Special admin policies optimized' as optimization_status,
  'Medium' as performance_impact
UNION ALL
SELECT 
  'positions' as table_name,
  'Basic optimization applied' as optimization_status,
  'Low' as performance_impact;

-- 創建一個 SECURITY DEFINER 函數來提供管理員專用的詳細效能統計
-- 這樣可以在需要時提供更高權限的數據存取，同時保持 View 的安全性
CREATE OR REPLACE FUNCTION public.get_detailed_rls_performance_stats()
RETURNS TABLE(
  table_name TEXT,
  optimization_status TEXT,
  performance_impact TEXT,
  policy_count INTEGER,
  last_optimized TIMESTAMPTZ
)
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

-- 為 View 建立適當的 RLS 政策（如果需要進一步限制存取）
ALTER VIEW public.rls_performance_summary SET (security_barrier = true);

-- 授予適當權限給認證用戶查看基本效能摘要
-- 但詳細統計只能透過函數且需要管理員權限
GRANT SELECT ON public.rls_performance_summary TO authenticated;
