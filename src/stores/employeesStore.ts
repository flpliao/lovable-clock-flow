import { Employee } from '@/types/employee';
import { create } from 'zustand';

interface EmployeesState {
  employees: Employee[];
  isLoading: boolean;
  setEmployees: (employees: Employee[]) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (slug: string, employee: Employee) => void;
  removeEmployee: (slug: string) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const useEmployeesStore = create<EmployeesState>((set, get) => ({
  employees: [],
  isLoading: false,
  setEmployees: employees => set({ employees }),
  addEmployee: employee => {
    const { employees } = get();
    set({ employees: [...employees, employee] });
  },
  updateEmployee: (slug, updatedEmployee) => {
    const { employees } = get();
    set({
      employees: employees.map(emp => (emp.slug === slug ? updatedEmployee : emp)),
    });
  },
  removeEmployee: slug => {
    const { employees } = get();
    set({
      employees: employees.filter(emp => emp.slug !== slug),
    });
  },
  setLoading: isLoading => set({ isLoading }),
  reset: () => set({ employees: [], isLoading: false }),
}));

export default useEmployeesStore;
