import { apiRoutes } from '@/routes/api';
import { CheckInPoint } from '@/types/checkIn';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

// 取得所有打卡點
export const getNearbyCheckInPoints = async (
  latitude: number,
  longitude: number
): Promise<CheckInPoint[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.checkinPoint.index, {
      params: {
        latitude,
        longitude,
      },
    })
  );

  if (status === 'error') {
    return [];
  }

  return data as CheckInPoint[];
};

// 建立打卡點
export const createCheckInPoint = async (
  payload: Omit<CheckInPoint, 'id' | 'created_at'>
): Promise<CheckInPoint[]> => {
  const { data } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.checkinPoint.create, payload)
  );

  return data as CheckInPoint[];
};

// 更新打卡點
export const updateCheckInPoint = async (
  id: string,
  payload: Partial<CheckInPoint>
): Promise<CheckInPoint[]> => {
  const url = apiRoutes.checkinPoint.update(String(id));
  const { data } = await callApiAndDecode(axiosWithEmployeeAuth().put(url, payload));
  return data as CheckInPoint[];
};

// 刪除打卡點
export const deleteCheckInPoint = async (id: string): Promise<void> => {
  const url = apiRoutes.checkinPoint.delete(String(id));
  await callApiAndDecode(axiosWithEmployeeAuth().delete(url));
};
