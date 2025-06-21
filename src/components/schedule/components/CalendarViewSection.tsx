
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CalendarViewSectionProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  generateYears: () => number[];
  generateMonths: () => Array<{ value: number; label: string }>;
}

const CalendarViewSection = ({
  selectedDate,
  onDateChange,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  generateYears,
  generateMonths,
}: CalendarViewSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {generateYears().map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}年
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedMonth.toString()} onValueChange={(value) => onMonthChange(parseInt(value))}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {generateMonths().map((month) => (
              <SelectItem key={month.value} value={month.value.toString()}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CalendarViewSection;
