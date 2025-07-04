import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { OvertimeFormData, OvertimeType } from '@/types/overtime';

interface OvertimeBasicInfoProps {
  form: UseFormReturn<OvertimeFormData>;
  overtimeTypes: OvertimeType[];
  errors: Record<string, { message?: string }>;
}

export const OvertimeBasicInfo: React.FC<OvertimeBasicInfoProps> = ({
  form,
  overtimeTypes,
  errors,
}) => {
  const { setValue } = form;

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <CalendarIcon className="h-5 w-5 text-white" />
        <h3 className="text-lg font-semibold text-white drop-shadow-md">基本資訊</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 加班日期 */}
        <div className="space-y-2">
          <Label htmlFor="overtime_date" className="text-white font-medium">
            加班日期
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-xl hover:bg-white/30',
                  !form.watch('overtime_date') && 'text-white/60'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch('overtime_date') ? (
                  format(new Date(form.watch('overtime_date')), 'yyyy/MM/dd')
                ) : (
                  <span>選擇加班日期</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  form.watch('overtime_date') ? new Date(form.watch('overtime_date')) : undefined
                }
                onSelect={date => {
                  if (date) {
                    const dateString = format(date, 'yyyy-MM-dd');
                    setValue('overtime_date', dateString);
                  }
                }}
                disabled={date => {
                  // 計算6個月前的日期作為最早可選日期
                  const sixMonthsAgo = new Date();
                  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
                  sixMonthsAgo.setHours(0, 0, 0, 0);

                  // 計算1年後的日期作為最晚可選日期
                  const oneYearLater = new Date();
                  oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
                  oneYearLater.setHours(23, 59, 59, 999);

                  return date < sixMonthsAgo || date > oneYearLater;
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {errors.overtime_date && (
            <p className="text-red-300 text-sm">{errors.overtime_date.message}</p>
          )}
        </div>

        {/* 加班類型 */}
        <div className="space-y-2">
          <Label htmlFor="overtime_type" className="text-white font-medium">
            加班類型
          </Label>
          <Select onValueChange={value => setValue('overtime_type', value)}>
            <SelectTrigger className="bg-white/20 border-white/30 text-white backdrop-blur-xl">
              <SelectValue placeholder="選擇加班類型" className="text-white/60" />
            </SelectTrigger>
            <SelectContent className="bg-white/90 backdrop-blur-xl border-white/50">
              {overtimeTypes.map(type => (
                <SelectItem key={type.id} value={type.code}>
                  {type.name_zh}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.overtime_type && <p className="text-red-300 text-sm">請選擇加班類型</p>}
        </div>
      </div>
    </div>
  );
};
