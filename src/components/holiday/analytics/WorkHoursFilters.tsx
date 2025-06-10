
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Filter } from 'lucide-react';

interface WorkHoursFiltersProps {
  selectedYear: number;
  selectedCountry: string;
  onYearChange: (year: number) => void;
  onCountryChange: (country: string) => void;
}

const WorkHoursFilters: React.FC<WorkHoursFiltersProps> = ({
  selectedYear,
  selectedCountry,
  onYearChange,
  onCountryChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-500/80 rounded-lg shadow-md">
          <Filter className="h-4 w-4 text-white" />
        </div>
        <h4 className="text-base font-medium text-white">統計設定</h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-white/80 text-sm font-medium">
            <Calendar className="h-3 w-3" />
            統計年份
          </label>
          <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
            <SelectTrigger className="h-10 bg-white/25 backdrop-blur-sm border-white/40 text-white rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                <SelectItem key={year} value={year.toString()}>{year} 年</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-white/80 text-sm font-medium">
            <MapPin className="h-3 w-3" />
            適用地區
          </label>
          <Select value={selectedCountry} onValueChange={onCountryChange}>
            <SelectTrigger className="h-10 bg-white/25 backdrop-blur-sm border-white/40 text-white rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
              <SelectItem value="TW">🇹🇼 台灣</SelectItem>
              <SelectItem value="CN">🇨🇳 中國大陸</SelectItem>
              <SelectItem value="HK">🇭🇰 香港</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default WorkHoursFilters;
