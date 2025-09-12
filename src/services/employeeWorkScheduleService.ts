import { ApiResponseStatus } from '@/constants/api';
import { apiRoutes } from '@/routes/api';
import type { Employee } from '@/types/employee';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

// 取得所有員工工作排程
export const getAllEmployeeWorkSchedules = async (): Promise<Employee[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.employeeWorkSchedule.index)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入所有員工工作排程失敗: ${message}`);
  }

  return data as Employee[];
};

// 取得員工工作排程列表（分頁）
export const getEmployeeWithWorkSchedules = async ({
  page,
  per_page,
  search,
  slug,
  department_slug,
  start_date,
  end_date,
}: {
  page?: number;
  per_page?: number;
  search?: string;
  slug?: string;
  department_slug?: string;
  start_date?: string;
  end_date?: string;
}): Promise<Employee[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.employeeWorkSchedule.index, {
      params: { page, per_page, search, slug, department_slug, start_date, end_date },
    })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入員工工作排程失敗: ${message}`);
  }

  return data as Employee[];
};

// 批量同步員工工作排程
export const bulkSyncEmployeeWorkSchedules = async ({
  month,
  year,
  schedules,
}: {
  month: number;
  year: number;
  schedules: Array<{
    employee_slug: string;
    work_schedule_slug: string;
    date: string;
  }>;
}): Promise<unknown> => {
  const payload = { month, year, schedules };
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.employeeWorkSchedule.bulkSync, payload)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`批量同步員工工作排程失敗: ${message}`);
  }

  return data as unknown;
};
