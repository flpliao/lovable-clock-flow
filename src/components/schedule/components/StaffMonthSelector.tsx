
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Eye } from 'lucide-react';
import { format } from 'date-fns';
interface StaffMonthSelectorProps {
  availableStaff: any[];
  selectedStaffId?: string;
  selectedDate: Date;
  onStaffChange: (staffId: string | undefined) => void;
  onDateChange: (date: Date) => void;
  getUserRelation: (userId: string) => string;
}
const StaffMonthSelector = ({
  availableStaff,
  selectedStaffId,
  selectedDate,
  onStaffChange,
  onDateChange,
  getUserRelation
}: StaffMonthSelectorProps) => {
  const currentYear = new Date().getFullYear();

  // 生成年月選項
  const generateYearOptions = () => {
    const years = [];
    for (let i = currentYear - 1; i <= currentYear + 1; i++) {
      years.push(i);
    }
    return years;
  };
  const generateMonthOptions = () => {
    return Array.from({
      length: 12
    }, (_, i) => ({
      value: i,
      label: `${i + 1}月`
    }));
  };
  const handleYearChange = (year: string) => {
    const newDate = new Date(parseInt(year), selectedDate.getMonth(), 1);
    onDateChange(newDate);
  };
  const handleMonthChange = (month: string) => {
    const newDate = new Date(selectedDate.getFullYear(), parseInt(month), 1);
    onDateChange(newDate);
  };

  // 處理上個月按鈕
  const handlePreviousMonth = () => {
    const previousMonth = new Date(selectedDate);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    onDateChange(previousMonth);
  };

  return <Card className="bg-cyan-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          快速查看設定
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 員工選擇 */}
        <div>
          <label className="text-sm font-medium mb-2 block flex items-center gap-2">
            <Users className="h-4 w-4" />
            選擇員工
          </label>
          <div className="flex gap-2">
            <Select value={selectedStaffId || 'all'} onValueChange={value => onStaffChange(value === 'all' ? undefined : value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">查看所有員工</SelectItem>
                {availableStaff.map(staff => <SelectItem key={staff.id} value={staff.id}>
                    {staff.name} {getUserRelation(staff.id)}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 年月選擇 */}
        <div>
          <label className="text-sm font-medium mb-2 block flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            選擇年月
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Select value={selectedDate.getFullYear().toString()} onValueChange={handleYearChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {generateYearOptions().map(year => <SelectItem key={year} value={year.toString()}>
                    {year}年
                  </SelectItem>)}
              </SelectContent>
            </Select>
            
            <Select value={selectedDate.getMonth().toString()} onValueChange={handleMonthChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {generateMonthOptions().map(month => <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 快速選擇按鈕 */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
            上月
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDateChange(new Date())}>
            本月
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
          const nextMonth = new Date(selectedDate);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          onDateChange(nextMonth);
        }}>
            下月
          </Button>
        </div>
      </CardContent>
    </Card>;
};
export default StaffMonthSelector;
