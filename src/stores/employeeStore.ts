import { Employee } from '@/types/employee';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface EmployeeStore {
  employee: Employee | null;
  token: string | null;
  isAuthenticated: boolean;
  setEmployee: (employee: Employee, token: string, isAuthenticated?: boolean) => void;
  reset: () => void;
}

const useEmployeeStore = create<EmployeeStore>()(
  persist(
    set => ({
      employee: null,
      token: null,
      isAuthenticated: false,
      setEmployee: (employee, token, isAuthenticated = true) =>
        set({ employee, token, isAuthenticated }),
      reset: () => set({ employee: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'employee-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useEmployeeStore;
