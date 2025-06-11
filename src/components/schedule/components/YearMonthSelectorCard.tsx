
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock } from 'lucide-react';

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
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-emerald-600 rounded-xl shadow-lg">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">選擇年月</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger className="h-12 text-sm border-2 border-slate-200 rounded-xl bg-white text-slate-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50">
            {generateYears().map((year) => (
              <SelectItem 
                key={year} 
                value={year.toString()}
                className="py-3 px-4 text-sm hover:bg-gray-50"
              >
                {year}年
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger className="h-12 text-sm border-2 border-slate-200 rounded-xl bg-white text-slate-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg z-50">
            {generateMonths().map((month) => (
              <SelectItem 
                key={month.value} 
                value={month.value}
                className="py-3 px-4 text-sm hover:bg-gray-50"
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
