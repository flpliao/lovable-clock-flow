import { Gender } from '@/constants/gender';
import type { Department } from './department';
import type { Role } from './role';
import type { WorkSchedule } from './workSchedule';

export interface Employee {
  slug: string;
  name: string;
  no: string;
  email: string;
  department_slug?: string;
  department?: Department;
  departments?: Department[];
  role_name?: string;
  role?: Role;
  direct_manager_slug?: string;
  direct_manager?: Employee;
  start_date?: string;
  roles?: Role[];
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
  password?: string;
  password_confirmation?: string;
}

export interface EmployeesBySlug {
  [employeeSlug: string]: Employee;
}

export interface EmployeeInfoProps {
  employee: Employee | null;
}
