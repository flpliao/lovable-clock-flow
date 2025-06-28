
-- 修正 leave_requests 表格的外鍵約束問題
-- 檢查並修正 user_id 和 staff_id 的外鍵約束

-- 首先檢查現有的外鍵約束
-- 如果 leave_requests_user_id_fkey 約束存在且指向 auth.users，需要移除它
-- 因為我們不能直接引用 auth schema

-- 移除可能存在的有問題的外鍵約束
ALTER TABLE public.leave_requests 
DROP CONSTRAINT IF EXISTS leave_requests_user_id_fkey;

-- 移除可能存在的其他有問題的外鍵約束
ALTER TABLE public.leave_requests 
DROP CONSTRAINT IF EXISTS leave_requests_staff_id_fkey;

-- 不要重新建立外鍵約束到 auth.users，因為這會導致問題
-- 相反，我們依賴應用層面的驗證和 RLS 政策來確保資料完整性

-- 確保 user_id 和 staff_id 欄位允許 NULL，這樣可以更靈活地處理不同情況
ALTER TABLE public.leave_requests 
ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.leave_requests 
ALTER COLUMN staff_id DROP NOT NULL;

-- 添加檢查約束，確保至少有一個 ID 不為空
ALTER TABLE public.leave_requests 
ADD CONSTRAINT leave_requests_user_staff_check 
CHECK (user_id IS NOT NULL OR staff_id IS NOT NULL);
