import { ApiResponseStatus } from '@/constants/api';
import { apiRoutes } from '@/routes/api';
import { CheckInPoint } from '@/types/checkIn';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

export class CheckInPointService {
  // 取得所有打卡點
  static async getNearbyCheckInPoints(
    latitude: number,
    longitude: number
  ): Promise<CheckInPoint[]> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().get(apiRoutes.checkinPoint.index, {
        params: {
          latitude,
          longitude,
        },
      })
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`載入打卡點失敗: ${message}`);
    }

    return data as CheckInPoint[];
  }

  // 建立打卡點
  static async createCheckInPoint(
    payload: Omit<CheckInPoint, 'id' | 'created_at'>
  ): Promise<CheckInPoint> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().post(apiRoutes.checkinPoint.create, payload)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`建立打卡點失敗: ${message}`);
    }

    return data as CheckInPoint;
  }

  // 更新打卡點
  static async updateCheckInPoint(
    id: string,
    payload: Partial<CheckInPoint>
  ): Promise<CheckInPoint> {
    const url = apiRoutes.checkinPoint.update(String(id));
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().put(url, payload)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`更新打卡點失敗: ${message}`);
    }

    return data as CheckInPoint;
  }

  // 刪除打卡點
  static async deleteCheckInPoint(id: string): Promise<boolean> {
    const url = apiRoutes.checkinPoint.delete(String(id));
    const { status, message } = await callApiAndDecode(axiosWithEmployeeAuth().delete(url));

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`刪除打卡點失敗: ${message}`);
    }

    return true;
  }
}
