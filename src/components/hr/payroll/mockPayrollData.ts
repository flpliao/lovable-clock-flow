
export const mockPayrolls = [
  {
    id: '1',
    staff_id: '550e8400-e29b-41d4-a716-446655440001',
    salary_structure_id: '660e8400-e29b-41d4-a716-446655440001',
    pay_period_start: '2024-01-01',
    pay_period_end: '2024-01-31',
    base_salary: 50000,
    overtime_hours: 10,
    overtime_pay: 5000,
    holiday_hours: 8,
    holiday_pay: 2000,
    allowances: 3000,
    deductions: 0,
    gross_salary: 60000,
    tax: 3000,
    labor_insurance: 1000,
    health_insurance: 800,
    net_salary: 55200,
    status: 'calculated' as const,
    calculated_at: '2024-01-31T10:00:00Z',
    created_at: '2024-01-01T09:00:00Z',
    updated_at: '2024-01-31T10:00:00Z'
  },
  {
    id: '2',
    staff_id: '550e8400-e29b-41d4-a716-446655440002',
    salary_structure_id: '660e8400-e29b-41d4-a716-446655440002',
    pay_period_start: '2024-01-01',
    pay_period_end: '2024-01-31',
    base_salary: 60000,
    overtime_hours: 0,
    overtime_pay: 0,
    holiday_hours: 0,
    holiday_pay: 0,
    allowances: 5000,
    deductions: 0,
    gross_salary: 65000,
    tax: 4000,
    labor_insurance: 1200,
    health_insurance: 1000,
    net_salary: 58800,
    status: 'approved' as const,
    calculated_at: '2024-01-31T10:00:00Z',
    approved_by: '550e8400-e29b-41d4-a716-446655440000',
    approval_date: '2024-02-01T09:00:00Z',
    created_at: '2024-01-01T09:00:00Z',
    updated_at: '2024-02-01T09:00:00Z'
  }
];

// Mock staff data to display names and departments
export const mockStaffData = {
  '550e8400-e29b-41d4-a716-446655440001': {
    name: '張小明',
    position: '軟體工程師',
    department: 'IT部'
  },
  '550e8400-e29b-41d4-a716-446655440002': {
    name: '李小華',
    position: '業務經理',
    department: '業務部'
  }
};
