
-- 修正 leave_requests 的 RLS 政策，解決權限問題

-- 首先停用 RLS 以便清理現有政策
ALTER TABLE public.leave_requests DISABLE ROW LEVEL SECURITY;

-- 清除所有現有的 leave_requests 政策
DROP POLICY IF EXISTS "leave_requests_view_own" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_insert_own" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_update_own_pending" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_admin_view_all" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_admin_update" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_approver_update" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_secure_select" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_secure_insert" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_secure_update" ON public.leave_requests;
DROP POLICY IF EXISTS "leave_requests_secure_delete" ON public.leave_requests;

-- 重新啟用 RLS
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- 創建新的簡化且寬鬆的 RLS 政策

-- 1. 查看政策：用戶可以查看自己的請假申請或管理員可以查看所有
CREATE POLICY "leave_requests_select_policy" ON public.leave_requests
FOR SELECT TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    -- 用戶可以查看自己的申請
    user_id = auth.uid() OR 
    staff_id = auth.uid() OR
    -- 管理員可以查看所有申請
    public.is_user_admin(auth.uid()) OR
    -- 主管可以查看下屬的申請
    (public.is_user_manager(auth.uid()) AND 
     EXISTS (
       SELECT 1 FROM public.staff s 
       WHERE (s.id = leave_requests.staff_id OR s.user_id = leave_requests.user_id)
       AND s.supervisor_id = auth.uid()
     )) OR
    -- 當前審核者可以查看指派的申請
    current_approver = auth.uid()
  )
);

-- 2. 插入政策：認證用戶可以為自己創建請假申請
CREATE POLICY "leave_requests_insert_policy" ON public.leave_requests
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    -- 確保 user_id 或 staff_id 是當前用戶
    user_id = auth.uid() OR 
    staff_id = auth.uid()
  )
);

-- 3. 更新政策：用戶可以更新自己的待審核申請，或管理員/審核者可以更新
CREATE POLICY "leave_requests_update_policy" ON public.leave_requests
FOR UPDATE TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    -- 用戶可以更新自己的待審核申請
    ((user_id = auth.uid() OR staff_id = auth.uid()) AND status = 'pending') OR
    -- 管理員可以更新所有申請
    public.is_user_admin(auth.uid()) OR
    -- 主管可以更新下屬的申請
    (public.is_user_manager(auth.uid()) AND 
     EXISTS (
       SELECT 1 FROM public.staff s 
       WHERE (s.id = leave_requests.staff_id OR s.user_id = leave_requests.user_id)
       AND s.supervisor_id = auth.uid()
     )) OR
    -- 當前審核者可以更新指派的申請
    current_approver = auth.uid()
  )
);

-- 4. 刪除政策：用戶可以刪除自己的待審核申請，或管理員可以刪除任何申請
CREATE POLICY "leave_requests_delete_policy" ON public.leave_requests
FOR DELETE TO authenticated
USING (
  auth.uid() IS NOT NULL AND (
    -- 用戶可以刪除自己的待審核申請
    ((user_id = auth.uid() OR staff_id = auth.uid()) AND status = 'pending') OR
    -- 管理員可以刪除任何申請
    public.is_user_admin(auth.uid())
  )
);
