import { Calendar } from '@/components/ui/calendar';
import { CheckInRecord } from '@/types';
import { MissedCheckinRequest } from '@/types/missedCheckin';
import { Schedule } from '@/services/scheduleService';
import { eachDayOfInterval, endOfMonth, format, isFuture, startOfMonth } from 'date-fns';
import { isToday } from '@/utils/dateUtils';
import React, { useMemo, useState } from 'react';
import DateRecordDetails from './DateRecordDetails';

interface AttendanceCalendarViewProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  selectedDateRecords: {
    checkIn?: CheckInRecord;
    checkOut?: CheckInRecord;
  };
  checkInRecords: CheckInRecord[];
  missedCheckinRecords: MissedCheckinRequest[];
  userSchedules: Schedule[];
  hasScheduleForDate: (date: string) => boolean;
  getScheduleForDate: (date: string) => Schedule | undefined;
  onMonthChange?: () => Promise<void>;
  onDataRefresh?: () => Promise<void>;
}

const AttendanceCalendarView: React.FC<AttendanceCalendarViewProps> = ({
  date,
  setDate,
  selectedDateRecords,
  checkInRecords,
  missedCheckinRecords,
  userSchedules: _userSchedules,
  hasScheduleForDate,
  getScheduleForDate,
  onMonthChange,
  onDataRefresh,
}) => {
  const [displayMonth, setDisplayMonth] = useState<Date>(new Date());

  // 監聽顯示月份變化並重新載入資料
  const handleMonthChange = async (newMonth: Date) => {
    const newMonthKey = format(newMonth, 'yyyy-MM');
    const currentMonthKey = format(displayMonth, 'yyyy-MM');

    if (newMonthKey !== currentMonthKey) {
      console.log('月份變化，重新載入出勤資料:', newMonthKey);
      setDisplayMonth(newMonth);
      if (onMonthChange) {
        await onMonthChange();
      }
    }
  };

  const getDayRecordsCount = () => {
    if (!date) return 0;
    const selectedDateStr = format(date, 'yyyy-MM-dd');
    return checkInRecords.filter(record => {
      const recordDate = format(new Date(record.timestamp), 'yyyy-MM-dd');
      return recordDate === selectedDateStr && record.status === 'success';
    }).length;
  };

  // 獲取有打卡記錄的日期
  const datesWithRecords = useMemo(() => {
    const dateMap = new Map<string, { checkIn: boolean; checkOut: boolean }>();

    checkInRecords.forEach(record => {
      if (record.status === 'success') {
        const recordDate = format(new Date(record.timestamp), 'yyyy-MM-dd');
        const currentRecord = dateMap.get(recordDate) || { checkIn: false, checkOut: false };

        if (record.action === 'check-in') {
          currentRecord.checkIn = true;
        } else if (record.action === 'check-out') {
          currentRecord.checkOut = true;
        }

        dateMap.set(recordDate, currentRecord);
      }
    });

    return dateMap;
  }, [checkInRecords]);

  // 獲取忘打卡記錄的映射
  const missedCheckinMap = useMemo(() => {
    const map = new Map<string, MissedCheckinRequest[]>();

    missedCheckinRecords.forEach(record => {
      const requestDate = record.request_date;
      const currentRecords = map.get(requestDate) || [];
      currentRecords.push(record);
      map.set(requestDate, currentRecords);
    });

    return map;
  }, [missedCheckinRecords]);

  // 獲取休假日期（沒有排班的日期，顯示灰色）
  const holidayDates = useMemo(() => {
    const dates: Date[] = [];

    // 使用當前顯示的月份
    const monthStart = startOfMonth(displayMonth);
    const monthEnd = endOfMonth(displayMonth);
    const allDaysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    allDaysInMonth.forEach(day => {
      // 跳過未來日期和當日
      if (isFuture(day) || isToday(day)) {
        return;
      }

      const dayStr = format(day, 'yyyy-MM-dd');

      // 如果該日期沒有排班，視為休假
      if (!hasScheduleForDate(dayStr)) {
        dates.push(day);
      }
    });

    return dates;
  }, [displayMonth, hasScheduleForDate]);

  // 獲取需要標記為紅色的日期（有排班但沒有完整打卡記錄且沒有忘打卡核准的日期）
  const incompleteDates = useMemo(() => {
    const dates: Date[] = [];

    // 使用當前顯示的月份
    const monthStart = startOfMonth(displayMonth);
    const monthEnd = endOfMonth(displayMonth);
    const allDaysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    allDaysInMonth.forEach(day => {
      // 跳過未來日期
      if (isFuture(day)) {
        return;
      }

      const dayStr = format(day, 'yyyy-MM-dd');

      // 檢查是否有排班
      if (!hasScheduleForDate(dayStr)) {
        return; // 沒有排班不標記為異常
      }

      const dayRecords = datesWithRecords.get(dayStr);
      const missedRecords = missedCheckinMap.get(dayStr) || [];
      const schedule = getScheduleForDate(dayStr);

      // 檢查上班記錄：有打卡記錄 OR 有已核准的上班忘打卡
      const hasCheckInRecord = dayRecords?.checkIn || false;
      const hasApprovedCheckInMissed = missedRecords.some(
        record => record.status === 'approved' && record.missed_type === 'check_in'
      );
      const hasValidCheckIn = hasCheckInRecord || hasApprovedCheckInMissed;

      // 檢查下班記錄：有打卡記錄 OR 有已核准的下班忘打卡
      const hasCheckOutRecord = dayRecords?.checkOut || false;
      const hasApprovedCheckOutMissed = missedRecords.some(
        record => record.status === 'approved' && record.missed_type === 'check_out'
      );
      const hasValidCheckOut = hasCheckOutRecord || hasApprovedCheckOutMissed;

      // 重新設計異常判斷邏輯
      const today = new Date();
      const isToday = today.toDateString() === day.toDateString();
      const now = new Date();

      // 判斷是否需要檢查上班記錄
      const shouldCheckIn = (() => {
        if (isToday) {
          // 當天：只有當前時間超過上班時間時才需要檢查
          if (!schedule?.start_time) return false;
          const [startHour, startMinute] = schedule.start_time.split(':').map(Number);
          const workStartTime = new Date();
          workStartTime.setHours(startHour, startMinute, 0, 0);
          return now > workStartTime;
        } else {
          // 過去日期：一定要有上班記錄
          return true;
        }
      })();

      // 判斷是否需要檢查下班記錄
      const shouldCheckOut = (() => {
        if (isToday) {
          // 當天：只有當前時間超過下班時間時才需要檢查
          if (!schedule?.end_time) return false;
          const [endHour, endMinute] = schedule.end_time.split(':').map(Number);
          const workEndTime = new Date();
          workEndTime.setHours(endHour, endMinute, 0, 0);
          return now > workEndTime;
        } else {
          // 過去日期：一定要有下班記錄
          return true;
        }
      })();

      // 檢查是否有異常
      const hasMissingCheckIn = shouldCheckIn && !hasValidCheckIn;
      const hasMissingCheckOut = shouldCheckOut && !hasValidCheckOut;

      if (hasMissingCheckIn || hasMissingCheckOut) {
        dates.push(day);
      }
    });

    return dates;
  }, [datesWithRecords, missedCheckinMap, displayMonth, hasScheduleForDate, getScheduleForDate]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="flex justify-center bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            month={displayMonth}
            onMonthChange={handleMonthChange}
            className="mx-auto"
            captionLayout="buttons"
            formatters={{
              formatCaption: (date, _options) => {
                return format(date, 'MMMM yyyy');
              },
            }}
            modifiers={{
              incomplete: incompleteDates,
              holiday: holidayDates,
            }}
            modifiersClassNames={{
              incomplete: 'bg-red-500/80 text-white hover:bg-red-600/80 hover:text-white',
              holiday: 'bg-gray-400/60 text-gray-600 hover:bg-gray-500/60 hover:text-gray-700',
            }}
            classNames={{
              day: 'relative h-10 w-10 p-0 font-normal rounded-full transition-colors hover:bg-gray-100 text-gray-800 font-medium cursor-pointer',
            }}
          />
        </div>

        {date && (
          <div>
            <DateRecordDetails
              date={date}
              selectedDateRecords={selectedDateRecords}
              recordsCount={getDayRecordsCount()}
              missedCheckinRecords={missedCheckinRecords}
              hasScheduleForDate={hasScheduleForDate}
              getScheduleForDate={getScheduleForDate}
              onDataRefresh={onDataRefresh}
              isInDialog={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceCalendarView;
