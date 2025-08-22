import { ApiResponseStatus } from '@/constants/api';
import { apiRoutes } from '@/routes/api';
import type { LeaveType } from '@/types/leaveType';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

export class LeaveTypeService {
  // 請假類型相關操作（直接使用後端 API）
  static async getLeaveTypes(): Promise<LeaveType[]> {
    const { data, status } = await callApiAndDecode(
      axiosWithEmployeeAuth().get(apiRoutes.leaveType.index)
    );

    if (status !== ApiResponseStatus.SUCCESS) return [];

    // 為 UI 需要的欄位提供預設值
    return (data as LeaveType[]).map(item => ({
      ...item,
      is_active: item.is_active ?? true,
      is_system_default: item.is_system_default ?? false,
    }));
  }

  static async getActiveLeaveTypes(): Promise<LeaveType[]> {
    // 目前後端未提供 is_active 欄位，此處先回傳全部
    return await this.getLeaveTypes();
  }

  static async createLeaveType(leaveTypeData: Partial<LeaveType>): Promise<LeaveType> {
    const { data, status } = await callApiAndDecode(
      axiosWithEmployeeAuth().post(apiRoutes.leaveType.store, leaveTypeData)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error('創建請假類型失敗');
    }

    const result = data as LeaveType;
    return {
      ...result,
      is_active: result.is_active ?? true,
      is_system_default: result.is_system_default ?? false,
    };
  }

  static async updateLeaveType(id: string, updates: Partial<LeaveType>): Promise<LeaveType> {
    // id 以 slug 傳入
    const { data, status } = await callApiAndDecode(
      axiosWithEmployeeAuth().put(apiRoutes.leaveType.update(id), updates)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error('更新請假類型失敗');
    }

    const result = data as LeaveType;
    return {
      ...result,
      is_active: result.is_active ?? true,
      is_system_default: result.is_system_default ?? false,
    };
  }

  static async deleteLeaveType(id: string): Promise<boolean> {
    // 直接交由後端驗證是否可刪除
    const { status } = await callApiAndDecode(
      axiosWithEmployeeAuth().delete(apiRoutes.leaveType.destroy(id))
    );

    return status === ApiResponseStatus.SUCCESS;
  }

  static async getLeaveTypeByCode(code: string): Promise<LeaveType | null> {
    const list = await this.getLeaveTypes();
    const found = list.find((x: LeaveType) => x.code === code);
    return found ?? null;
  }

  static async syncFromDefaults(): Promise<boolean> {
    const { status } = await callApiAndDecode(
      axiosWithEmployeeAuth().post(apiRoutes.leaveType.syncFromDefaults)
    );
    return status === ApiResponseStatus.SUCCESS;
  }
}
