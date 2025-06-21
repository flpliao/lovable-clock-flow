
import { StaffRole } from '../types';
import { ADMIN_ROLE } from './roles/adminRole';
import { HR_MANAGER_ROLE } from './roles/hrManagerRole';
import { DEPARTMENT_MANAGER_ROLE } from './roles/departmentManagerRole';
import { USER_ROLE } from './roles/userRole';

export const SYSTEM_ROLES: StaffRole[] = [
  ADMIN_ROLE,
  HR_MANAGER_ROLE,
  DEPARTMENT_MANAGER_ROLE,
  USER_ROLE
];
