import { ApiResponseStatus } from '@/constants/api';
import { apiRoutes } from '@/routes/api';
import { Employee } from '@/types/employee';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

// 取得所有員工
export const getAllEmployees = async (): Promise<Employee[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.employees.all)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入員工失敗: ${message}`);
  }

  return data as Employee[];
};

// 取得員工列表（分頁）
export const getEmployees = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  department_slug?: string;
}): Promise<Employee[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.employees.index, { params })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入員工失敗: ${message}`);
  }

  return data as Employee[];
};

// 取得單一員工
export const getEmployee = async (slug: string): Promise<Employee> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.employees.show(slug))
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入員工失敗: ${message}`);
  }

  return data as Employee;
};

// 建立員工
export const createEmployee = async (employeeData: Omit<Employee, 'slug'>): Promise<Employee> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.employees.store, employeeData)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`建立員工失敗: ${message}`);
  }

  return data as Employee;
};

// 更新員工
export const updateEmployee = async (
  slug: string,
  employeeData: Partial<Omit<Employee, 'slug'>>
): Promise<Employee> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.employees.update(slug), employeeData)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`更新員工失敗: ${message}`);
  }

  return data as Employee;
};

// 刪除員工
export const deleteEmployee = async (slug: string): Promise<boolean> => {
  const { status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().delete(apiRoutes.employees.destroy(slug))
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`刪除員工失敗: ${message}`);
  }

  return true;
};
