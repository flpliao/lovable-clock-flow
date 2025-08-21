import { ApiResponseStatus } from '@/constants/api';
import { apiRoutes } from '@/routes/api';
import { Shift } from '@/types/shift';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

export class ShiftService {
  static async getAllShifts(): Promise<Shift[]> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().get(apiRoutes.shift.getAll)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`載入班次列表失敗: ${message}`);
    }

    const shifts = (data as Shift[]).map(shift => ({
      ...shift,
      cycle_days: shift.work_schedules?.length ?? 0,
    }));

    return shifts;
  }

  // 取得班次列表（分頁）
  static async getShifts(params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<Shift[]> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().get(apiRoutes.shift.index, { params })
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`載入班次列表失敗: ${message}`);
    }

    return data as Shift[];
  }

  // 取得單一班次
  static async getShift(slug: string): Promise<Shift> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().get(apiRoutes.shift.show(slug))
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`載入班次失敗: ${message}`);
    }

    return data as Shift;
  }

  // 建立班次
  static async createShift(shiftData: Omit<Shift, 'slug'>): Promise<Shift> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().post(apiRoutes.shift.store, shiftData)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`建立班次失敗: ${message}`);
    }

    return data as Shift;
  }

  // 更新班次
  static async updateShift(slug: string, shiftData: Partial<Omit<Shift, 'slug'>>): Promise<Shift> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().put(apiRoutes.shift.update(slug), shiftData)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`更新班次失敗: ${message}`);
    }

    return data as Shift;
  }

  // 刪除班次
  static async deleteShift(slug: string): Promise<boolean> {
    const { status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().delete(apiRoutes.shift.destroy(slug))
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`刪除班次失敗: ${message}`);
    }

    return true;
  }
}
