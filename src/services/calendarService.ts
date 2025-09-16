import { ApiResponseStatus } from '@/constants/api';
import { apiRoutes } from '@/routes/api';
import { CalendarDayItem, CalendarIndexParams, CalendarItem } from '@/types/calendar';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';

// 行事曆列表（支援 filter.year/name 與 all=true 回傳全部）
export async function getCalendars(params?: CalendarIndexParams): Promise<{
  items: CalendarItem[];
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}> {
  const result = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.calendar.index, { params })
  );
  const { data, status, message } = result;

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入行事曆失敗: ${message}`);
  }

  // 後端可能回傳分頁或完整陣列，統一包裝
  if (Array.isArray(data)) {
    return { items: data as CalendarItem[] };
  }

  const payload = data as {
    data?: CalendarItem[];
    items?: CalendarItem[];
    current_page?: number;
    last_page?: number;
    per_page?: number;
    total?: number;
    from?: number;
    to?: number;
  };

  const items = payload?.data || payload?.items || [];
  const pagination = payload.current_page
    ? {
        current_page: payload.current_page,
        last_page: payload.last_page || 1,
        per_page: payload.per_page || 10,
        total: payload.total || 0,
        from: payload.from || 0,
        to: payload.to || 0,
      }
    : undefined;

  return { items, pagination };
}

export async function getCalendar(slug: string): Promise<CalendarItem> {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(apiRoutes.calendar.show(slug))
  );
  if (status !== ApiResponseStatus.SUCCESS) throw new Error(message || '取得行事曆失敗');
  return data as CalendarItem;
}

export async function createCalendar(payload: {
  year: number;
  name: string;
  description?: string | null;
}): Promise<CalendarItem> {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.calendar.store, payload)
  );
  if (status !== ApiResponseStatus.SUCCESS) throw new Error(message || '建立行事曆失敗');
  return data as CalendarItem;
}

export async function updateCalendar(
  slug: string,
  payload: Partial<{
    year: number;
    name: string;
    description?: string | null;
  }>
): Promise<CalendarItem> {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().put(apiRoutes.calendar.update(slug), payload)
  );
  if (status !== ApiResponseStatus.SUCCESS) throw new Error(message || '更新行事曆失敗');
  return data as CalendarItem;
}

export async function deleteCalendar(slug: string): Promise<void> {
  const { status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().delete(apiRoutes.calendar.destroy(slug))
  );
  if (status !== ApiResponseStatus.SUCCESS) throw new Error(message || '刪除行事曆失敗');
}

export async function copyCalendarToYear(slug: string, newYear: number): Promise<CalendarItem> {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.calendar.copyToYear(slug), { new_year: newYear })
  );
  if (status !== ApiResponseStatus.SUCCESS) throw new Error(message || '複製行事曆失敗');
  return data as CalendarItem;
}

// === Calendar Day APIs ===

export async function getCalendarDays(
  calendarSlug: string,
  params?: { month?: number; year?: number }
) {
  // 若帶 month/year，呼叫月份端點；否則用 index 取全部
  const hasMonth = params?.month && params?.year;
  const url = hasMonth
    ? apiRoutes.calendarDay.getMonthDays(calendarSlug)
    : apiRoutes.calendarDay.index(calendarSlug);
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(url, { params })
  );
  if (status !== ApiResponseStatus.SUCCESS) throw new Error(message || '取得行事曆日期失敗');
  return data as CalendarDayItem[];
}

export async function batchUpdateCalendarDays(
  calendarSlug: string,
  payload: { updates: CalendarDayItem[] }
): Promise<{ updated_count: number; created_count: number; total_processed: number }> {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.calendarDay.batchUpdate(calendarSlug), payload)
  );
  if (status !== ApiResponseStatus.SUCCESS) throw new Error(message || '批次更新日期失敗');
  return data as { updated_count: number; created_count: number; total_processed: number };
}

// 新增：批次儲存當月資料（包含新增holiday和刪除workday）
export async function saveMonthDays(
  calendarSlug: string,
  monthData: Record<string, CalendarDayItem>,
  yearMonth: string // "2025-09" 格式
): Promise<{ message: string; stats: { updated: number; created: number; deleted: number } }> {
  // 1. 先取得當月現有的所有資料
  const [year, month] = yearMonth.split('-');
  const existingDays = await getCalendarDays(calendarSlug, {
    year: parseInt(year),
    month: parseInt(month),
  });

  // 2. 準備要新增/更新的 holiday 資料
  const holidaysToSave = Object.values(monthData).filter(
    d => d.date.startsWith(yearMonth) && d.type === 'holiday'
  );

  // 3. 找出需要刪除的資料（原本是holiday，現在不在monthData中或變成workday）
  const datesToDelete: string[] = [];
  for (const existing of existingDays) {
    const key = existing.date;
    const current = monthData[key];
    // 如果原本存在但現在不在map中，或者現在是workday，則需要刪除
    if (!current || current.type === 'workday') {
      datesToDelete.push(existing.slug!);
    }
  }

  // 4. 執行批次操作
  const results: { updated: number; created: number; deleted: number } = {
    updated: 0,
    created: 0,
    deleted: 0,
  };

  // 批次新增/更新 holidays
  if (holidaysToSave.length > 0) {
    const updateResult = await batchUpdateCalendarDays(calendarSlug, { updates: holidaysToSave });
    results.updated = updateResult.updated_count;
    results.created = updateResult.created_count;
  }

  // 批次刪除 workdays（需要逐一刪除，因為後端沒有批次刪除API）
  for (const slug of datesToDelete) {
    try {
      await axiosWithEmployeeAuth().delete(apiRoutes.calendarDay.destroy(calendarSlug, slug));
      results.deleted++;
    } catch (e) {
      console.warn('刪除日期失敗:', slug, e);
    }
  }

  return {
    message: `成功處理：新增${results.created}筆，更新${results.updated}筆，刪除${results.deleted}筆`,
    stats: results,
  };
}

export async function generateYearDays(
  calendarSlug: string,
  payload: { year: number }
): Promise<{ count: number } | unknown> {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(apiRoutes.calendarDay.generateYear(calendarSlug), payload)
  );
  if (status !== ApiResponseStatus.SUCCESS) throw new Error(message || '生成全年日期失敗');
  return data as { count: number } | unknown;
}

export async function clearAllDays(calendarSlug: string): Promise<void> {
  const { status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().delete(apiRoutes.calendarDay.clearAll(calendarSlug))
  );
  if (status !== ApiResponseStatus.SUCCESS) throw new Error(message || '清除行事曆日期失敗');
}
