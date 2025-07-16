import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CalendarIcon, Search, X } from 'lucide-react';
import { format } from 'date-fns';
import { FilterConditions, StaffMember } from '@/stores/attendanceRecordStore';

interface AttendanceFiltersProps {
  filters: FilterConditions;
  departments: string[];
  staffList: StaffMember[];
  activeTab: 'normal' | 'anomaly';
  loading: boolean;
  onFiltersChange: (filters: Partial<FilterConditions>) => void;
  onClearFilters: () => void;
  onSearch: () => void;
}

const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  filters,
  departments,
  staffList,
  activeTab,
  loading,
  onFiltersChange,
  onClearFilters,
  onSearch,
}) => {
  // 根據部門篩選員工
  const filteredStaffList = staffList.filter(
    staff => filters.department === 'all' || staff.department === filters.department
  );

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg p-6 space-y-4">
      {/* 第一行：日期範圍 */}
      <div className="flex items-center gap-4">
        <Label className="text-white font-medium">查詢日期：</Label>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[140px] justify-start text-left font-normal bg-white/20 border-white/30 text-white',
                  !filters.startDate && 'text-white/50'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? format(filters.startDate, 'yyyy/MM/dd') : '選擇開始日期'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.startDate}
                onSelect={date => onFiltersChange({ startDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <span className="text-white">～</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[140px] justify-start text-left font-normal bg-white/20 border-white/30 text-white',
                  !filters.endDate && 'text-white/50'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? format(filters.endDate, 'yyyy/MM/dd') : '選擇結束日期'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.endDate}
                onSelect={date => onFiltersChange({ endDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* 第二行：單位和姓名 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label className="text-white font-medium">單位：</Label>
          <Select
            value={filters.department}
            onValueChange={value => onFiltersChange({ department: value, staffId: 'all' })} // 切換部門時重置員工篩選
          >
            <SelectTrigger className="w-[180px] bg-white/20 border-white/30 text-white">
              <SelectValue placeholder="請選擇" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-white font-medium">姓名：</Label>
          <Select
            value={filters.staffId}
            onValueChange={value => onFiltersChange({ staffId: value })}
          >
            <SelectTrigger className="w-[180px] bg-white/20 border-white/30 text-white">
              <SelectValue placeholder="請選擇" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              {filteredStaffList.map(staff => (
                <SelectItem key={staff.user_id} value={staff.user_id}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 第三行：原因和選項 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label className="text-white font-medium">原因：</Label>
          <Input
            value={filters.reason}
            onChange={e => onFiltersChange({ reason: e.target.value })}
            placeholder="輸入原因關鍵字"
            className="w-[200px] bg-white/20 border-white/30 text-white placeholder-white/50"
          />
        </div>

        {activeTab === 'anomaly' && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hideWithRequests"
              checked={filters.hideWithRequests}
              onCheckedChange={checked => onFiltersChange({ hideWithRequests: !!checked })}
              className="border-white/30"
            />
            <Label htmlFor="hideWithRequests" className="text-white text-sm">
              僅顯示無表單申請紀錄資料
            </Label>
          </div>
        )}
      </div>

      {/* 按鈕區 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            onClick={onSearch}
            className="bg-blue-500/70 hover:bg-blue-600/70 text-white"
            disabled={loading}
          >
            <Search className="h-4 w-4 mr-2" />
            搜尋
          </Button>
          <Button
            onClick={onClearFilters}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <X className="h-4 w-4 mr-2" />
            清空
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceFilters;
