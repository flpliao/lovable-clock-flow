
export const getPayrollStatusText = (status: string): string => {
  const statuses: Record<string, string> = {
    'draft': '草稿',
    'calculated': '已計算',
    'approved': '已核准',
    'paid': '已發放'
  };
  return statuses[status] || '未知';
};

export const getPayrollStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'draft': 'bg-gray-100 text-gray-800',
    'calculated': 'bg-blue-100 text-blue-800',
    'approved': 'bg-green-100 text-green-800',
    'paid': 'bg-purple-100 text-purple-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD'
  }).format(amount);
};

export const calculateGrossSalary = (
  baseSalary: number,
  overtimePay: number = 0,
  holidayPay: number = 0,
  allowances: number = 0
): number => {
  return baseSalary + overtimePay + holidayPay + allowances;
};

export const calculateNetSalary = (
  grossSalary: number,
  tax: number = 0,
  laborInsurance: number = 0,
  healthInsurance: number = 0,
  deductions: number = 0
): number => {
  return grossSalary - tax - laborInsurance - healthInsurance - deductions;
};
