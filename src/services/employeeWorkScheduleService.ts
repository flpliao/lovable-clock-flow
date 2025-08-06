import { apiRoutes } from '@/routes/api';
import { ApiResponseStatus } from '@/types/api';
import { EmployeeWorkSchedule } from '@/types/employeeWorkSchedule';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

// 取得所有員工工作排程
export const getAllEmployeeWorkSchedules = async (): Promise<EmployeeWorkSchedule[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.employeeWorkSchedule.index)
  );
  return status === ApiResponseStatus.SUCCESS ? (data as EmployeeWorkSchedule[]) : [];
};

// 取得員工工作排程列表（分頁）
export const getEmployeeWorkSchedules = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  employee_id?: number;
  date?: string;
}): Promise<EmployeeWorkSchedule[]> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.employeeWorkSchedule.index, { params })
  );
  return status === ApiResponseStatus.SUCCESS ? (data as EmployeeWorkSchedule[]) : [];
};

// 取得單一員工工作排程
export const getEmployeeWorkSchedule = async (
  employeeSlug: string
): Promise<EmployeeWorkSchedule | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.employeeWorkSchedule.show(employeeSlug))
  );
  return status === ApiResponseStatus.SUCCESS ? (data as EmployeeWorkSchedule) : null;
};

// 建立員工工作排程
export const createEmployeeWorkSchedule = async (
  employeeWorkScheduleData: Omit<EmployeeWorkSchedule, 'work_schedule_id'>
): Promise<EmployeeWorkSchedule | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.employeeWorkSchedule.store, employeeWorkScheduleData)
  );
  return status === ApiResponseStatus.SUCCESS ? (data as EmployeeWorkSchedule) : null;
};

// 批量建立員工工作排程
export const bulkCreateEmployeeWorkSchedules = async (
  employeeWorkSchedulesData: Omit<EmployeeWorkSchedule, 'work_schedule_id'>[]
): Promise<EmployeeWorkSchedule[] | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(
      apiRoutes.employeeWorkSchedule.bulkStore,
      employeeWorkSchedulesData
    )
  );
  return status === ApiResponseStatus.SUCCESS ? (data as EmployeeWorkSchedule[]) : null;
};

// 更新員工工作排程
export const updateEmployeeWorkSchedule = async (
  employeeSlug: string,
  employeeWorkScheduleData: Partial<Omit<EmployeeWorkSchedule, 'work_schedule_id'>>
): Promise<EmployeeWorkSchedule | null> => {
  const { data, status } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(
      apiRoutes.employeeWorkSchedule.update(employeeSlug),
      employeeWorkScheduleData
    )
  );
  return status === ApiResponseStatus.SUCCESS ? (data as EmployeeWorkSchedule) : null;
};

// 刪除員工工作排程
export const deleteEmployeeWorkSchedule = async (employeeSlug: string): Promise<boolean> => {
  const { status } = await callApiAndDecode(
    axiosWithEmployeeAuth().delete(apiRoutes.employeeWorkSchedule.destroy(employeeSlug))
  );
  return status === ApiResponseStatus.SUCCESS;
};
