import { apiRoutes } from '@/routes/api';
import { Department } from '@/types/department';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

// 獲取所有部門
export const getAllDepartments = async (): Promise<Department[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.department.index)
  );

  if (status === 'error') {
    return [];
  }

  return data as Department[];
};

// 根據 slug 獲取部門
export const getDepartmentBySlug = async (slug: string): Promise<Department | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.department.show(slug))
  );

  if (status === 'error') {
    return null;
  }

  return data as Department;
};

// 創建新部門
export const createDepartment = async (
  departmentData: Omit<Department, 'id' | 'slug' | 'created_at' | 'updated_at'>
): Promise<Department | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.department.store, departmentData)
  );

  if (status === 'error') {
    return null;
  }

  return data as Department;
};

// 更新部門
export const updateDepartment = async (
  slug: string,
  departmentData: Partial<Department>
): Promise<Department | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.department.update(slug), departmentData)
  );

  if (status === 'error') {
    return null;
  }

  return data as Department;
};

// 刪除部門
export const deleteDepartment = async (slug: string): Promise<boolean> => {
  const { status } = await callApiAndDecode(
    axiosWithEmployeeAuth().delete(apiRoutes.department.destroy(slug))
  );

  return status === 'success';
};
