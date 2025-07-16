import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { calculateAnnualLeaveDays, formatYearsOfService } from '@/utils/annualLeaveCalculator';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Staff } from '../types';

interface EditStaffBasicFieldsProps {
  currentStaff: Staff;
  setCurrentStaff: (staff: Staff) => void;
  onHireDateChange?: (hasHireDate: boolean, entitledDays?: number) => void;
}

export const EditStaffBasicFields: React.FC<EditStaffBasicFieldsProps> = ({
  currentStaff,
  setCurrentStaff,
  onHireDateChange,
}) => {
  const [hireDateOpen, setHireDateOpen] = useState(false);

  const handleHireDateChange = (date: Date | undefined) => {
    const updatedStaff = {
      ...currentStaff,
      hire_date: date ? format(date, 'yyyy-MM-dd') : undefined,
    };
    setCurrentStaff(updatedStaff);

    // 計算特休天數並通知父組件
    if (date && onHireDateChange) {
      const entitledDays = calculateAnnualLeaveDays(date);
      onHireDateChange(true, entitledDays);
    } else if (onHireDateChange) {
      onHireDateChange(false);
    }

    setHireDateOpen(false);
  };

  // 計算顯示的年資和特休信息
  const hireDateInfo = React.useMemo(() => {
    if (!currentStaff.hire_date) return null;

    const hireDate = new Date(currentStaff.hire_date);
    const yearsOfService = formatYearsOfService(hireDate);
    const entitledDays = calculateAnnualLeaveDays(hireDate);

    return { yearsOfService, entitledDays };
  }, [currentStaff.hire_date]);

  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          姓名 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          value={currentStaff.name || ''}
          onChange={e => setCurrentStaff({ ...currentStaff, name: e.target.value })}
          className="col-span-3"
          placeholder="請輸入姓名"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          電子郵件 <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          value={currentStaff.email || ''}
          onChange={e => setCurrentStaff({ ...currentStaff, email: e.target.value })}
          className="col-span-3"
          placeholder="請輸入電子郵件"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="contact" className="text-right">
          聯絡電話
        </Label>
        <Input
          id="contact"
          value={currentStaff.contact || ''}
          onChange={e => setCurrentStaff({ ...currentStaff, contact: e.target.value })}
          className="col-span-3"
          placeholder="請輸入聯絡電話"
        />
      </div>

      {/* 優化的入職日期欄位 */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="hire_date" className="text-right text-sm">
          📅 入職日期
          <br />
          <span className="text-xs text-gray-500">(用於計算特休)</span>
        </Label>
        <div className="col-span-3">
          <Popover open={hireDateOpen} onOpenChange={setHireDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !currentStaff.hire_date && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {currentStaff.hire_date ? (
                  format(new Date(currentStaff.hire_date), 'yyyy年MM月dd日')
                ) : (
                  <span>請選擇入職日期</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={currentStaff.hire_date ? new Date(currentStaff.hire_date) : undefined}
                onSelect={handleHireDateChange}
                disabled={date => date > new Date() || date < new Date('1900-01-01')}
                initialFocus
                className="pointer-events-auto"
                captionLayout="dropdown-buttons"
                fromYear={1990}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>

          {/* 顯示年資和特休信息 */}
          {hireDateInfo && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-blue-600 font-medium">年資：</span>
                  <span className="text-blue-800 font-semibold">{hireDateInfo.yearsOfService}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-blue-600 font-medium">特休：</span>
                  <span className="text-blue-800 font-semibold">
                    {hireDateInfo.entitledDays} 天
                  </span>
                </div>
              </div>
              <div className="mt-1 text-xs text-blue-600">根據入職日自動計算</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
