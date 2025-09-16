import { Salary } from '@/types/salary';
import { create } from 'zustand';

interface PersonalSalaryState {
  // 薪資記錄狀態
  personalSalaries: Salary[];
  salariesLoading: boolean;

  // 薪資記錄相關操作
  setPersonalSalaries: (salaries: Salary[]) => void;
  setSalariesLoading: (loading: boolean) => void;

  // 重置狀態
  reset: () => void;
}

export const usePersonalSalaryStore = create<PersonalSalaryState>(set => ({
  // 薪資記錄狀態
  personalSalaries: [],
  salariesLoading: false,

  // 薪資記錄相關操作
  setPersonalSalaries: salaries => set({ personalSalaries: salaries }),
  setSalariesLoading: loading => set({ salariesLoading: loading }),

  // 重置狀態
  reset: () =>
    set({
      personalSalaries: [],
      salariesLoading: false,
    }),
}));
