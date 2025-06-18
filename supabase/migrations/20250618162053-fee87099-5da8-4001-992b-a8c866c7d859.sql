
-- 為廖俊雄創建特殊的 RLS 政策，讓他可以存取所有資料
-- 廖俊雄的固定 UUID: 550e8400-e29b-41d4-a716-446655440001

-- 為 departments 表格創建廖俊雄的特殊政策
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong" ON public.departments;
CREATE POLICY "Enable all access for Liao Junxiong" ON public.departments
FOR ALL 
TO authenticated
USING (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid)
WITH CHECK (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid);

-- 為 staff 表格創建廖俊雄的特殊政策
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong staff" ON public.staff;
CREATE POLICY "Enable all access for Liao Junxiong staff" ON public.staff
FOR ALL 
TO authenticated
USING (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid)
WITH CHECK (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid);

-- 為 companies 表格創建廖俊雄的特殊政策
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong companies" ON public.companies;
CREATE POLICY "Enable all access for Liao Junxiong companies" ON public.companies
FOR ALL 
TO authenticated
USING (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid)
WITH CHECK (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid);

-- 為 branches 表格創建廖俊雄的特殊政策
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong branches" ON public.branches;
CREATE POLICY "Enable all access for Liao Junxiong branches" ON public.branches
FOR ALL 
TO authenticated
USING (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid)
WITH CHECK (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid);

-- 為 announcements 表格創建廖俊雄的特殊政策
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong announcements" ON public.announcements;
CREATE POLICY "Enable all access for Liao Junxiong announcements" ON public.announcements
FOR ALL 
TO authenticated
USING (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid)
WITH CHECK (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid);

-- 為 leave_requests 表格創建廖俊雄的特殊政策
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong leave_requests" ON public.leave_requests;
CREATE POLICY "Enable all access for Liao Junxiong leave_requests" ON public.leave_requests
FOR ALL 
TO authenticated
USING (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid)
WITH CHECK (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid);

-- 為 check_in_records 表格創建廖俊雄的特殊政策
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong check_in_records" ON public.check_in_records;
CREATE POLICY "Enable all access for Liao Junxiong check_in_records" ON public.check_in_records
FOR ALL 
TO authenticated
USING (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid)
WITH CHECK (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid);

-- 為 notifications 表格創建廖俊雄的特殊政策
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong notifications" ON public.notifications;
CREATE POLICY "Enable all access for Liao Junxiong notifications" ON public.notifications
FOR ALL 
TO authenticated
USING (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid)
WITH CHECK (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid);

-- 為 annual_leave_balance 表格創建廖俊雄的特殊政策
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong annual_leave_balance" ON public.annual_leave_balance;
CREATE POLICY "Enable all access for Liao Junxiong annual_leave_balance" ON public.annual_leave_balance
FOR ALL 
TO authenticated
USING (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid)
WITH CHECK (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid);

-- 為 approval_records 表格創建廖俊雄的特殊政策
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong approval_records" ON public.approval_records;
CREATE POLICY "Enable all access for Liao Junxiong approval_records" ON public.approval_records
FOR ALL 
TO authenticated
USING (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid)
WITH CHECK (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid);

-- 為 announcement_reads 表格創建廖俊雄的特殊政策
DROP POLICY IF EXISTS "Enable all access for Liao Junxiong announcement_reads" ON public.announcement_reads;
CREATE POLICY "Enable all access for Liao Junxiong announcement_reads" ON public.announcement_reads
FOR ALL 
TO authenticated
USING (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid)
WITH CHECK (auth.uid() = '550e8400-e29b-41d4-a716-446655440001'::uuid);

-- 確保所有相關表格都啟用了 RLS
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.check_in_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annual_leave_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_reads ENABLE ROW LEVEL SECURITY;
