import { Employee } from '@/types/employee';
import { create } from 'zustand';

interface EmployeesState {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
  setEmployees: (employees: Employee[]) => void;
  addEmployee: (employee: Employee) => void;
  setEmployee: (slug: string, employeeData: Partial<Employee>) => void;
  removeEmployee: (slug: string) => void;
  getEmployeeBySlug: (slug: string) => Employee | undefined;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useEmployeesStore = create<EmployeesState>()((set, get) => ({
  employees: [],
  isLoading: false,
  error: null,

  setEmployees: (employees: Employee[]) => set({ employees, error: null }),

  addEmployee: (employee: Employee) => {
    const { employees } = get();
    set({ employees: [employee, ...employees], error: null });
  },

  setEmployee: (slug: string, employeeData: Partial<Employee>) => {
    const { employees } = get();
    const updatedEmployees = employees.map(employee =>
      employee.slug === slug ? { ...employee, ...employeeData } : employee
    );
    set({ employees: updatedEmployees, error: null });
  },

  removeEmployee: (slug: string) => {
    const { employees } = get();
    const filteredEmployees = employees.filter(employee => employee.slug !== slug);
    set({ employees: filteredEmployees, error: null });
  },

  getEmployeeBySlug: (slug: string) => {
    const { employees } = get();
    return employees.find(employee => employee.slug === slug);
  },

  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}));
