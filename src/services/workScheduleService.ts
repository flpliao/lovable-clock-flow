import { ApiResponseStatus } from '@/constants/api';
import { apiRoutes } from '@/routes/api';
import { CreateWorkScheduleData, UpdateWorkScheduleData, WorkSchedule } from '@/types/workSchedule';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';
// 建立工作時程

export class WorkScheduleService {
  static async createWorkSchedule(workScheduleData: CreateWorkScheduleData): Promise<WorkSchedule> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().post(apiRoutes.workSchedule.store, workScheduleData)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`建立工作時程失敗: ${message}`);
    }

    return data as WorkSchedule;
  }

  // 更新工作時程
  static async updateWorkSchedule(
    slug: string,
    workScheduleData: UpdateWorkScheduleData
  ): Promise<WorkSchedule> {
    const { data, status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().put(apiRoutes.workSchedule.update(slug), workScheduleData)
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`更新工作時程失敗: ${message}`);
    }

    return data as WorkSchedule;
  }

  // 刪除工作時程
  static async deleteWorkSchedule(slug: string): Promise<boolean> {
    const { status, message } = await callApiAndDecode(
      axiosWithEmployeeAuth().delete(apiRoutes.workSchedule.destroy(slug))
    );

    if (status !== ApiResponseStatus.SUCCESS) {
      throw new Error(`刪除工作時程失敗: ${message}`);
    }

    return true;
  }
}
