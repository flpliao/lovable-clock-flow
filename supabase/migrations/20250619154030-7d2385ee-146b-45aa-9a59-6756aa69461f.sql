
-- 首先移除相關的薪資核准記錄
DELETE FROM public.payroll_approvals 
WHERE approver_id IN (
  SELECT id FROM public.staff 
  WHERE branch_id = '550e8400-e29b-41d4-a716-446655440100'::uuid
);

-- 移除相關的薪資記錄
DELETE FROM public.payrolls 
WHERE staff_id IN (
  SELECT id FROM public.staff 
  WHERE branch_id = '550e8400-e29b-41d4-a716-446655440100'::uuid
) OR approved_by IN (
  SELECT id FROM public.staff 
  WHERE branch_id = '550e8400-e29b-41d4-a716-446655440100'::uuid
) OR paid_by IN (
  SELECT id FROM public.staff 
  WHERE branch_id = '550e8400-e29b-41d4-a716-446655440100'::uuid
);

-- 移除相關的薪資支付記錄
DELETE FROM public.payroll_payments 
WHERE paid_by IN (
  SELECT id FROM public.staff 
  WHERE branch_id = '550e8400-e29b-41d4-a716-446655440100'::uuid
);

-- 移除其他可能的相關記錄
DELETE FROM public.notifications 
WHERE user_id IN (
  SELECT id FROM public.staff 
  WHERE branch_id = '550e8400-e29b-41d4-a716-446655440100'::uuid
);

DELETE FROM public.check_in_records 
WHERE staff_id IN (
  SELECT id FROM public.staff 
  WHERE branch_id = '550e8400-e29b-41d4-a716-446655440100'::uuid
) OR user_id IN (
  SELECT id FROM public.staff 
  WHERE branch_id = '550e8400-e29b-41d4-a716-446655440100'::uuid
);

DELETE FROM public.leave_requests 
WHERE staff_id IN (
  SELECT id FROM public.staff 
  WHERE branch_id = '550e8400-e29b-41d4-a716-446655440100'::uuid
) OR user_id IN (
  SELECT id FROM public.staff 
  WHERE branch_id = '550e8400-e29b-41d4-a716-446655440100'::uuid
) OR current_approver IN (
  SELECT id FROM public.staff 
  WHERE branch_id = '550e8400-e29b-41d4-a716-446655440100'::uuid
);

DELETE FROM public.approval_records 
WHERE approver_id IN (
  SELECT id FROM public.staff 
  WHERE branch_id = '550e8400-e29b-41d4-a716-446655440100'::uuid
);

DELETE FROM public.schedules 
WHERE user_id IN (
  SELECT id FROM public.staff 
  WHERE branch_id = '550e8400-e29b-41d4-a716-446655440100'::uuid
) OR created_by IN (
  SELECT id FROM public.staff 
  WHERE branch_id = '550e8400-e29b-41d4-a716-446655440100'::uuid
);

-- 現在移除員工資料
DELETE FROM public.staff 
WHERE branch_id = '550e8400-e29b-41d4-a716-446655440100'::uuid;

-- 移除預設分公司
DELETE FROM public.branches 
WHERE id = '550e8400-e29b-41d4-a716-446655440100'::uuid;

-- 移除預設公司
DELETE FROM public.companies 
WHERE id = '550e8400-e29b-41d4-a716-446655440200'::uuid;
