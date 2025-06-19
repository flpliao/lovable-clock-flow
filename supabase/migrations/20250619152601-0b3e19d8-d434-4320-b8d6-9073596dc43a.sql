
-- 首先確保有一個預設公司
INSERT INTO public.companies (id, name, registration_number, legal_representative, business_type, address, phone, email) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440200'::uuid,
  '預設公司',
  '12345678',
  '廖俊雄',
  '資訊服務業',
  '台北市信義區信義路五段7號',
  '02-1234-5678',
  'info@company.com'
) ON CONFLICT (id) DO NOTHING;

-- 然後確保有一個預設分公司，使用有效的 company_id
INSERT INTO public.branches (id, company_id, code, name, type, address, phone, is_active, staff_count) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440100'::uuid,
  '550e8400-e29b-41d4-a716-446655440200'::uuid,
  'HQ001',
  '總公司',
  'headquarters',
  '台北市信義區信義路五段7號',
  '02-1234-5678',
  true,
  0
) ON CONFLICT (id) DO NOTHING;

-- 為 staff 表格添加密碼欄位（如果還沒有的話）
ALTER TABLE public.staff ADD COLUMN IF NOT EXISTS password TEXT;

-- 更新現有的測試用戶密碼，使用有效的 branch_id
-- 廖俊雄管理員
INSERT INTO public.staff (id, name, position, department, role, contact, branch_id, branch_name, email, password) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440001'::uuid,
  '廖俊雄',
  '最高管理者',
  '管理部',
  'admin',
  '0912345678',
  '550e8400-e29b-41d4-a716-446655440100'::uuid,
  '總公司',
  'liao.junxiong@company.com',
  'password123'
) ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  branch_id = EXCLUDED.branch_id;

-- 系統管理員
INSERT INTO public.staff (id, name, position, department, role, contact, branch_id, branch_name, email, password) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440002'::uuid,
  '系統管理員',
  '資深工程師',
  '技術部',
  'admin',
  '0987654321',
  '550e8400-e29b-41d4-a716-446655440100'::uuid,
  '總公司',
  'admin@example.com',
  'password'
) ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  branch_id = EXCLUDED.branch_id;

-- 廖小雄
INSERT INTO public.staff (id, name, position, department, role, contact, branch_id, branch_name, email, password) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440003'::uuid,
  '廖小雄',
  '一般員工',
  'HR',
  'user',
  '0923456789',
  '550e8400-e29b-41d4-a716-446655440100'::uuid,
  '總公司',
  'flpliao@gmail.com',
  'password'
) ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  branch_id = EXCLUDED.branch_id;

-- 鄭宇伶
INSERT INTO public.staff (id, name, position, department, role, contact, branch_id, branch_name, email, password) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440004'::uuid,
  '鄭宇伶',
  '一般員工',
  'HR',
  'user',
  '0989022719',
  '550e8400-e29b-41d4-a716-446655440100'::uuid,
  '總公司',
  'alinzheng55@gmail.com',
  '0989022719'
) ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  branch_id = EXCLUDED.branch_id;

-- 廖淑華
INSERT INTO public.staff (id, name, position, department, role, contact, branch_id, branch_name, email, password) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440005'::uuid,
  '廖淑華',
  '主管',
  '管理部',
  'manager',
  '0934567890',
  '550e8400-e29b-41d4-a716-446655440100'::uuid,
  '總公司',
  'lshuahua@company.com',
  'password123'
) ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  branch_id = EXCLUDED.branch_id;

-- test1 用戶
INSERT INTO public.staff (id, name, position, department, role, contact, branch_id, branch_name, email, password) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440006'::uuid,
  'test1',
  '最高管理者',
  '管理部',
  'admin',
  '0945678901',
  '550e8400-e29b-41d4-a716-446655440100'::uuid,
  '總公司',
  'liaoyuwii@yahoo.tw',
  '123456'
) ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  branch_id = EXCLUDED.branch_id;
