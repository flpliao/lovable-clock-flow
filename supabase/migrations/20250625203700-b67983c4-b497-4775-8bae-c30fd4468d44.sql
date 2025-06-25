
-- 為 overtime_requests 表格的 staff_id 欄位添加外鍵約束
ALTER TABLE public.overtime_requests 
ADD CONSTRAINT fk_overtime_requests_staff_id 
FOREIGN KEY (staff_id) REFERENCES public.staff(id);

-- 為 overtime_requests 表格的 user_id 欄位也添加外鍵約束（如果需要的話）
ALTER TABLE public.overtime_requests 
ADD CONSTRAINT fk_overtime_requests_user_id 
FOREIGN KEY (user_id) REFERENCES public.staff(id);
