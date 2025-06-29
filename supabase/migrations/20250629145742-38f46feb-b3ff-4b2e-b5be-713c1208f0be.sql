
-- 修正函數的 search_path 參數設定
-- 更新 refresh_user_permissions_cache 函數
CREATE OR REPLACE FUNCTION public.refresh_user_permissions_cache()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  REFRESH MATERIALIZED VIEW public.user_permissions_cache;
$$;

-- 更新 update_user_permissions_cache 函數
CREATE OR REPLACE FUNCTION public.update_user_permissions_cache()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- 可以選擇性地只刷新特定用戶的緩存
  REFRESH MATERIALIZED VIEW public.user_permissions_cache;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 由於 Materialized View 不支援 RLS，我們建立一個包裝函數來控制訪問
CREATE OR REPLACE FUNCTION public.get_user_permissions_cache(target_user_id uuid DEFAULT NULL)
RETURNS TABLE(
  user_id uuid,
  permissions text[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_role text;
BEGIN
  -- 檢查當前用戶是否為管理員
  SELECT role INTO current_user_role 
  FROM staff 
  WHERE user_id = auth.uid() OR id = auth.uid() 
  LIMIT 1;
  
  -- 如果是管理員或超級管理員，可以查看所有用戶的權限緩存
  IF current_user_role = 'admin' OR auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid THEN
    RETURN QUERY
    SELECT upc.user_id, upc.permissions
    FROM user_permissions_cache upc
    WHERE target_user_id IS NULL OR upc.user_id = target_user_id;
  ELSE
    -- 一般用戶只能查看自己的權限緩存
    RETURN QUERY
    SELECT upc.user_id, upc.permissions
    FROM user_permissions_cache upc
    WHERE upc.user_id = auth.uid();
  END IF;
END;
$$;
