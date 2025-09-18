import { create } from 'zustand';

interface LeaveBalance {
  total: number; // 總時數 (max_hours_per_year)
  used: number; // 已使用時數 (used_hours)
  remaining: number; // 剩餘時數 (remaining_hours)
  year: number; // 年度
  employee_slug: string; // 員工 slug
  leave_code: string; // 假別代碼 (ANNUAL, SICK, PERSONAL 等)
  max_days_per_year: number; // 最大天數
  suggestion: string | null; // 建議
  seniority_years: number; // 年資
}

interface LeaveBalanceState {
  balances: LeaveBalance[];
  isLoading: boolean;
  error: string | null;

  // 基本操作
  addBalance: (balance: LeaveBalance) => void;

  // 載入狀態管理
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // 查詢方法
  getCurrentYearBalance: (employeeSlug: string) => LeaveBalance | undefined;
  getAllBalancesByEmployee: (employeeSlug: string) => LeaveBalance[];
  getBalanceByLeaveCode: (employeeSlug: string, leaveCode: string) => LeaveBalance | undefined;

  // 重置
  reset: () => void;
}

const useLeaveBalanceStore = create<LeaveBalanceState>()((set, get) => ({
  balances: [],
  isLoading: false,
  error: null,

  // 基本操作
  addBalance: (balance: LeaveBalance) => {
    const { balances } = get();
    // 檢查是否已存在相同員工、年度和假別類型的記錄
    const existingIndex = balances.findIndex(
      b =>
        b.employee_slug === balance.employee_slug &&
        b.year === balance.year &&
        b.leave_code === balance.leave_code
    );

    if (existingIndex >= 0) {
      // 更新現有記錄
      const updatedBalances = [...balances];
      updatedBalances[existingIndex] = balance;
      set({ balances: updatedBalances });
    } else {
      // 新增記錄
      set({ balances: [...balances, balance] });
    }
  },

  // 載入狀態管理
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),

  // 查詢方法
  getCurrentYearBalance: (employeeSlug: string) => {
    const { balances } = get();
    const currentYear = new Date().getFullYear();
    return balances.find(
      balance => balance.employee_slug === employeeSlug && balance.year === currentYear
    );
  },

  getAllBalancesByEmployee: (employeeSlug: string) => {
    const { balances } = get();
    return balances.filter(balance => balance.employee_slug === employeeSlug);
  },

  getBalanceByLeaveCode: (employeeSlug: string, leaveCode: string) => {
    const { balances } = get();
    const currentYear = new Date().getFullYear();
    return balances.find(
      balance =>
        balance.employee_slug === employeeSlug &&
        balance.year === currentYear &&
        balance.leave_code === leaveCode
    );
  },

  reset: () =>
    set({
      balances: [],
      isLoading: false,
      error: null,
    }),
}));

export default useLeaveBalanceStore;
