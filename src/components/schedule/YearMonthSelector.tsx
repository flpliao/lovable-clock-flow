
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';

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
    <div>
      <FormLabel className="flex items-center space-x-2 text-base font-medium mb-3">
        <Calendar className="h-5 w-5 text-green-600" />
        <span>選擇年月</span>
      </FormLabel>
      <div className="grid grid-cols-2 gap-3">
        <Select value={selectedYear} onValueChange={onYearChange}>
          <SelectTrigger className="h-12 text-base border-2 border-gray-200 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
            {years.map((year) => (
              <SelectItem 
                key={year} 
                value={year.toString()}
                className="py-3 px-4 text-base hover:bg-gray-50"
              >
                {year}年
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger className="h-12 text-base border-2 border-gray-200 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
            {months.map((month) => (
              <SelectItem 
                key={month.value} 
                value={month.value}
                className="py-3 px-4 text-base hover:bg-gray-50"
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

export default YearMonthSelector;
