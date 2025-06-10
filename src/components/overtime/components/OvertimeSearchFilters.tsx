
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
    <div className="space-y-6">
      {/* 搜尋區域 */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-500/80 rounded-lg shadow-md">
            <Search className="h-4 w-4 text-white" />
          </div>
          <h4 className="text-lg font-medium text-white">搜尋條件</h4>
        </div>
        
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
          <Input
            placeholder="搜尋加班原因..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-12 h-14 bg-white/25 backdrop-blur-xl border-white/30 text-white placeholder-white/70 rounded-xl text-base"
          />
        </div>
      </div>
      
      {/* 篩選器區域 */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/80 rounded-lg shadow-md">
            <Filter className="h-4 w-4 text-white" />
          </div>
          <h4 className="text-lg font-medium text-white">篩選選項</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <FileText className="h-4 w-4" />
              審核狀態
            </label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="h-12 bg-white/25 backdrop-blur-xl border-white/30 text-white rounded-xl">
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
              <Calendar className="h-4 w-4" />
              加班類型
            </label>
            <Select value={typeFilter} onValueChange={onTypeFilterChange}>
              <SelectTrigger className="h-12 bg-white/25 backdrop-blur-xl border-white/30 text-white rounded-xl">
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
