// roleService: 提供職位相關 API 操作
import { ApiResponseStatus } from '@/constants/api';
import { apiRoutes } from '@/routes/api';
import { NewRole, Role } from '@/types/role';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

// 取得所有職位
export const getAllRoles = async (): Promise<Role[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.role.index)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入職位列表失敗: ${message}`);
  }

  return data as Role[];
};

// 取得職位列表（分頁）
export const getRoles = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
}): Promise<Role[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.role.index, { params })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入職位列表失敗: ${message}`);
  }

  return data as Role[];
};

// 取得單一職位
export const getRole = async (slug: string): Promise<Role> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.role.show(slug))
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入職位失敗: ${message}`);
  }

  return data as Role;
};

// 建立職位
export const createRole = async (roleData: Omit<NewRole, 'id'>): Promise<Role> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.role.store, roleData)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`建立職位失敗: ${message}`);
  }

  return data as Role;
};

// 更新職位
export const updateRole = async (
  slug: string,
  roleData: Partial<Omit<Role, 'id' | 'slug'>>
): Promise<Role> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.role.update(slug), roleData)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`更新職位失敗: ${message}`);
  }

  return data as Role;
};

// 刪除職位
export const deleteRole = async (slug: string): Promise<boolean> => {
  const { status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().delete(apiRoutes.role.destroy(slug))
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`刪除職位失敗: ${message}`);
  }

  return true;
};
