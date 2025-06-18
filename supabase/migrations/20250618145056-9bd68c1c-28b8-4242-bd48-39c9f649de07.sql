
-- 修正資料庫函數的安全配置問題

-- 1. 為 update_schedules_updated_at 函數設定 search_path
CREATE OR REPLACE FUNCTION public.update_schedules_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- 2. 為 get_current_user_role_safe 函數設定 search_path
CREATE OR REPLACE FUNCTION public.get_current_user_role_safe()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role FROM public.staff WHERE id = auth.uid() LIMIT 1;
$function$;

-- 3. 為 update_updated_at_column 函數設定 search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- 4. 檢查並設定 Auth 配置的 OTP 過期時間（如果可以通過 SQL 配置）
-- 注意：這個設定通常需要在 Supabase Dashboard 的 Auth 設定中調整

-- 5. 檢查密碼洩漏保護設定
-- 注意：這個設定需要在 Supabase Dashboard 的 Auth > Settings 中啟用
