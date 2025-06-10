
import React from 'react';
import { Search, Filter, Calendar, FileText } from 'lucide-react';
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
    <div className="space-y-4">
      {/* 搜尋區域 - 單層設計 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-blue-500/80 rounded-lg shadow-md">
            <Search className="h-4 w-4 text-white" />
          </div>
          <h4 className="text-base font-medium text-white">搜尋條件</h4>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
          <Input
            placeholder="搜尋加班原因..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 h-12 bg-white/25 backdrop-blur-sm border-white/40 text-white placeholder-white/70 rounded-xl"
          />
        </div>
      </div>
      
      {/* 篩選器區域 - 單層設計 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-purple-500/80 rounded-lg shadow-md">
            <Filter className="h-4 w-4 text-white" />
          </div>
          <h4 className="text-base font-medium text-white">篩選選項</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <FileText className="h-3 w-3" />
              審核狀態
            </label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="h-10 bg-white/25 backdrop-blur-sm border-white/40 text-white rounded-xl">
                <SelectValue placeholder="選擇狀態" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
                <SelectItem value="all">全部狀態</SelectItem>
                <SelectItem value="pending">待審核</SelectItem>
                <SelectItem value="approved">已核准</SelectItem>
                <SelectItem value="rejected">已拒絕</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <Calendar className="h-3 w-3" />
              加班類型
            </label>
            <Select value={typeFilter} onValueChange={onTypeFilterChange}>
              <SelectTrigger className="h-10 bg-white/25 backdrop-blur-sm border-white/40 text-white rounded-xl">
                <SelectValue placeholder="選擇類型" />
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
      </div>
    </div>
  );
};

export default OvertimeSearchFilters;
