import { Employee } from '@/types/employee';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface EmployeeStore {
  employee: Employee | null;
  token: string | null;
  isAuthenticated: boolean;
  setEmployee: (employee: Employee, token: string, isAuthenticated?: boolean) => void;
  setEmail: (email: string) => void;
  reset: () => void;
}

const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      employee: null,
      token: null,
      isAuthenticated: false,
      setEmployee: (employee, token, isAuthenticated = true) =>
        set({ employee, token, isAuthenticated }),
      setEmail: (email: string) => {
        const { employee } = get();
        if (employee) {
          set({ employee: { ...employee, email } });
        }
      },
      reset: () => set({ employee: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'employee-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useEmployeeStore;
