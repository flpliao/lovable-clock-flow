
import { Department, NewDepartment } from '../types';
import { DepartmentFetchService } from './departmentFetchService';
import { DepartmentCreateService } from './departmentCreateService';
import { DepartmentUpdateService } from './departmentUpdateService';
import { DepartmentDeleteService } from './departmentDeleteService';

export class DepartmentService {
  static async getAllDepartments(): Promise<Department[]> {
    return DepartmentFetchService.getAllDepartments();
  }

  static async createDepartment(department: NewDepartment): Promise<Department | null> {
    return DepartmentCreateService.createDepartment(department);
  }

  static async updateDepartment(department: Department): Promise<Department | null> {
    return DepartmentUpdateService.updateDepartment(department);
  }

  static async deleteDepartment(id: string): Promise<boolean> {
    return DepartmentDeleteService.deleteDepartment(id);
  }
}
