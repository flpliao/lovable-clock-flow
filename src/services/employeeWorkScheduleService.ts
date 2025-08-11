import { apiRoutes } from '@/routes/api';
import { ApiResponseStatus } from '@/types/api';
import type { EmployeeWithWorkSchedules } from '@/types/employee';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

// 取得所有員工工作排程
export const getAllEmployeeWorkSchedules = async (): Promise<EmployeeWithWorkSchedules[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.employeeWorkSchedule.index)
  );
  return status === ApiResponseStatus.SUCCESS ? (data as EmployeeWithWorkSchedules[]) : [];
};

// 取得員工工作排程列表（分頁）
export const getEmployeeWithWorkSchedules = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  employee_id?: number;
  department_slug?: string;
  start_date?: string;
  end_date?: string;
}): Promise<EmployeeWithWorkSchedules[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.employeeWorkSchedule.index, { params })
  );
  return status === ApiResponseStatus.SUCCESS ? (data as EmployeeWithWorkSchedules[]) : [];
};

// 批量同步員工工作排程
export const bulkSyncEmployeeWorkSchedules = async (payload: {
  month: number;
  year: number;
  schedules: Array<{
    employee_slug: string;
    work_schedule_slug: string;
    date: string;
  }>;
}): Promise<unknown> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.employeeWorkSchedule.bulkSync, payload)
  );
  return status === ApiResponseStatus.SUCCESS ? (data as unknown) : null;
};
