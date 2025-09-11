import { ApiResponseStatus } from '@/constants/api';
import { apiRoutes } from '@/routes/api';
import { Salary, SalaryMonth, SalaryStatistics } from '@/types/salary';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

// 獲取所有薪資記錄
export const getAllSalaries = async (): Promise<Salary[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.salary.getAll)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入薪資列表失敗: ${message}`);
  }

  return data as Salary[];
};

// 取得薪資列表（分頁）
export const getSalaries = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  period?: string;
}): Promise<Salary[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.salary.index, { params })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入薪資列表失敗: ${message}`);
  }

  return data as Salary[];
};

// 取得薪資統計資料
export const getSalaryStatistics = async (): Promise<SalaryStatistics> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.salary.statistics)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入薪資統計失敗: ${message}`);
  }

  return data as SalaryStatistics;
};

// 取得薪資月份列表
export const getSalaryMonths = async (): Promise<SalaryMonth[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.salary.getSalaryMonths)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入薪資月份失敗: ${message}`);
  }

  return data as SalaryMonth[];
};

// 取得特定月份的薪資記錄
export const getSalariesByMonth = async (month: string): Promise<Salary[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.salary.index, {
      params: { salary_month: month },
    })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入 ${month} 月份薪資記錄失敗: ${message}`);
  }

  return data as Salary[];
};

// 取得單一薪資記錄
export const getSalary = async (slug: string): Promise<Salary> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.salary.show(slug))
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入薪資記錄失敗: ${message}`);
  }

  return data as Salary;
};

// 建立薪資記錄
export const createSalary = async (
  salaryData: Omit<Salary, 'slug' | 'created_at' | 'updated_at'>
): Promise<Salary> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.salary.store, salaryData)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`建立薪資記錄失敗: ${message}`);
  }

  return data as Salary;
};

// 更新薪資記錄
export const updateSalary = async (
  slug: string,
  salaryData: Partial<Omit<Salary, 'slug' | 'created_at' | 'updated_at'>>
): Promise<Salary> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.salary.update(slug), salaryData)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`更新薪資記錄失敗: ${message}`);
  }

  return data as Salary;
};

// 刪除薪資記錄
export const deleteSalary = async (slug: string): Promise<boolean> => {
  const { status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().delete(apiRoutes.salary.destroy(slug))
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`刪除薪資記錄失敗: ${message}`);
  }

  return true;
};

// 導出薪資資料
export const exportSalaries = async (params?: {
  format?: 'excel' | 'csv' | 'pdf';
  period?: string;
  status?: string;
}): Promise<{ download_url: string; file_name: string; total_records: number }> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.salary.export, params)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`導出薪資資料失敗: ${message}`);
  }

  return data as { download_url: string; file_name: string; total_records: number };
};

// 導入薪資資料
export const importSalaries = async (
  file: File
): Promise<{
  data: Salary[];
  summary: { success_count: number; failed_count: number; errors: string[]; skip_count: number };
}> => {
  const formData = new FormData();
  formData.append('file', file);

  const { data, status, message, summary } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.salary.import, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`導入薪資資料失敗: ${message}`);
  }

  return { data, summary } as {
    data: Salary[];
    summary: { success_count: number; failed_count: number; errors: string[]; skip_count: number };
  };
};
