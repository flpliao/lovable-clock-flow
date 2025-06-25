
-- 創建加班申請表
CREATE TABLE public.overtime_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id uuid,
    user_id uuid,
    overtime_date date NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    hours numeric NOT NULL,
    reason text NOT NULL,
    status text NOT NULL DEFAULT 'pending'::text,
    current_approver uuid,
    approval_level integer DEFAULT 1,
    rejection_reason text,
    attachment_url text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 創建加班審核記錄表
CREATE TABLE public.overtime_approval_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    overtime_request_id uuid NOT NULL,
    approver_id uuid,
    approver_name text NOT NULL,
    status text NOT NULL DEFAULT 'pending'::text,
    level integer NOT NULL,
    approval_date timestamp with time zone,
    comment text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 創建更新時間觸發器
CREATE OR REPLACE FUNCTION update_overtime_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_overtime_requests_updated_at
    BEFORE UPDATE ON public.overtime_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_overtime_updated_at();

CREATE TRIGGER update_overtime_approval_records_updated_at
    BEFORE UPDATE ON public.overtime_approval_records
    FOR EACH ROW
    EXECUTE FUNCTION update_overtime_updated_at();

-- 添加索引以提高查詢效能
CREATE INDEX idx_overtime_requests_staff_id ON public.overtime_requests(staff_id);
CREATE INDEX idx_overtime_requests_user_id ON public.overtime_requests(user_id);
CREATE INDEX idx_overtime_requests_status ON public.overtime_requests(status);
CREATE INDEX idx_overtime_requests_current_approver ON public.overtime_requests(current_approver);
CREATE INDEX idx_overtime_approval_records_overtime_request_id ON public.overtime_approval_records(overtime_request_id);
CREATE INDEX idx_overtime_approval_records_approver_id ON public.overtime_approval_records(approver_id);
