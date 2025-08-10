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

// 為了向後相容，建立別名
export type EmployeeWithWorkSchedules = Employee;

export interface EmployeesBySlug {
  [employeeSlug: string]: Employee;
}

export interface EmployeeInfoProps {
  employee: Employee | null;
}
