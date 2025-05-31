
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateYears, generateMonths } from './utils/dateUtils';

interface YearMonthSelectorProps {
  selectedYear: string;
  selectedMonth: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
}

const YearMonthSelector = ({ selectedYear, selectedMonth, onYearChange, onMonthChange }: YearMonthSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <FormLabel>選擇年份</FormLabel>
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {generateYears().map(year => (
              <SelectItem key={year} value={year}>
                {year}年
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <FormLabel>選擇月份</FormLabel>
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {generateMonths().map(month => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default YearMonthSelector;
