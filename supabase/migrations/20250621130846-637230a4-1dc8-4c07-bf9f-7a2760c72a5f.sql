
-- 建立忘記打卡申請表格
CREATE TABLE public.missed_checkin_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id UUID NOT NULL,
  request_date DATE NOT NULL,
  missed_type TEXT NOT NULL CHECK (missed_type IN ('check_in', 'check_out', 'both')),
  requested_check_in_time TIMESTAMP WITH TIME ZONE,
  requested_check_out_time TIMESTAMP WITH TIME ZONE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID,
  approval_comment TEXT,
  approval_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 建立 RLS 政策
ALTER TABLE public.missed_checkin_requests ENABLE ROW LEVEL SECURITY;

-- 允許員工查看自己的申請
CREATE POLICY "Users can view their own missed checkin requests" 
  ON public.missed_checkin_requests 
  FOR SELECT 
  USING (staff_id = get_current_user_id());

-- 允許員工建立申請
CREATE POLICY "Users can create missed checkin requests" 
  ON public.missed_checkin_requests 
  FOR INSERT 
  WITH CHECK (staff_id = get_current_user_id());

-- 允許主管查看需要審核的申請
CREATE POLICY "Managers can view pending requests for approval" 
  ON public.missed_checkin_requests 
  FOR SELECT 
  USING (
    status = 'pending' AND 
    EXISTS (
      SELECT 1 FROM public.staff s1, public.staff s2 
      WHERE s1.id = staff_id 
      AND s2.id = get_current_user_id()
      AND (s2.role = 'admin' OR s1.supervisor_id = s2.id)
    )
  );

-- 允許主管更新申請狀態
CREATE POLICY "Managers can update missed checkin requests" 
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

-- 建立更新時間觸發器
CREATE TRIGGER update_missed_checkin_requests_updated_at
  BEFORE UPDATE ON public.missed_checkin_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
