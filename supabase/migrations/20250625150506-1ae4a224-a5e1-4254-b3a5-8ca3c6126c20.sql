
-- 清除現有的加班相關表格和觸發器
DROP TABLE IF EXISTS public.overtime_approval_records CASCADE;
DROP TABLE IF EXISTS public.overtime_requests CASCADE;
DROP TABLE IF EXISTS public.overtime_types CASCADE;

-- 創建加班類型表（對應 leave_types）
CREATE TABLE public.overtime_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  name_zh text NOT NULL,
  name_en text NOT NULL,
  description text,
  compensation_type text NOT NULL DEFAULT 'overtime_pay', -- overtime_pay, compensatory_time
  max_hours_per_day integer,
  max_hours_per_month integer,
  requires_approval boolean NOT NULL DEFAULT true,
  requires_attachment boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  is_system_default boolean NOT NULL DEFAULT false,
  special_rules jsonb DEFAULT '{}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 創建加班申請表（對應 leave_requests）
CREATE TABLE public.overtime_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  staff_id uuid,
  overtime_type text NOT NULL,
  overtime_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  hours numeric NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  attachment_url text,
  approval_level integer DEFAULT 1,
  current_approver uuid,
  rejection_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 創建加班審核記錄表（對應 approval_records）
CREATE TABLE public.overtime_approval_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  overtime_request_id uuid NOT NULL,
  approver_id uuid,
  approver_name text NOT NULL,
  level integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  approval_date timestamp with time zone,
  comment text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 添加外鍵約束
ALTER TABLE public.overtime_approval_records 
ADD CONSTRAINT fk_overtime_approval_records_overtime_request_id 
FOREIGN KEY (overtime_request_id) REFERENCES public.overtime_requests(id) ON DELETE CASCADE;

-- 啟用 RLS
ALTER TABLE public.overtime_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.overtime_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.overtime_approval_records ENABLE ROW LEVEL SECURITY;

-- 創建加班類型的 RLS 政策（所有人可查看）
CREATE POLICY "Everyone can view active overtime types" ON public.overtime_types
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage overtime types" ON public.overtime_types
FOR ALL USING (
  get_current_user_id() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE id = get_current_user_id() AND role = 'admin'
  )
);

-- 創建加班申請的 RLS 政策（完全仿照請假申請）
CREATE POLICY "Users can view their own overtime requests" ON public.overtime_requests
FOR SELECT USING (
  staff_id = get_current_user_id() OR user_id = get_current_user_id()
);

CREATE POLICY "Users can create their own overtime requests" ON public.overtime_requests
FOR INSERT WITH CHECK (
  staff_id = get_current_user_id() OR user_id = get_current_user_id()
);

CREATE POLICY "Users can update their own pending overtime requests" ON public.overtime_requests
FOR UPDATE USING (
  (staff_id = get_current_user_id() OR user_id = get_current_user_id()) AND status = 'pending'
);

CREATE POLICY "Supervisors can view overtime requests for approval" ON public.overtime_requests
FOR SELECT USING (
  current_approver = get_current_user_id() OR
  EXISTS (
    SELECT 1 FROM public.staff s 
    WHERE s.id = staff_id AND s.supervisor_id = get_current_user_id()
  ) OR
  get_current_user_id() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE id = get_current_user_id() AND role = 'admin'
  )
);

CREATE POLICY "Supervisors can update overtime requests for approval" ON public.overtime_requests
FOR UPDATE USING (
  (current_approver = get_current_user_id() AND status = 'pending') OR
  get_current_user_id() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE id = get_current_user_id() AND role = 'admin'
  )
);

CREATE POLICY "Admins can manage all overtime requests" ON public.overtime_requests
FOR ALL USING (
  get_current_user_id() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff 
    WHERE id = get_current_user_id() AND role = 'admin'
  )
);

-- 創建加班審核記錄的 RLS 政策
CREATE POLICY "Users can view their own overtime approval records" ON public.overtime_approval_records
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.overtime_requests o
    WHERE o.id = overtime_request_id AND (o.staff_id = get_current_user_id() OR o.user_id = get_current_user_id())
  )
);

CREATE POLICY "Approvers can view relevant overtime approval records" ON public.overtime_approval_records
FOR SELECT USING (
  approver_id = get_current_user_id() OR
  get_current_user_id() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff
    WHERE id = get_current_user_id() AND role = 'admin'
  )
);

CREATE POLICY "Approvers can update overtime approval records" ON public.overtime_approval_records
FOR UPDATE USING (
  approver_id = get_current_user_id() OR
  get_current_user_id() = '550e8400-e29b-41d4-a716-446655440001'::uuid OR
  EXISTS (
    SELECT 1 FROM public.staff
    WHERE id = get_current_user_id() AND role = 'admin'
  )
);

CREATE POLICY "System can insert overtime approval records" ON public.overtime_approval_records
FOR INSERT WITH CHECK (true);

-- 創建更新時間觸發器
CREATE OR REPLACE FUNCTION update_overtime_types_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION update_overtime_requests_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION update_overtime_approval_records_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- 創建觸發器
CREATE TRIGGER update_overtime_types_updated_at_trigger
    BEFORE UPDATE ON public.overtime_types
    FOR EACH ROW
    EXECUTE FUNCTION update_overtime_types_updated_at();

CREATE TRIGGER update_overtime_requests_updated_at_trigger
    BEFORE UPDATE ON public.overtime_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_overtime_requests_updated_at();

CREATE TRIGGER update_overtime_approval_records_updated_at_trigger
    BEFORE UPDATE ON public.overtime_approval_records
    FOR EACH ROW
    EXECUTE FUNCTION update_overtime_approval_records_updated_at();

-- 插入預設加班類型
INSERT INTO public.overtime_types (code, name_zh, name_en, description, compensation_type, is_system_default, sort_order) VALUES
('regular_overtime', '一般加班', 'Regular Overtime', '一般工作日加班', 'overtime_pay', true, 1),
('holiday_overtime', '假日加班', 'Holiday Overtime', '假日或國定假日加班', 'overtime_pay', true, 2),
('emergency_overtime', '緊急加班', 'Emergency Overtime', '緊急或臨時加班', 'overtime_pay', true, 3),
('project_overtime', '專案加班', 'Project Overtime', '專案相關加班', 'compensatory_time', true, 4);

-- 創建加班通知函數
CREATE OR REPLACE FUNCTION create_overtime_notification(
  p_user_id uuid,
  p_title text,
  p_message text,
  p_type text DEFAULT 'overtime_approval',
  p_overtime_request_id uuid DEFAULT NULL,
  p_action_required boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO public.notifications (
    user_id,
    title,
    message,
    type,
    leave_request_id, -- 重用這個欄位存放 overtime_request_id
    action_required,
    is_read,
    created_at
  ) VALUES (
    p_user_id,
    p_title,
    p_message,
    p_type,
    p_overtime_request_id,
    p_action_required,
    false,
    now()
  )
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$function$;
