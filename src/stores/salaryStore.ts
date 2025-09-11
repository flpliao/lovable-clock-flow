import { Salary, SalaryMonth } from '@/types/salary';
import { create } from 'zustand';

interface SalaryState {
  // 月份列表
  salaryMonths: SalaryMonth[];
  monthsLoading: boolean;
  monthsLoaded: boolean; // 是否已載入過月份列表

  // 特定月份的薪資記錄
  salaries: Salary[];
  salariesLoading: boolean;
  loadedMonths: Set<string>; // 已載入的月份集合

  // 月份相關操作
  setSalaryMonths: (months: SalaryMonth[]) => void;
  addSalaryMonths: (months: SalaryMonth[]) => void;
  setMonthsLoading: (loading: boolean) => void;
  setMonthsLoaded: (loaded: boolean) => void;

  // 薪資記錄相關操作
  setSalaries: (salaries: Salary[]) => void;
  addSalary: (salary: Salary) => void;
  addSalaries: (salaries: Salary[]) => void;
  updateSalary: (slug: string, salary: Salary) => void;
  removeSalary: (slug: string) => void;
  setSalariesLoading: (loading: boolean) => void;
  markMonthAsLoaded: (month: string | string[]) => void; // 標記月份為已載入（支援單筆或多筆）
  isMonthLoaded: (month: string) => boolean; // 檢查月份是否已載入

  // 重置
  reset: () => void;
}

const useSalaryStore = create<SalaryState>((set, get) => ({
  // 月份列表狀態
  salaryMonths: [],
  monthsLoading: false,
  monthsLoaded: false,

  // 薪資記錄狀態
  salaries: [],
  salariesLoading: false,
  loadedMonths: new Set<string>(), // 已載入的月份集合

  // 月份相關操作
  setSalaryMonths: months => set({ salaryMonths: months }),
  addSalaryMonths: months => {
    const { salaryMonths } = get();
    const combinedMonths = [...salaryMonths, ...months];
    // 按照月份排序（最新的月份在前面）
    const sortedMonths = combinedMonths.sort((a, b) => {
      // 比較 YYYY-MM 格式的月份字串
      return b.localeCompare(a);
    });
    set({ salaryMonths: sortedMonths });
  },
  setMonthsLoading: loading => set({ monthsLoading: loading }),
  setMonthsLoaded: loaded => set({ monthsLoaded: loaded }),

  // 薪資記錄相關操作
  setSalaries: salaries => set({ salaries }),
  addSalary: salary => {
    const { salaries } = get();
    set({ salaries: [...salaries, salary] });
  },
  addSalaries: data => {
    const { salaries } = get();
    set({ salaries: [...salaries, ...data] });
  },
  updateSalary: (slug, updatedSalary) => {
    const { salaries } = get();
    set({
      salaries: salaries.map(sal => (sal.slug === slug ? updatedSalary : sal)),
    });
  },
  removeSalary: slug => {
    const { salaries } = get();
    set({
      salaries: salaries.filter(sal => sal.slug !== slug),
    });
  },
  setSalariesLoading: loading => set({ salariesLoading: loading }),
  markMonthAsLoaded: month => {
    const { loadedMonths } = get();
    const monthsToAdd = Array.isArray(month) ? month : [month];
    set({ loadedMonths: new Set([...loadedMonths, ...monthsToAdd]) });
  },
  isMonthLoaded: month => {
    const { loadedMonths } = get();
    return loadedMonths.has(month);
  },

  // 重置
  reset: () =>
    set({
      salaryMonths: [],
      salaries: [],
      monthsLoading: false,
      salariesLoading: false,
      monthsLoaded: false,
      loadedMonths: new Set<string>(),
    }),
}));

export default useSalaryStore;
