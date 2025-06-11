
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
    <div className="backdrop-blur-2xl bg-white/80 border border-white/50 rounded-3xl shadow-xl p-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg border border-white/30">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 drop-shadow-sm">選擇年月</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger className="h-14 text-base backdrop-blur-xl bg-white/60 border border-white/50 rounded-2xl text-gray-800">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="backdrop-blur-xl bg-white/95 border border-white/30 rounded-2xl shadow-lg z-50">
            {generateYears().map((year) => (
              <SelectItem 
                key={year} 
                value={year.toString()}
                className="py-4 px-6 text-base hover:bg-white/80 rounded-xl"
              >
                {year}年
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger className="h-14 text-base backdrop-blur-xl bg-white/60 border border-white/50 rounded-2xl text-gray-800">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="backdrop-blur-xl bg-white/95 border border-white/30 rounded-2xl shadow-lg z-50">
            {generateMonths().map((month) => (
              <SelectItem 
                key={month.value} 
                value={month.value}
                className="py-4 px-6 text-base hover:bg-white/80 rounded-xl"
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
