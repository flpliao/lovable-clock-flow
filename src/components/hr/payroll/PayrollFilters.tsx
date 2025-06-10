
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface PayrollFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  periodFilter: string;
  setPeriodFilter: (value: string) => void;
}

const PayrollFilters: React.FC<PayrollFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  periodFilter,
  setPeriodFilter
}) => {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
        <Input
          placeholder="搜尋員工、職位或部門..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-9 text-sm bg-white/20 backdrop-blur-xl border-white/30 text-white placeholder:text-white/60"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 text-xs bg-white/20 backdrop-blur-xl border-white/30 text-white">
            <Filter className="h-3 w-3 mr-1" />
            <SelectValue placeholder="狀態" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-xl border-white/30">
            <SelectItem value="all">全部狀態</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
            <SelectItem value="calculated">已計算</SelectItem>
            <SelectItem value="approved">已核准</SelectItem>
            <SelectItem value="paid">已發放</SelectItem>
          </SelectContent>
        </Select>
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="h-9 text-xs bg-white/20 backdrop-blur-xl border-white/30 text-white">
            <SelectValue placeholder="期間" />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-xl border-white/30">
            <SelectItem value="current">本月</SelectItem>
            <SelectItem value="last">上月</SelectItem>
            <SelectItem value="quarter">本季</SelectItem>
            <SelectItem value="year">本年</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PayrollFilters;
