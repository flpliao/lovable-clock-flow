import React, { useState, useMemo, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isFuture, isWeekend } from 'date-fns';
import { CheckInRecord } from '@/types';
import DateRecordDetails from './DateRecordDetails';

interface AttendanceCalendarViewProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  selectedDateRecords: {
    checkIn?: CheckInRecord;
    checkOut?: CheckInRecord;
  };
  checkInRecords: CheckInRecord[];
  onMonthChange?: () => Promise<void>;
}

const AttendanceCalendarView: React.FC<AttendanceCalendarViewProps> = ({
  date,
  setDate,
  selectedDateRecords,
  checkInRecords,
  onMonthChange,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  // 中文月份對照
  const getChineseMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return `${year}年${month}月`;
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

  // 獲取需要標記為紅色的日期（沒有完整打卡記錄的工作日）
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

      // 如果沒有打卡記錄，或者記錄不完整，就標記為紅色
      if (!dayRecords || !dayRecords.checkIn || !dayRecords.checkOut) {
        dates.push(day);
      }
    });

    return dates;
  }, [datesWithRecords, displayMonth]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setIsDialogOpen(true);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6 max-w-md w-full">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          month={displayMonth}
          onMonthChange={handleMonthChange}
          className="mx-auto"
          captionLayout="buttons"
          formatters={{
            formatCaption: (date, options) => {
              return getChineseMonth(date);
            },
          }}
          modifiers={{
            incomplete: incompleteDates,
            weekend: weekendDates,
          }}
          modifiersClassNames={{
            incomplete: 'bg-red-500/80 text-white hover:bg-red-600/80 hover:text-white',
            weekend: 'bg-gray-400/60 text-gray-600 hover:bg-gray-500/60 hover:text-gray-700',
          }}
          classNames={{
            day: 'relative h-10 w-10 p-0 font-normal rounded-full transition-colors hover:bg-gray-100 text-gray-800 font-medium cursor-pointer',
          }}
        />
      </div>

      {/* 彈出式出勤記錄詳情 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">
              {date ? `${format(date, 'yyyy年MM月dd日')} 出勤記錄` : '出勤記錄'}
            </DialogTitle>
          </DialogHeader>

          {date && (
            <div className="text-gray-900">
              <DateRecordDetails
                date={date}
                selectedDateRecords={selectedDateRecords}
                recordsCount={getDayRecordsCount()}
                isInDialog={true}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AttendanceCalendarView;
