import { Department } from '@/types/department';
import { create } from 'zustand';

interface DepartmentState {
  departments: Department[];
  setDepartments: (departments: Department[]) => void;
  addDepartment: (department: Department) => void;
  updateDepartment: (departmentId: string, departmentData: Partial<Department>) => void;
  removeDepartment: (departmentId: string) => void;
  getDepartmentBySlug: (slug: string) => Department | undefined;
}

export const useDepartmentStore = create<DepartmentState>()((set, get) => ({
  departments: [],
  setDepartments: departments => set({ departments }),
  addDepartment: (department: Department) => {
    const { departments } = get();
    set({ departments: [department, ...departments] });
  },
  updateDepartment: (departmentId: string, departmentData: Partial<Department>) => {
    const { departments } = get();
    const updatedDepartments = departments.map(department =>
      department.id === departmentId ? { ...department, ...departmentData } : department
    );
    set({ departments: updatedDepartments });
  },
  removeDepartment: (departmentId: string) => {
    const { departments } = get();
    const filteredDepartments = departments.filter(department => department.id !== departmentId);
    set({ departments: filteredDepartments });
  },
  getDepartmentBySlug: (slug: string) => {
    const { departments } = get();
    return departments.find(department => department.slug === slug);
  },
}));
