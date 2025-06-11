
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Calendar } from 'lucide-react';

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
    <div className="bg-white/80 rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">選擇年月</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger className="h-12 text-base bg-white border border-gray-300 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300 rounded-lg shadow-lg z-50">
            {generateYears().map((year) => (
              <SelectItem 
                key={year} 
                value={year.toString()}
                className="py-3 px-4 text-base hover:bg-gray-50 rounded-md text-black"
              >
                {year}年
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger className="h-12 text-base bg-white border border-gray-300 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-300 rounded-lg shadow-lg z-50">
            {generateMonths().map((month) => (
              <SelectItem 
                key={month.value} 
                value={month.value}
                className="py-3 px-4 text-base hover:bg-gray-50 rounded-md text-black"
              >
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default YearMonthSelectorCard;
