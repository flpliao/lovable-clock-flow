import { RequestType } from '@/constants/checkInTypes';
import { getCheckInRecordsByDateRange } from '@/services/checkInService';
import { getEmployeeWithWorkSchedules } from '@/services/employeeWorkScheduleService';
import { useMyCheckInRecordsStore } from '@/stores/myCheckInRecordsStore';
import useEmployeeStore from '@/stores/employeeStore';
import { AttendanceRecord, MonthlyAttendanceResponse } from '@/types/attendance';
import { CheckInRecord } from '@/types/checkIn';
import { convertWorkSchedulesToDateMap } from '@/utils/workScheduleUtils';
import dayjs from 'dayjs';
import { useCallback, useMemo, useRef, useState } from 'react';

export const usePersonalAttendance = () => {
  const {
    monthlyLoading,
    monthlyError,
    setMonthlyData,
    getMonthlyData,
    getAttendanceForDate: storeGetAttendanceForDate,
    setMonthlyLoading,
    setMonthlyError,
  } = useMyCheckInRecordsStore();

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const monthlyLoadingRef = useRef(false);
  const today = useMemo(() => new Date(), []);

  // 判斷某日是否為異常狀態
  const isAbnormalRecord = useCallback((record: AttendanceRecord) => {
    const hasValidCheckIn = record.check_in_records.some(
      r =>
        r.status === 'success' &&
        r.type === 'check_in' &&
        (!r.approval_status || r.approval_status === 'approved')
    );
    const hasValidCheckOut = record.check_in_records.some(
      r =>
        r.status === 'success' &&
        r.type === 'check_out' &&
        (!r.approval_status || r.approval_status === 'approved')
    );
    return record.is_late || record.is_early_leave || !(hasValidCheckIn && hasValidCheckOut);
  }, []);

  // 取得特定月出勤紀錄（月曆格式）
  const fetchMonthlyAttendance = useCallback(
    async (year: number, month: number): Promise<MonthlyAttendanceResponse> => {
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = new Date(year, month, 0).toISOString().split('T')[0];

      const { employee } = useEmployeeStore.getState();
      if (!employee?.slug) {
        throw new Error('無法取得員工資訊');
      }

      const [checkInRecords, employees] = await Promise.all([
        getCheckInRecordsByDateRange(startDate, endDate),
        getEmployeeWithWorkSchedules({
          slug: employee.slug,
          start_date: startDate,
          end_date: endDate,
        }),
      ]);

      const workSchedules =
        employees.length > 0 && employees[0]?.work_schedules ? employees[0].work_schedules : [];

      const workSchedulesByDate = convertWorkSchedulesToDateMap(workSchedules);
      const attendanceRecords: Record<string, AttendanceRecord> = {};

      // 初始化有排班的日期
      Object.entries(workSchedulesByDate).forEach(([date, schedule]) => {
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
      if (Array.isArray(checkInRecords)) {
        checkInRecords.forEach((record: CheckInRecord) => {
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
    },
    []
  );

  const loadMonthlyData = useCallback(
    async (year: number, month: number) => {
      if (monthlyLoadingRef.current) return;

      monthlyLoadingRef.current = true;
      setMonthlyLoading(true);
      setMonthlyError(null);

      try {
        const response = await fetchMonthlyAttendance(year, month);
        setMonthlyData(year, month, response.attendance_records);
      } catch (e) {
        const msg = e instanceof Error ? e.message : '載入月曆資料失敗';
        setMonthlyError(msg);
      } finally {
        monthlyLoadingRef.current = false;
        setMonthlyLoading(false);
      }
    },
    [setMonthlyData, setMonthlyLoading, setMonthlyError, fetchMonthlyAttendance]
  );

  const changeMonth = useCallback(async (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
  }, []);

  const getAttendanceForDate = useCallback(
    (date: Date): AttendanceRecord | null => {
      return storeGetAttendanceForDate(date);
    },
    [storeGetAttendanceForDate]
  );

  const selectedDateAttendance = useMemo(() => {
    if (!selectedDate) return null;
    return getAttendanceForDate(selectedDate);
  }, [selectedDate, getAttendanceForDate]);

  const getHighlightedDates = useCallback(() => {
    const currentMonthData = getMonthlyData(currentYear, currentMonth);
    if (!currentMonthData) return { danger: [], warning: [] };

    const highlightedDates = { danger: [] as Date[], warning: [] as Date[] };

    Object.entries(currentMonthData).forEach(([dateStr, record]) => {
      const recordDate = new Date(dateStr);
      if (recordDate <= today && record.is_workday && isAbnormalRecord(record)) {
        const hasPendingApproval = record.check_in_records.some(
          r => r.approval_status === 'pending'
        );
        if (hasPendingApproval) {
          highlightedDates.warning.push(recordDate);
        } else {
          highlightedDates.danger.push(recordDate);
        }
      }
    });
    return highlightedDates;
  }, [currentYear, currentMonth, getMonthlyData, isAbnormalRecord, today]);

  return {
    monthlyData: getMonthlyData(currentYear, currentMonth),
    currentYear,
    currentMonth,
    selectedDate,
    selectedDateAttendance,
    highlightedDates: getHighlightedDates(),
    monthlyLoading,
    monthlyError,
    loadMonthlyData,
    changeMonth,
    setSelectedDate,
  };
};
