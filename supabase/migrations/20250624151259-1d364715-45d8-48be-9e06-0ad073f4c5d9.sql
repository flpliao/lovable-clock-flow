
-- 先刪除所有現有的政策，然後重新建立
-- 刪除加班相關的現有政策
DROP POLICY IF EXISTS "Users can view their own overtime requests" ON public.overtimes;
DROP POLICY IF EXISTS "Users can create their own overtime requests" ON public.overtimes;
DROP POLICY IF EXISTS "Users can create overtime requests" ON public.overtimes;
DROP POLICY IF EXISTS "Users can update their own pending requests" ON public.overtimes;
DROP POLICY IF EXISTS "Managers can view overtime requests for approval" ON public.overtimes;
DROP POLICY IF EXISTS "Managers can update overtime requests" ON public.overtimes;
DROP POLICY IF EXISTS "Admins can manage all overtime requests" ON public.overtimes;

-- 刪除忘記打卡相關的現有政策
DROP POLICY IF EXISTS "Users can view their own missed checkin requests" ON public.missed_checkin_requests;
DROP POLICY IF EXISTS "Users can create missed checkin requests" ON public.missed_checkin_requests;
DROP POLICY IF EXISTS "Users can create their own missed checkin requests" ON public.missed_checkin_requests;
DROP POLICY IF EXISTS "Users can update their own pending requests" ON public.missed_checkin_requests;
DROP POLICY IF EXISTS "Managers can view requests for approval" ON public.missed_checkin_requests;
DROP POLICY IF EXISTS "Managers can update requests" ON public.missed_checkin_requests;
DROP POLICY IF EXISTS "Admins can manage all missed checkin requests" ON public.missed_checkin_requests;
DROP POLICY IF EXISTS "Managers can view pending requests for approval" ON public.missed_checkin_requests;
DROP POLICY IF EXISTS "Managers can update missed checkin requests" ON public.missed_checkin_requests;

-- 新增權限（如果不存在）
INSERT INTO public.permissions (id, name, code, description, category) VALUES
('overtime:view_own', '查看自己加班記錄', 'overtime:view_own', '可以查看自己的加班申請和記錄', 'overtime'),
('overtime:view_all', '查看所有加班記錄', 'overtime:view_all', '可以查看所有員工的加班記錄', 'overtime'),
('overtime:create', '申請加班', 'overtime:create', '可以提交加班申請', 'overtime'),
('overtime:approve', '審核加班', 'overtime:approve', '可以審核員工的加班申請', 'overtime'),
('overtime:manage', '完整加班管理', 'overtime:manage', '具備完整的加班管理權限', 'overtime'),
('missed_checkin:view_own', '查看自己忘記打卡記錄', 'missed_checkin:view_own', '可以查看自己的忘記打卡申請和記錄', 'missed_checkin'),
('missed_checkin:view_all', '查看所有忘記打卡記錄', 'missed_checkin:view_all', '可以查看所有員工的忘記打卡記錄', 'missed_checkin'),
('missed_checkin:create', '申請忘記打卡', 'missed_checkin:create', '可以提交忘記打卡申請', 'missed_checkin'),
('missed_checkin:approve', '審核忘記打卡', 'missed_checkin:approve', '可以審核員工的忘記打卡申請', 'missed_checkin'),
('missed_checkin:manage', '完整忘記打卡管理', 'missed_checkin:manage', '具備完整的忘記打卡管理權限', 'missed_checkin')
ON CONFLICT (code) DO NOTHING;

-- 建立忘記打卡審核記錄表（如果不存在）
CREATE TABLE IF NOT EXISTS public.missed_checkin_approval_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  missed_checkin_request_id UUID NOT NULL,
  approver_id UUID,
  approver_name TEXT NOT NULL,
  level INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  approval_date TIMESTAMP WITH TIME ZONE,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 更新忘記打卡申請表，添加審核層級欄位
ALTER TABLE public.missed_checkin_requests 
ADD COLUMN IF NOT EXISTS approval_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS current_approver UUID,
ADD COLUMN IF NOT EXISTS approved_by_name TEXT,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- 啟用 RLS
ALTER TABLE public.overtimes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missed_checkin_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missed_checkin_approval_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.overtime_approval_records ENABLE ROW LEVEL SECURITY;

-- 重新建立加班的 RLS 政策
CREATE POLICY "Users can view own overtime requests" 
  ON public.overtimes 
  FOR SELECT 
  USING (staff_id = get_current_user_id());

CREATE POLICY "Users can create own overtime requests" 
  ON public.overtimes 
  FOR INSERT 
  WITH CHECK (staff_id = get_current_user_id());

CREATE POLICY "Users can update own pending overtime requests" 
  ON public.overtimes 
  FOR UPDATE 
  USING (staff_id = get_current_user_id() AND status = 'pending');

CREATE POLICY "Managers can view overtime for approval" 
  ON public.overtimes 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.staff s1, public.staff s2 
      WHERE s1.id = staff_id 
      AND s2.id = get_current_user_id()
      AND (s2.role = 'admin' OR s1.supervisor_id = s2.id)
    )
  );

CREATE POLICY "Managers can update overtime for approval" 
  ON public.overtimes 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.staff s1, public.staff s2 
      WHERE s1.id = staff_id 
      AND s2.id = get_current_user_id()
      AND (s2.role = 'admin' OR s1.supervisor_id = s2.id)
    )
  );

CREATE POLICY "Admins can manage all overtime" 
  ON public.overtimes 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE id = get_current_user_id() 
      AND role = 'admin'
    )
  );

-- 重新建立忘記打卡申請的 RLS 政策
CREATE POLICY "Users can view own missed checkin requests" 
  ON public.missed_checkin_requests 
  FOR SELECT 
  USING (staff_id = get_current_user_id());

CREATE POLICY "Users can create own missed checkin requests" 
  ON public.missed_checkin_requests 
  FOR INSERT 
  WITH CHECK (staff_id = get_current_user_id());

CREATE POLICY "Users can update own pending missed checkin requests" 
  ON public.missed_checkin_requests 
  FOR UPDATE 
  USING (staff_id = get_current_user_id() AND status = 'pending');

CREATE POLICY "Managers can view missed checkin for approval" 
  ON public.missed_checkin_requests 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.staff s1, public.staff s2 
      WHERE s1.id = staff_id 
      AND s2.id = get_current_user_id()
      AND (s2.role = 'admin' OR s1.supervisor_id = s2.id)
    )
  );

CREATE POLICY "Managers can update missed checkin for approval" 
  ON public.missed_checkin_requests 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.staff s1, public.staff s2 
      WHERE s1.id = staff_id 
      AND s2.id = get_current_user_id()
      AND (s2.role = 'admin' OR s1.supervisor_id = s2.id)
    )
  );

CREATE POLICY "Admins can manage all missed checkin" 
  ON public.missed_checkin_requests 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE id = get_current_user_id() 
      AND role = 'admin'
    )
  );

-- 忘記打卡審核記錄的 RLS 政策
CREATE POLICY "Users can view own missed checkin approval records" 
  ON public.missed_checkin_approval_records 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.missed_checkin_requests mcr 
      WHERE mcr.id = missed_checkin_request_id 
      AND mcr.staff_id = get_current_user_id()
    )
  );

CREATE POLICY "Approvers can manage missed checkin approval records" 
  ON public.missed_checkin_approval_records 
  FOR ALL 
  USING (
    approver_id = get_current_user_id() OR
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE id = get_current_user_id() 
      AND role IN ('admin', 'manager')
    )
  );

-- 加班審核記錄的 RLS 政策
CREATE POLICY "Users can view own overtime approval records" 
  ON public.overtime_approval_records 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.overtimes o 
      WHERE o.id = overtime_id 
      AND o.staff_id = get_current_user_id()
    )
  );

CREATE POLICY "Approvers can manage overtime approval records" 
  ON public.overtime_approval_records 
  FOR ALL 
  USING (
    approver_id = get_current_user_id() OR
    EXISTS (
      SELECT 1 FROM public.staff 
      WHERE id = get_current_user_id() 
      AND role IN ('admin', 'manager')
    )
  );

-- 建立觸發器函數（如果不存在）
CREATE OR REPLACE FUNCTION public.update_missed_checkin_approval_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 建立觸發器（如果不存在）
DROP TRIGGER IF EXISTS update_missed_checkin_approval_records_updated_at ON public.missed_checkin_approval_records;
CREATE TRIGGER update_missed_checkin_approval_records_updated_at
    BEFORE UPDATE ON public.missed_checkin_approval_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_missed_checkin_approval_records_updated_at();
