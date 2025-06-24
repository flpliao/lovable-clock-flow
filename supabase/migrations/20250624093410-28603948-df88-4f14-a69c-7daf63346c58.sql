
-- 為 overtimes 表添加審核流程相關欄位
ALTER TABLE public.overtimes 
ADD COLUMN IF NOT EXISTS approval_level integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS current_approver uuid,
ADD COLUMN IF NOT EXISTS approved_by_name text,
ADD COLUMN IF NOT EXISTS rejection_reason text;

-- 創建加班申請審核記錄表
CREATE TABLE IF NOT EXISTS public.overtime_approval_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  overtime_id uuid NOT NULL,
  approver_id uuid,
  approver_name text NOT NULL,
  level integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  approval_date timestamp with time zone,
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 為新表添加 RLS
ALTER TABLE public.overtime_approval_records ENABLE ROW LEVEL SECURITY;

-- 創建更新時間觸發器
CREATE OR REPLACE FUNCTION update_overtime_approval_records_updated_at()
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

CREATE TRIGGER update_overtime_approval_records_updated_at_trigger
    BEFORE UPDATE ON public.overtime_approval_records
    FOR EACH ROW
    EXECUTE FUNCTION update_overtime_approval_records_updated_at();

-- 為加班申請創建通知函數
CREATE OR REPLACE FUNCTION create_overtime_notification(
  p_user_id uuid,
  p_title text,
  p_message text,
  p_type text DEFAULT 'overtime_approval',
  p_overtime_id uuid DEFAULT NULL,
  p_action_required boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    title,
    message,
    type,
    leave_request_id, -- 重用這個欄位存放 overtime_id
    action_required,
    is_read,
    created_at
  ) VALUES (
    p_user_id,
    p_title,
    p_message,
    p_type,
    p_overtime_id,
    p_action_required,
    false,
    now()
  )
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$function$;
