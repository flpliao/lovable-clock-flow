
-- 建立 missed_checkin_requests 與 staff 的外鍵關聯
ALTER TABLE public.missed_checkin_requests 
ADD CONSTRAINT fk_missed_checkin_requests_staff_id 
FOREIGN KEY (staff_id) REFERENCES public.staff(id) ON DELETE CASCADE;

-- 為了提升查詢效能，建立索引
CREATE INDEX IF NOT EXISTS idx_missed_checkin_requests_staff_id 
ON public.missed_checkin_requests(staff_id);
