
import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OvertimeSearchFiltersProps {
  searchTerm: string;
  statusFilter: string;
  typeFilter: string;
  onSearchTermChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
}

const OvertimeSearchFilters: React.FC<OvertimeSearchFiltersProps> = ({
  searchTerm,
  statusFilter,
  typeFilter,
  onSearchTermChange,
  onStatusFilterChange,
  onTypeFilterChange
}) => {
  return (
    <div className="space-y-6">
      {/* 搜尋框 */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
        <Input
          placeholder="搜尋加班原因..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="pl-12 h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white placeholder-white/70 rounded-xl"
        />
      </div>
      
      {/* 篩選器 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white rounded-xl">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="狀態" />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
            <SelectItem value="all">全部狀態</SelectItem>
            <SelectItem value="pending">待審核</SelectItem>
            <SelectItem value="approved">已核准</SelectItem>
            <SelectItem value="rejected">已拒絕</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="h-12 bg-white/20 backdrop-blur-xl border-white/30 text-white rounded-xl">
            <SelectValue placeholder="類型" />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
            <SelectItem value="all">全部類型</SelectItem>
            <SelectItem value="weekday">平日加班</SelectItem>
            <SelectItem value="weekend">假日加班</SelectItem>
            <SelectItem value="holiday">國定假日加班</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OvertimeSearchFilters;
