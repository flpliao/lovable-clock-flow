
import { NewDepartment, Department } from '../types';

export class DepartmentValidationService {
  static validateNewDepartment(department: NewDepartment): string | null {
    if (!department.name.trim()) {
      return '部門名稱不能為空';
    }

    if (!department.type) {
      return '部門類型不能為空';
    }

    return null;
  }

  static validateDepartment(department: Department): string | null {
    if (!department.name.trim()) {
      return '部門名稱不能為空';
    }

    if (!department.type) {
      return '部門類型不能為空';
    }

    return null;
  }

  static prepareInsertData(department: NewDepartment) {
    return {
      name: department.name.trim(),
      type: department.type,
      location: department.location?.trim() || null,
      manager_name: department.manager_name?.trim() || null,
      manager_contact: department.manager_contact?.trim() || null,
      staff_count: 0
    };
  }

  static prepareUpdateData(department: Department) {
    return {
      name: department.name.trim(),
      type: department.type,
      location: department.location?.trim() || null,
      manager_name: department.manager_name?.trim() || null,
      manager_contact: department.manager_contact?.trim() || null,
      staff_count: department.staff_count || 0,
      updated_at: new Date().toISOString()
    };
  }
}
