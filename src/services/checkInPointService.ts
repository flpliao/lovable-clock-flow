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
): Promise<CheckInPoint> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.checkinPoint.create, payload)
  );

  if (status === 'error') {
    return null;
  }

  return data as CheckInPoint;
};

// 更新打卡點
export const updateCheckInPoint = async (
  id: string,
  payload: Partial<CheckInPoint>
): Promise<CheckInPoint> => {
  const url = apiRoutes.checkinPoint.update(String(id));
  const { data, status } = await callApiAndDecode(axiosWithEmployeeAuth().put(url, payload));

  if (status === 'error') {
    return null;
  }

  return data as CheckInPoint;
};

// 刪除打卡點
export const deleteCheckInPoint = async (id: string): Promise<string> => {
  const url = apiRoutes.checkinPoint.delete(String(id));
  const { status } = await callApiAndDecode(axiosWithEmployeeAuth().delete(url));
  return status;
};
