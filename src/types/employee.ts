import { Department } from './department';

export interface Employee {
  slug: string;
  name: string;
  email: string;
  position?: string;
  department_id?: string;
  department?: Department;
  start_date?: string;
  roles?: string[];
}

export interface EmployeeInfoProps {
  employee: Employee | null;
}
