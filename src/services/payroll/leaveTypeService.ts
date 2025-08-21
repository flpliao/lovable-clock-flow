import { ApiResponseStatus } from '@/constants/api';
import { PaidType, LeaveTypeCode } from '@/constants/leave';
import { apiRoutes } from '@/routes/api';
import type { LeaveType as ApiLeaveType } from '@/types/leaveType';
import type { LeaveType as ManagementLeaveType } from '@/types/hr';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

// 擴展 ManagementLeaveType 以包含 code 屬性的正確類型
interface ExtendedManagementLeaveType extends Omit<ManagementLeaveType, 'code'> {
  code: string;
}

// 將 API 的請假類型轉為管理頁面現有結構（維持 UI 相容）
function mapApiToManagement(leaveType: ApiLeaveType): ExtendedManagementLeaveType {
  return {
    id: leaveType.slug, // 以 slug 當作唯一識別
    code: leaveType.code,
    name_zh: leaveType.name,
    name_en: leaveType.name,
    is_paid: leaveType.paid_type !== PaidType.UNPAID,
    annual_reset: leaveType.annual_reset ?? true,
    max_days_per_year: leaveType.max_per_year,
    requires_attachment: leaveType.required_attachment ?? false,
    is_system_default: false,
    is_active: true,
    sort_order: 0,
    description: leaveType.description,
    created_at: leaveType.created_at ?? new Date().toISOString(),
    updated_at: leaveType.updated_at ?? new Date().toISOString(),
  };
}

// 將管理頁面表單資料轉為 API 的資料結構
function mapManagementToApi(payload: Partial<ExtendedManagementLeaveType>): Partial<ApiLeaveType> {
  const result: Partial<ApiLeaveType> = {};

  if (payload.code !== undefined) result.code = payload.code as LeaveTypeCode;
  // 後端目前僅有單一 name 欄位，沿用中文名稱
  if (payload.name_zh !== undefined || payload.name_en !== undefined) {
    result.name = payload.name_zh ?? payload.name_en ?? '';
  }
  if (payload.is_paid !== undefined) {
    result.paid_type = payload.is_paid ? PaidType.PAID : PaidType.UNPAID;
  }
  if (payload.annual_reset !== undefined) result.annual_reset = payload.annual_reset;
  if (payload.max_days_per_year !== undefined)
    result.max_per_year = payload.max_days_per_year ?? undefined;
  if (payload.requires_attachment !== undefined)
    result.required_attachment = payload.requires_attachment;
  if (payload.description !== undefined) result.description = payload.description ?? '';

  return result;
}

export class LeaveTypeService {
  // 請假類型相關操作（改為呼叫後端 API）
  static async getLeaveTypes(): Promise<ExtendedManagementLeaveType[]> {
    const { data, status } = await callApiAndDecode(
      axiosWithEmployeeAuth().get(apiRoutes.leaveType.index)
    );

    if (status !== ApiResponseStatus.SUCCESS) return [];
    return (data as ApiLeaveType[]).map(mapApiToManagement);
  }

  static async getActiveLeaveTypes(): Promise<ExtendedManagementLeaveType[]> {
    // 目前後端未提供 is_active 欄位，此處先回傳全部
    return await this.getLeaveTypes();
  }

  static async createLeaveType(
    leaveTypeData: Partial<ExtendedManagementLeaveType>
  ): Promise<ExtendedManagementLeaveType> {
    const apiPayload = mapManagementToApi(leaveTypeData);
    const { data, status } = await callApiAndDecode(
      axiosWithEmployeeAuth().post(apiRoutes.leaveType.store, apiPayload)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error('創建請假類型失敗');
    }
    return mapApiToManagement(data as ApiLeaveType);
  }

  static async updateLeaveType(
    id: string,
    updates: Partial<ExtendedManagementLeaveType>
  ): Promise<ExtendedManagementLeaveType> {
    // id 以 slug 傳入
    const apiPayload = mapManagementToApi(updates);
    const { data, status } = await callApiAndDecode(
      axiosWithEmployeeAuth().put(apiRoutes.leaveType.update(id), apiPayload)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error('更新請假類型失敗');
    }
    return mapApiToManagement(data as ApiLeaveType);
  }

  static async deleteLeaveType(id: string): Promise<boolean> {
    // 直接交由後端驗證是否可刪除
    const { status } = await callApiAndDecode(
      axiosWithEmployeeAuth().delete(apiRoutes.leaveType.destroy(id))
    );

    return status === ApiResponseStatus.SUCCESS;
  }

  static async getLeaveTypeByCode(code: string): Promise<ExtendedManagementLeaveType | null> {
    const list = await this.getLeaveTypes();
    const found = list.find((x: ExtendedManagementLeaveType) => x.code === code && x.is_active);
    return found ?? null;
  }

  static async syncFromDefaults(): Promise<boolean> {
    const { status } = await callApiAndDecode(
      axiosWithEmployeeAuth().post(apiRoutes.leaveType.syncFromDefaults)
    );
    return status === ApiResponseStatus.SUCCESS;
  }
}
