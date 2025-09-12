// checkInService: 提供打卡相關 API 操作
import { ApiResponseStatus } from '@/constants/api';
import { CheckInMethod, CheckInSource, RequestType } from '@/constants/checkInTypes';
import { apiRoutes } from '@/routes/api';
import { CheckInRecord, CreateCheckInPayload } from '@/types/checkIn';
import { MonthlyAttendanceResponse, AttendanceRecord } from '@/types/attendance';
import { WorkSchedule } from '@/types/workSchedule';
import { callApiAndDecode } from '@/utils/apiHelper';
import { axiosWithEmployeeAuth } from '@/utils/axiosWithEmployeeAuth';
import { getCurrentIp, getCurrentPosition } from '@/utils/location';
import useEmployeeStore from '@/stores/employeeStore';
import { useEmployeeWorkScheduleStore } from '@/stores/employeeWorkScheduleStore';
import dayjs from 'dayjs';

export interface CheckInParams {
  type: RequestType.CHECK_IN | RequestType.CHECK_OUT;
  method: CheckInMethod;
  selectedCheckpoint?: {
    latitude: number;
    longitude: number;
    check_in_radius: number;
    name: string;
  };
}

// 今日打卡記錄
export const getTodayCheckInRecords = async () => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(`${apiRoutes.checkin.index}`, {
      params: { created_at: dayjs().format('YYYY-MM-DD') },
    })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入打卡記錄失敗: ${message}`);
  }

  return splitCheckInRecords(data as CheckInRecord[]);
};

// 分組打卡記錄
export const splitCheckInRecords = (records: CheckInRecord[]) => {
  const checkIn = records.find(r => r.type === RequestType.CHECK_IN);
  const checkOut = records.find(r => r.type === RequestType.CHECK_OUT);
  return {
    [RequestType.CHECK_IN]: checkIn,
    [RequestType.CHECK_OUT]: checkOut,
  };
};

// 取得打卡記錄
export const getCheckInRecords = async (checked_at?: string): Promise<CheckInRecord[]> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().get(`${apiRoutes.checkin.index}`, {
      params: checked_at ? { checked_at } : {},
    })
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`載入打卡記錄失敗: ${message}`);
  }

  return data as CheckInRecord[];
};

// 建立打卡紀錄
export const createCheckInRecord = async (checkInData: CreateCheckInPayload) => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(`${apiRoutes.checkin.create}`, checkInData)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`建立打卡記錄失敗: ${message}`);
  }

  return data as CheckInRecord;
};

// 打卡
export const checkIn = async (checkInData: {
  latitude: number;
  longitude: number;
  type: 'in' | 'out';
}): Promise<CheckInRecord> => {
  const { data, status, message } = await callApiAndDecode(
    axiosWithEmployeeAuth().post(`${apiRoutes.checkin.create}`, checkInData)
  );

  if (status !== ApiResponseStatus.SUCCESS) {
    throw new Error(`打卡失敗: ${message}`);
  }

  return data as CheckInRecord;
};

// 統一的打卡記錄建立函數
export const createCheckInRecordByMethod = async (
  params: CheckInParams
): Promise<CheckInRecord> => {
  const { type, method, selectedCheckpoint } = params;

  if (method === CheckInMethod.LOCATION && !selectedCheckpoint) {
    throw new Error('請先選擇打卡地點');
  }

  const ip = await getCurrentIp();
  const { latitude, longitude } = await getCurrentPosition();

  const checkInData: CreateCheckInPayload = {
    type,
    source: CheckInSource.NORMAL,
    method,
    latitude,
    longitude,
    ip_address: ip,
  };

  return await createCheckInRecord(checkInData);
};

// IP 打卡
export const createIpCheckInRecord = async (
  type: RequestType.CHECK_IN | RequestType.CHECK_OUT
): Promise<CheckInRecord> => createCheckInRecordByMethod({ type, method: CheckInMethod.IP });

// 定位打卡
export const createLocationCheckInRecord = async (
  params: Omit<CheckInParams, 'method'> & {
    selectedCheckpoint: NonNullable<CheckInParams['selectedCheckpoint']>;
  }
): Promise<CheckInRecord> =>
  createCheckInRecordByMethod({
    ...params,
    method: CheckInMethod.LOCATION,
  });

// 轉換 WorkSchedule[] 為 checkInService 需要的格式
const convertWorkSchedulesToCheckInFormat = (
  workSchedules: WorkSchedule[]
): Record<
  string,
  {
    id: number;
    shift: {
      code: string;
      name: string;
      color: string;
    } | null;
    clock_in_time: string;
    clock_out_time: string;
  }
> => {
  const workSchedulesByDate: Record<
    string,
    {
      id: number;
      shift: {
        code: string;
        name: string;
        color: string;
      } | null;
      clock_in_time: string;
      clock_out_time: string;
    }
  > = {};

  workSchedules.forEach(workSchedule => {
    const date = workSchedule.pivot?.date;
    if (!date) return;

    workSchedulesByDate[date] = {
      id: parseInt(workSchedule.slug) || 0,
      shift: workSchedule.shift
        ? {
            code: workSchedule.shift.code || '',
            name: workSchedule.shift.name || '',
            color: workSchedule.shift.color || '#3B82F6',
          }
        : null,
      clock_in_time: workSchedule.pivot?.clock_in_time || workSchedule.clock_in_time,
      clock_out_time: workSchedule.pivot?.clock_out_time || workSchedule.clock_out_time,
    };
  });

  return workSchedulesByDate;
};

// 取得當前員工的排班資料
export const getCurrentEmployeeWorkSchedules = async (startDate: string, endDate: string) => {
  try {
    const { employee } = useEmployeeStore.getState();
    if (!employee?.slug) return {};

    // 使用原本的 getEmployeeWorkSchedules 函數
    const { getEmployeeWorkSchedules } = useEmployeeWorkScheduleStore.getState();
    const workSchedules = getEmployeeWorkSchedules(employee.slug);

    // 如果 Store 中沒有資料，則從 API 取得
    if (workSchedules.length === 0) {
      const { data } = await callApiAndDecode(
        axiosWithEmployeeAuth().get(apiRoutes.employeeWorkSchedule.index, {
          params: {
            slug: employee.slug,
            start_date: startDate,
            end_date: endDate,
          },
        })
      );

      if (!Array.isArray(data) || !data[0]?.work_schedules) return {};

      // 轉換 API 回傳的格式
      return convertWorkSchedulesToCheckInFormat(data[0].work_schedules);
    }

    // 轉換 Store 中的資料
    return convertWorkSchedulesToCheckInFormat(workSchedules);
  } catch (e) {
    console.warn('取得排班資料失敗:', e);
    return {};
  }
};

// 取得特定月出勤紀錄（月曆格式）
export const fetchMonthlyAttendance = async (
  year: number,
  month: number
): Promise<MonthlyAttendanceResponse> => {
  const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  const [checkInResponse, workSchedules] = await Promise.all([
    axiosWithEmployeeAuth().get(apiRoutes.checkin.index, {
      params: {
        all: true,
        start_date: startDate,
        end_date: endDate,
      },
    }),
    getCurrentEmployeeWorkSchedules(startDate, endDate),
  ]);

  const { data } = checkInResponse;
  const attendanceRecords: Record<string, AttendanceRecord> = {};
  console.log('workSchedules', workSchedules);
  // 初始化有排班的日期
  Object.entries(workSchedules).forEach(([date, schedule]) => {
    attendanceRecords[date] = {
      date,
      is_workday: true,
      work_schedule: schedule,
      attendance_status: 'normal',
      check_in_records: [],
      check_in_time: null,
      check_out_time: null,
      is_late: false,
      is_early_leave: false,
      work_hours: 0,
      overtime_hours: 0,
    };
  });
  // 處理打卡記錄
  if (data.data && Array.isArray(data.data)) {
    data.data.forEach((record: CheckInRecord) => {
      const recordDate = record.checked_at
        ? dayjs(record.checked_at).format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD');

      if (!attendanceRecords[recordDate]) {
        attendanceRecords[recordDate] = {
          date: recordDate,
          is_workday: false,
          work_schedule: null,
          attendance_status: 'off',
          check_in_records: [],
          check_in_time: null,
          check_out_time: null,
          is_late: false,
          is_early_leave: false,
          work_hours: 0,
          overtime_hours: 0,
        };
      }

      attendanceRecords[recordDate].check_in_records.push(record);

      if (record.type === RequestType.CHECK_IN) {
        attendanceRecords[recordDate].check_in_time = record.checked_at;
        attendanceRecords[recordDate].is_late = record.is_late || false;
      } else if (record.type === RequestType.CHECK_OUT) {
        attendanceRecords[recordDate].check_out_time = record.checked_at;
        attendanceRecords[recordDate].is_early_leave = record.is_early_leave || false;
      }
    });

    // 計算工時與加班時數
    Object.values(attendanceRecords).forEach(record => {
      const { check_in_time, check_out_time, work_schedule, date } = record;
      if (!check_in_time || !check_out_time) return;

      const checkIn = new Date(check_in_time);
      const checkOut = new Date(check_out_time);
      const workHours = (checkOut.getTime() - checkIn.getTime()) / 36e5; // 1000*60*60
      record.work_hours = Math.max(0, workHours);

      const standardHours = (() => {
        if (work_schedule) {
          const scheduleStart = new Date(`${date}T${work_schedule.clock_in_time}`);
          const scheduleEnd = new Date(`${date}T${work_schedule.clock_out_time}`);
          if (!isNaN(scheduleStart.getTime()) && !isNaN(scheduleEnd.getTime())) {
            return (scheduleEnd.getTime() - scheduleStart.getTime()) / 36e5;
          }
        }
        return 8; // 預設標準工時
      })();

      record.overtime_hours = Math.max(0, workHours - standardHours);
    });
  }

  return {
    year,
    month,
    attendance_records: attendanceRecords,
  };
};

// 取得員工打卡紀錄
export const fetchCheckInRecords = async (): Promise<CheckInRecord[]> => {
  const { data } = await axiosWithEmployeeAuth().get(apiRoutes.checkin.index);
  return data.data;
};
