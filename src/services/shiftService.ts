import { ApiResponseStatus } from '@/constants/api';
import { apiRoutes } from '@/routes/api';
import { Shift } from '@/types/shift';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

// 取得所有班次
export const getAllShifts = async (): Promise<Shift[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.shift.getAll)
  );

  const shifts = (data as Shift[]).map(shift => ({
    ...shift,
    cycle_days: shift.work_schedules?.length ?? 0,
  }));

  return status === ApiResponseStatus.SUCCESS ? shifts : [];
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
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.shift.show(slug))
  );
  return status === ApiResponseStatus.SUCCESS ? (data as Shift) : null;
};

// 建立班次
export const createShift = async (shiftData: Omit<Shift, 'slug'>): Promise<Shift | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.shift.store, shiftData)
  );
  return status === ApiResponseStatus.SUCCESS ? (data as Shift) : null;
};

// 更新班次
export const updateShift = async (
  slug: string,
  shiftData: Partial<Omit<Shift, 'slug'>>
): Promise<Shift | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.shift.update(slug), shiftData)
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
