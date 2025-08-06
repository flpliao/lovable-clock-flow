import { apiRoutes } from '@/routes/api';
import { ApiResponseStatus } from '@/types/api';
import { Employee } from '@/types/employee';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

// 取得所有員工
export const getAllEmployees = async (): Promise<Employee[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.employees.all)
  );
  return status === ApiResponseStatus.SUCCESS ? (data as Employee[]) : [];
};

// 取得員工列表（分頁）
export const getEmployees = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  department?: string;
}): Promise<Employee[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.employees.index, { params })
  );
  return status === ApiResponseStatus.SUCCESS ? (data as Employee[]) : [];
};

// 取得單一員工
export const getEmployee = async (slug: string): Promise<Employee | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.employees.show(slug))
  );
  return status === ApiResponseStatus.SUCCESS ? (data as Employee) : null;
};

// 建立員工
export const createEmployee = async (
  employeeData: Omit<Employee, 'slug'>
): Promise<Employee | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.employees.store, employeeData)
  );
  return status === ApiResponseStatus.SUCCESS ? (data as Employee) : null;
};

// 更新員工
export const updateEmployee = async (
  slug: string,
  employeeData: Partial<Omit<Employee, 'slug'>>
): Promise<Employee | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.employees.update(slug), employeeData)
  );
  return status === ApiResponseStatus.SUCCESS ? (data as Employee) : null;
};

// 刪除員工
export const deleteEmployee = async (slug: string): Promise<boolean> => {
  const { status } = await callApiAndDecode(
    axiosWithEmployeeAuth().delete(apiRoutes.employees.destroy(slug))
  );
  return status === ApiResponseStatus.SUCCESS;
};
