
-- 移除加班相關的觸發器（使用 CASCADE）
DROP TRIGGER IF EXISTS setup_overtime_approval_workflow_trigger ON public.overtimes CASCADE;
DROP TRIGGER IF EXISTS notify_overtime_status_change_trigger ON public.overtimes CASCADE;
DROP TRIGGER IF EXISTS update_overtime_approval_records_updated_at_trigger ON public.overtime_approval_records CASCADE;

-- 移除加班相關的函數（使用 CASCADE）
DROP FUNCTION IF EXISTS public.setup_overtime_approval_workflow() CASCADE;
DROP FUNCTION IF EXISTS public.notify_overtime_status_change() CASCADE;
DROP FUNCTION IF EXISTS public.update_overtime_approval_records_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.get_overtime_supervisor_hierarchy(uuid, integer) CASCADE;
DROP FUNCTION IF EXISTS public.create_overtime_notification(uuid, text, text, text, uuid, boolean) CASCADE;
DROP FUNCTION IF EXISTS public.setup_overtime_approval_flow() CASCADE;
DROP FUNCTION IF EXISTS public.notify_overtime_approval_result() CASCADE;
DROP FUNCTION IF EXISTS public.get_supervisor_hierarchy(uuid, integer) CASCADE;

-- 移除加班審核記錄表
DROP TABLE IF EXISTS public.overtime_approval_records CASCADE;

-- 移除加班申請表
DROP TABLE IF EXISTS public.overtimes CASCADE;
