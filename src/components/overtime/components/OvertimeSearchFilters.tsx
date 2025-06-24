
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

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
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-4">
        <Search className="h-5 w-5 text-white/80" />
        <h3 className="text-lg font-medium text-white">搜尋與篩選</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-white/80">搜尋原因</label>
          <Input
            placeholder="輸入加班原因關鍵字..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-white/80">狀態篩選</label>
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="選擇狀態" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部狀態</SelectItem>
              <SelectItem value="pending">審核中</SelectItem>
              <SelectItem value="approved">已核准</SelectItem>
              <SelectItem value="rejected">已拒絕</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-white/80">加班類型</label>
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="選擇類型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部類型</SelectItem>
              <SelectItem value="weekday">平日加班</SelectItem>
              <SelectItem value="weekend">假日加班</SelectItem>
              <SelectItem value="holiday">國定假日加班</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default OvertimeSearchFilters;
