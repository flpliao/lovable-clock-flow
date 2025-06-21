
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';

interface MonthSelectorCardProps {
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  generateYears: () => number[];
  generateMonths: () => Array<{ value: number; label: string }>;
  onOverviewDateChange?: (date: Date) => void; // 新增：用於更新排班總覽的日期
}

const MonthSelectorCard = ({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  generateYears,
  generateMonths,
  onOverviewDateChange
}: MonthSelectorCardProps) => {
  
  const handleYearChange = (year: number) => {
    onYearChange(year);
    // 同時更新排班總覽的日期
    if (onOverviewDateChange) {
      const newDate = new Date(year, selectedMonth - 1, 1);
      onOverviewDateChange(newDate);
    }
  };

  const handleMonthChange = (month: number) => {
    onMonthChange(month);
    // 同時更新排班總覽的日期  
    if (onOverviewDateChange) {
      const newDate = new Date(selectedYear, month - 1, 1);
      onOverviewDateChange(newDate);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg text-gray-800">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          <span>選擇月份</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Select value={selectedYear.toString()} onValueChange={(value) => handleYearChange(parseInt(value))}>
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
          
          <Select value={selectedMonth.toString()} onValueChange={(value) => handleMonthChange(parseInt(value))}>
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
      </CardContent>
    </Card>
  );
};

export default MonthSelectorCard;
