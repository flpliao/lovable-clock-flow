/* eslint-disable react/prop-types */
import React, { memo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface AttendanceCalendarProps {
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  currentMonth: number;
  currentYear: number;
  onMonthChange: (year: number, month: number) => void;
  highlightedDates: { danger: Date[]; warning: Date[] };
  monthlyData?: Record<string, { is_workday: boolean; attendance_status: string }>;
  loading?: boolean;
}

const AttendanceCalendar: React.FC<AttendanceCalendarProps> = memo(
  ({
    selectedDate,
    onDateSelect,
    currentMonth,
    currentYear,
    onMonthChange,
    highlightedDates,
    monthlyData: _monthlyData,
    loading = false,
  }) => {
    const handleMonthChange = React.useCallback(
      (newMonth: Date) => {
        onMonthChange(newMonth.getFullYear(), newMonth.getMonth() + 1);
      },
      [onMonthChange]
    );

    const formatCaption = React.useCallback((date: Date) => {
      return format(date, 'MMMM yyyy', { locale: zhTW });
    }, []);

    return (
      <div className="bg-white/20 backdrop-blur-2xl rounded-2xl border border-white/30 shadow-lg p-6 flex justify-center w-full">
        {/* 月曆 */}
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          month={new Date(currentYear, currentMonth - 1)}
          onMonthChange={handleMonthChange}
          className="mx-auto"
          classNames={{
            day: 'relative h-10 w-10 p-0 font-normal rounded-full transition-colors hover:bg-gray-100 text-gray-800 font-medium cursor-pointer',
            day_selected: '!bg-blue-500 text-white hover:bg-blue-600 hover:text-white',
            day_today: 'bg-blue-100 text-blue-800 font-semibold',
            day_disabled: 'text-gray-400 cursor-not-allowed hover:bg-transparent',
          }}
          modifiers={{
            highlighted: highlightedDates.danger,
            warning: highlightedDates.warning,
            today: [new Date()],
          }}
          modifiersClassNames={{
            highlighted: 'bg-red-500/80 text-white hover:bg-red-600/80 hover:text-white',
            warning: 'bg-yellow-500/80 text-white hover:bg-yellow-600/80 hover:text-white',
          }}
          formatters={{
            formatCaption,
          }}
          disabled={loading}
        />
      </div>
    );
  }
);

AttendanceCalendar.displayName = 'AttendanceCalendar';

export default AttendanceCalendar;
