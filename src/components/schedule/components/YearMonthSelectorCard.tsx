
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
    <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-500 rounded-lg text-white">
          <Calendar className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">選擇年月</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger className="h-12 text-base bg-white/50 border border-white/40 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white/95 border border-white/30 rounded-lg shadow-lg">
            {generateYears().map((year) => (
              <SelectItem 
                key={year} 
                value={year.toString()}
                className="py-3 px-4 text-base hover:bg-white/80 rounded-md"
              >
                {year}年
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger className="h-12 text-base bg-white/50 border border-white/40 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white/95 border border-white/30 rounded-lg shadow-lg">
            {generateMonths().map((month) => (
              <SelectItem 
                key={month.value} 
                value={month.value}
                className="py-3 px-4 text-base hover:bg-white/80 rounded-md"
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
