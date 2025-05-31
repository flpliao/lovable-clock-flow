
export const mockPayrolls = [
  {
    id: '1',
    staff_name: '張小明',
    position: '軟體工程師',
    department: 'IT部',
    pay_period_start: '2024-01-01',
    pay_period_end: '2024-01-31',
    base_salary: 50000,
    overtime_pay: 5000,
    holiday_pay: 2000,
    allowances: 3000,
    gross_salary: 60000,
    tax: 3000,
    labor_insurance: 1000,
    health_insurance: 800,
    net_salary: 55200,
    status: 'calculated' as const
  },
  {
    id: '2',
    staff_name: '李小華',
    position: '業務經理',
    department: '業務部',
    pay_period_start: '2024-01-01',
    pay_period_end: '2024-01-31',
    base_salary: 60000,
    overtime_pay: 0,
    holiday_pay: 0,
    allowances: 5000,
    gross_salary: 65000,
    tax: 4000,
    labor_insurance: 1200,
    health_insurance: 1000,
    net_salary: 58800,
    status: 'approved' as const
  }
];
