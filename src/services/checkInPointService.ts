import { API_ROUTES } from '@/routes/constants';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

export interface CheckInPoint {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  check_in_radius: number;
  created_at: string;
  disabled_at: string | null;
  distance?: number;
}

// 取得所有打卡點
export const getNearbyCheckInPoints = async (
  latitude: number,
  longitude: number
): Promise<CheckInPoint[]> => {
  const data = await callApiAndDecode(
    axiosWithEmployeeAuth().get(API_ROUTES.CHECKIN_POINT.INDEX, {
      params: {
        latitude,
        longitude,
      },
    })
  );
  return data as CheckInPoint[];
};

// 新增打卡點
export const addCheckInPoint = async (
  payload: Omit<CheckInPoint, 'id' | 'created_at'>
): Promise<CheckInPoint[]> => {
  return await callApiAndDecode(
    axiosWithEmployeeAuth().post(API_ROUTES.CHECKIN_POINT.CREATE, payload)
  );
};

// 更新打卡點
export const updateCheckInPoint = async (
  id: number,
  payload: Partial<CheckInPoint>
): Promise<CheckInPoint[]> => {
  const url = API_ROUTES.CHECKIN_POINT.UPDATE.replace(':id', String(id));
  return await callApiAndDecode(axiosWithEmployeeAuth().put(url, payload));
};

// 刪除打卡點
export const deleteCheckInPoint = async (id: number): Promise<void> => {
  const url = API_ROUTES.CHECKIN_POINT.DELETE.replace(':id', String(id));
  await callApiAndDecode(axiosWithEmployeeAuth().delete(url));
};
