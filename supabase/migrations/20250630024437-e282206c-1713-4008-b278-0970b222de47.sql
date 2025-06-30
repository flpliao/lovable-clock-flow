
-- 修復 staff 表的 RLS 政策無限遞迴問題
-- 首先刪除現有有問題的政策
DROP POLICY IF EXISTS "staff_authenticated_select" ON public.staff;
DROP POLICY IF EXISTS "staff_admin_all_operations" ON public.staff;
DROP POLICY IF EXISTS "staff_self_update" ON public.staff;

-- 創建新的安全 RLS 政策，避免遞迴問題
-- 1. 允許所有認證用戶查看員工資料（簡化策略）
CREATE POLICY "staff_select_safe" ON public.staff
FOR SELECT TO authenticated
USING (true);

-- 2. 管理員可以進行所有操作（使用安全函數）
CREATE POLICY "staff_admin_operations_safe" ON public.staff
FOR ALL TO authenticated
USING (
  -- 使用現有的安全函數，避免遞迴
  public.is_current_user_admin_safe()
)
WITH CHECK (
  public.is_current_user_admin_safe()
);

-- 3. 員工可以更新自己的基本資料
CREATE POLICY "staff_self_update_safe" ON public.staff
FOR UPDATE TO authenticated
USING (
  auth.uid() = user_id OR auth.uid() = id
)
WITH CHECK (
  auth.uid() = user_id OR auth.uid() = id
);

-- 確保 RLS 已啟用
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- 測試新的 RLS 政策
SELECT public.test_staff_rls();
