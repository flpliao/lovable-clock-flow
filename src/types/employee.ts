import type { Department } from './department';
import type { WorkSchedule } from './workSchedule';

export interface Employee {
  slug: string;
  name: string;
  email: string;
  position?: string;
  department_id?: string;
  department?: Department;
  start_date?: string;
  roles?: string[];
  work_schedules?: WorkSchedule[];
}

export interface EmployeesBySlug {
  [employeeSlug: string]: Employee;
}

export interface EmployeeInfoProps {
  employee: Employee | null;
}
