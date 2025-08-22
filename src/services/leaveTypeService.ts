// leaveTypeService: 提供請假類型相關 API 操作
import { ApiResponseStatus } from '@/constants/api';
import { apiRoutes } from '@/routes/api';
import { LeaveType } from '@/types/leaveType';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

// 獲取所有請假類型
export const getAllLeaveTypes = async (): Promise<LeaveType[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.leaveType.index)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入請假類型失敗: ${message}`);
  }

  // 為 UI 需要的欄位提供預設值
  return (data as LeaveType[]).map(item => ({
    ...item,
    is_active: item.is_active ?? true,
    is_system_default: item.is_system_default ?? false,
  }));
};

// 獲取有效的請假類型
export const getActiveLeaveTypes = async (): Promise<LeaveType[]> => {
  // 目前後端未提供 is_active 欄位，此處先回傳全部
  return await getAllLeaveTypes();
};

// 建立請假類型
export const createLeaveType = async (leaveTypeData: Partial<LeaveType>): Promise<LeaveType> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.leaveType.store, leaveTypeData)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`建立請假類型失敗: ${message}`);
  }

  const result = data as LeaveType;
  return {
    ...result,
    is_active: result.is_active ?? true,
    is_system_default: result.is_system_default ?? false,
  };
};

// 更新請假類型
export const updateLeaveType = async (
  id: string,
  updates: Partial<LeaveType>
): Promise<LeaveType> => {
  // id 以 slug 傳入
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.leaveType.update(id), updates)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`更新請假類型失敗: ${message}`);
  }

  const result = data as LeaveType;
  return {
    ...result,
    is_active: result.is_active ?? true,
    is_system_default: result.is_system_default ?? false,
  };
};

// 刪除請假類型
export const deleteLeaveType = async (id: string): Promise<boolean> => {
  // 直接交由後端驗證是否可刪除
  const { status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().delete(apiRoutes.leaveType.destroy(id))
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`刪除請假類型失敗: ${message}`);
  }

  return true;
};

// 根據代碼獲取請假類型
export const getLeaveTypeByCode = async (code: string): Promise<LeaveType | null> => {
  const list = await getAllLeaveTypes();
  const found = list.find((x: LeaveType) => x.code === code);
  return found ?? null;
};

// 同步系統預設假別
export const syncFromDefaults = async (): Promise<boolean> => {
  const { status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.leaveType.syncFromDefaults)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`同步系統預設假別失敗: ${message}`);
  }

  return true;
};
