// leaveTypeService: 提供請假類型相關 API 操作
import { apiRoutes } from '@/routes/api';
import { LeaveType } from '@/types/leaveType';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

// 獲取所有請假類型
export const getAllLeaveTypes = async (): Promise<LeaveType[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.leaveType.index)
  );

  if (status === 'error') {
    return [];
  }

  return data as LeaveType[];
};

// 建立請假類型
export const createLeaveType = async (
  leaveTypeData: Omit<LeaveType, 'slug'>
): Promise<LeaveType> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.leaveType.store, leaveTypeData)
  );

  if (status === 'error') {
    return null;
  }

  return data as LeaveType;
};

// 更新請假類型
export const updateLeaveType = async (
  slug: string,
  leaveTypeData: Partial<LeaveType>
): Promise<LeaveType> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.leaveType.update(slug), leaveTypeData)
  );

  if (status === 'error') {
    return null;
  }

  return data as LeaveType;
};

// 刪除請假類型
export const deleteLeaveType = async (slug: string): Promise<string> => {
  const { status } = await callApiAndDecode(
    axiosWithEmployeeAuth().delete(apiRoutes.leaveType.destroy(slug))
  );

  return status;
};
