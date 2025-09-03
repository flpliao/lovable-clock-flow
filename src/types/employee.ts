import { Gender } from '@/constants/gender';
import type { Department } from './department';
import type { WorkSchedule } from './workSchedule';

export interface Employee {
  slug: string;
  name: string;
  no: string;
  email: string;
  department_id?: string;
  department?: Department;
  start_date?: string;
  roles?: string[];
  work_schedules?: WorkSchedule[];
  identity_number?: string;
  phone?: string;
  position?: string;
  birth_date?: string;
  emergency_contact_person?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  gender: Gender;
  city?: string;
  address?: string;
}

export interface EmployeesBySlug {
  [employeeSlug: string]: Employee;
}

export interface EmployeeInfoProps {
  employee: Employee | null;
}
