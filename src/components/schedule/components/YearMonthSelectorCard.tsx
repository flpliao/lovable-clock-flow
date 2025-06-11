
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface YearMonthSelectorCardProps {
  selectedYear: string;
  selectedMonth: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
  generateYears: () => number[];
  generateMonths: () => { value: string; label: string; }[];
}

const YearMonthSelectorCard = ({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
  generateYears,
  generateMonths,
}: YearMonthSelectorCardProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Select value={selectedYear} onValueChange={onYearChange}>
        <SelectTrigger className="h-14 text-lg bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-black placeholder:text-black/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-300 rounded-2xl shadow-xl z-50">
          {generateYears().map((year) => (
            <SelectItem 
              key={year} 
              value={year.toString()}
              className="py-4 px-6 text-lg hover:bg-gray-50 rounded-xl text-black"
            >
              {year}年
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={selectedMonth} onValueChange={onMonthChange}>
        <SelectTrigger className="h-14 text-lg bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-black placeholder:text-black/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-300 rounded-2xl shadow-xl z-50">
          {generateMonths().map((month) => (
            <SelectItem 
              key={month.value} 
              value={month.value}
              className="py-4 px-6 text-lg hover:bg-gray-50 rounded-xl text-black"
            >
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default YearMonthSelectorCard;
