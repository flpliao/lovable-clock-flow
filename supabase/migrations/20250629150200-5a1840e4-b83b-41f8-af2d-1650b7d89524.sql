
-- 從 API 中隱藏 user_permissions_cache Materialized View
-- 撤銷對 user_permissions_cache 的 API 訪問權限
REVOKE ALL ON public.user_permissions_cache FROM anon, authenticated;

-- 確保只有資料庫內部函數可以訪問這個 Materialized View
-- 不允許通過 REST API 或 GraphQL API 直接訪問
GRANT SELECT ON public.user_permissions_cache TO postgres;

-- 更新 get_user_permissions_cache 函數的註解以說明安全考量
COMMENT ON FUNCTION public.get_user_permissions_cache(uuid) IS 
'安全包裝函數，用於訪問 user_permissions_cache Materialized View。由於 Materialized View 不支援 RLS，此函數提供適當的權限檢查。';

-- 為 user_permissions_cache 添加註解說明其用途和安全考量
COMMENT ON MATERIALIZED VIEW public.user_permissions_cache IS 
'用戶權限快取，僅供內部使用。不應直接通過 API 訪問，請使用 get_user_permissions_cache() 函數。';
