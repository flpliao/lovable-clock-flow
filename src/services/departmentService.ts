import { ApiResponseStatus } from '@/constants/api';
import { apiRoutes } from '@/routes/api';
import { Department } from '@/types/department';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

export class DepartmentService {
  // 獲取所有部門
  static async getAllDepartments(): Promise<Department[]> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().get(apiRoutes.department.index)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(message);
    }

    return data as Department[];
  }

  // 根據 slug 獲取部門
  static async getDepartmentBySlug(slug: string): Promise<Department | null> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().get(apiRoutes.department.show(slug))
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(message);
    }

    return data as Department;
  }

  // 創建新部門
  static async createDepartment(
    departmentData: Omit<Department, 'id' | 'slug' | 'created_at' | 'updated_at'>
  ): Promise<Department | null> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().post(apiRoutes.department.store, departmentData)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(message);
    }

    return data as Department;
  }

  // 更新部門
  static async updateDepartment(
    slug: string,
    departmentData: Partial<Department>
  ): Promise<Department | null> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().put(apiRoutes.department.update(slug), departmentData)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(message);
    }

    return data as Department;
  }

  // 刪除部門
  static async deleteDepartment(slug: string): Promise<boolean> {
    const { status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().delete(apiRoutes.department.destroy(slug))
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(message);
    }

    return true;
  }
}
