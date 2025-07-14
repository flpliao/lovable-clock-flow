import { Calendar } from '@/components/ui/calendar';
import { CheckInRecord } from '@/types';
import { MissedCheckinRequest } from '@/types/missedCheckin';
import { eachDayOfInterval, endOfMonth, format, isFuture, isWeekend, startOfMonth } from 'date-fns';
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
  onMonthChange?: () => Promise<void>;
}

const AttendanceCalendarView: React.FC<AttendanceCalendarViewProps> = ({
  date,
  setDate,
  selectedDateRecords,
  checkInRecords,
  missedCheckinRecords,
  onMonthChange,
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

  // 獲取週末日期（顯示灰色）
  const weekendDates = useMemo(() => {
    const dates: Date[] = [];

    // 使用當前顯示的月份
    const monthStart = startOfMonth(displayMonth);
    const monthEnd = endOfMonth(displayMonth);
    const allDaysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    allDaysInMonth.forEach(day => {
      if (isWeekend(day)) {
        dates.push(day);
      }
    });

    return dates;
  }, [displayMonth]);

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

  // 獲取需要標記為黃色的日期（有未核准的忘打卡記錄）
  const pendingMissedCheckinDates = useMemo(() => {
    const dates: Date[] = [];

    // 使用當前顯示的月份
    const monthStart = startOfMonth(displayMonth);
    const monthEnd = endOfMonth(displayMonth);
    const allDaysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    allDaysInMonth.forEach(day => {
      // 跳過未來的日期和週末
      if (isFuture(day) || isWeekend(day)) {
        return;
      }

      const dayStr = format(day, 'yyyy-MM-dd');
      const missedRecords = missedCheckinMap.get(dayStr) || [];

      // 檢查是否有待審核的忘打卡記錄
      const hasPendingMissed = missedRecords.some(record => record.status === 'pending');

      if (hasPendingMissed) {
        dates.push(day);
      }
    });

    return dates;
  }, [missedCheckinMap, displayMonth]);

  // 獲取需要標記為紅色的日期（沒有完整打卡記錄且沒有待審核忘打卡記錄的工作日）
  const incompleteDates = useMemo(() => {
    const dates: Date[] = [];

    // 使用當前顯示的月份
    const monthStart = startOfMonth(displayMonth);
    const monthEnd = endOfMonth(displayMonth);
    const allDaysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    allDaysInMonth.forEach(day => {
      // 跳過未來的日期和週末
      if (isFuture(day) || isWeekend(day)) {
        return;
      }

      const dayStr = format(day, 'yyyy-MM-dd');
      const dayRecords = datesWithRecords.get(dayStr);
      const missedRecords = missedCheckinMap.get(dayStr) || [];

      // 檢查是否有待審核的忘打卡記錄
      const hasPendingMissed = missedRecords.some(record => record.status === 'pending');

      // 如果有待審核的忘打卡記錄，則不標記為紅色（會被標記為黃色）
      if (hasPendingMissed) {
        return;
      }

      // 如果沒有打卡記錄，或者記錄不完整，就標記為紅色
      if (!dayRecords || !dayRecords.checkIn || !dayRecords.checkOut) {
        dates.push(day);
      }
    });

    return dates;
  }, [datesWithRecords, missedCheckinMap, displayMonth]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={displayMonth}
          onMonthChange={handleMonthChange}
          className="mx-auto"
          captionLayout="buttons"
          formatters={{
            formatCaption: (date, options) => {
              return format(date, 'MMMM yyyy');
            },
          }}
          modifiers={{
            incomplete: incompleteDates,
            weekend: weekendDates,
            pendingMissed: pendingMissedCheckinDates,
          }}
          modifiersClassNames={{
            incomplete: 'bg-red-500/80 text-white hover:bg-red-600/80 hover:text-white',
            weekend: 'bg-gray-400/60 text-gray-600 hover:bg-gray-500/60 hover:text-gray-700',
            pendingMissed: 'bg-yellow-500/80 text-white hover:bg-yellow-600/80 hover:text-white',
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
            isInDialog={false}
          />
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendarView;
