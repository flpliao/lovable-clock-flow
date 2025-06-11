
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface YearMonthSelectorProps {
  selectedYear: string;
  selectedMonth: string;
  onYearChange: (year: string) => void;
  onMonthChange: (month: string) => void;
}

const YearMonthSelector = ({ selectedYear, selectedMonth, onYearChange, onMonthChange }: YearMonthSelectorProps) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear + i - 1);
  const months = [
    { value: '01', label: '1月' },
    { value: '02', label: '2月' },
    { value: '03', label: '3月' },
    { value: '04', label: '4月' },
    { value: '05', label: '5月' },
    { value: '06', label: '6月' },
    { value: '07', label: '7月' },
    { value: '08', label: '8月' },
    { value: '09', label: '9月' },
    { value: '10', label: '10月' },
    { value: '11', label: '11月' },
    { value: '12', label: '12月' },
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      <Select value={selectedYear} onValueChange={onYearChange}>
        <SelectTrigger className="h-14 text-lg bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white placeholder:text-white/70">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-300 rounded-2xl shadow-xl z-50">
          {years.map((year) => (
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
        <SelectTrigger className="h-14 text-lg bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white placeholder:text-white/70">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-300 rounded-2xl shadow-xl z-50">
          {months.map((month) => (
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

export default YearMonthSelector;
