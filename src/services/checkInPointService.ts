import { apiRoutes } from '@/routes/api';
import { ApiResponseStatus } from '@/types/api';
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

  return status === ApiResponseStatus.SUCCESS ? (data as CheckInPoint[]) : [];
};

// 建立打卡點
export const createCheckInPoint = async (
  payload: Omit<CheckInPoint, 'id' | 'created_at'>
): Promise<CheckInPoint> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.checkinPoint.create, payload)
  );

  return status === ApiResponseStatus.SUCCESS ? (data as CheckInPoint) : null;
};

// 更新打卡點
export const updateCheckInPoint = async (
  id: string,
  payload: Partial<CheckInPoint>
): Promise<CheckInPoint> => {
  const url = apiRoutes.checkinPoint.update(String(id));
  const { data, status } = await callApiAndDecode(axiosWithEmployeeAuth().put(url, payload));

  return status === ApiResponseStatus.SUCCESS ? (data as CheckInPoint) : null;
};

// 刪除打卡點
export const deleteCheckInPoint = async (id: string): Promise<boolean> => {
  const url = apiRoutes.checkinPoint.delete(String(id));
  const { status } = await callApiAndDecode(axiosWithEmployeeAuth().delete(url));
  return status === ApiResponseStatus.SUCCESS;
};
