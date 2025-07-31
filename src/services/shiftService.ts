import { apiRoutes } from '@/routes/api';
import { ApiResponseStatus } from '@/types/api';
import { Shift } from '@/types/shift';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

// 取得所有班次
export const getAllShifts = async (): Promise<Shift[]> => {
  const { data } = await callApiAndDecode(axiosWithEmployeeAuth().get(apiRoutes.shift.getAll));
  return data as Shift[];
};

// 取得班次列表（分頁）
export const getShifts = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
}): Promise<Shift[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.shift.index, { params })
  );
  return status === ApiResponseStatus.SUCCESS ? (data as Shift[]) : [];
};

// 取得單一班次
export const getShift = async (slug: string): Promise<Shift | null> => {
  const { data } = await callApiAndDecode(axiosWithEmployeeAuth().get(apiRoutes.shift.show(slug)));
  return status === ApiResponseStatus.SUCCESS ? (data as Shift) : null;
};

// 建立班次
export const createShift = async (
  shiftData: Omit<Shift, 'id' | 'slug' | 'created_at' | 'updated_at'>
): Promise<Shift | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.shift.store, shiftData)
  );
  return status === ApiResponseStatus.SUCCESS ? (data as Shift) : null;
};

// 更新班次
export const updateShift = async (
  slug: string,
  shiftData: Partial<Shift>
): Promise<Shift | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.shift.update(slug), shiftData)
  );
  return status === ApiResponseStatus.SUCCESS ? (data as Shift) : null;
};

// 刪除班次
export const deleteShift = async (slug: string): Promise<boolean> => {
  const { status } = await callApiAndDecode(
    axiosWithEmployeeAuth().delete(apiRoutes.shift.destroy(slug))
  );
  return status === ApiResponseStatus.SUCCESS;
};
