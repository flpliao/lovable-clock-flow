import { ApiResponseStatus } from '@/constants/api';
import { apiRoutes } from '@/routes/api';
import { CreateWorkScheduleData, UpdateWorkScheduleData, WorkSchedule } from '@/types/workSchedule';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';
// 建立工作時程
export const createWorkSchedule = async (
  workScheduleData: CreateWorkScheduleData
): Promise<WorkSchedule | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.workSchedule.store, workScheduleData)
  );
  return status === ApiResponseStatus.SUCCESS ? (data as WorkSchedule) : null;
};

// 更新工作時程
export const updateWorkSchedule = async (
  slug: string,
  workScheduleData: UpdateWorkScheduleData
): Promise<WorkSchedule | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.workSchedule.update(slug), workScheduleData)
  );
  return status === ApiResponseStatus.SUCCESS ? (data as WorkSchedule) : null;
};

// 刪除工作時程
export const deleteWorkSchedule = async (slug: string): Promise<boolean> => {
  const { status } = await callApiAndDecode(
    axiosWithEmployeeAuth().delete(apiRoutes.workSchedule.destroy(slug))
  );
  return status === ApiResponseStatus.SUCCESS;
};
