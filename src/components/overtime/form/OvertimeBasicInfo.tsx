
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import type { OvertimeFormData, OvertimeType } from '@/types/overtime';

interface OvertimeBasicInfoProps {
  form: UseFormReturn<OvertimeFormData>;
  overtimeTypes: OvertimeType[];
  errors: any;
}

export const OvertimeBasicInfo: React.FC<OvertimeBasicInfoProps> = ({
  form,
  overtimeTypes,
  errors
}) => {
  const { register, setValue } = form;

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="h-5 w-5 text-white" />
        <h3 className="text-lg font-semibold text-white drop-shadow-md">基本資訊</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 加班日期 */}
        <div className="space-y-2">
          <Label htmlFor="overtime_date" className="text-white font-medium">加班日期</Label>
          <Input
            type="date"
            {...register('overtime_date', { required: '請選擇加班日期' })}
            className="bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-xl"
          />
          {errors.overtime_date && (
            <p className="text-red-300 text-sm">{errors.overtime_date.message}</p>
          )}
        </div>

        {/* 加班類型 */}
        <div className="space-y-2">
          <Label htmlFor="overtime_type" className="text-white font-medium">加班類型</Label>
          <Select onValueChange={(value) => setValue('overtime_type', value)}>
            <SelectTrigger className="bg-white/20 border-white/30 text-white backdrop-blur-xl">
              <SelectValue placeholder="選擇加班類型" className="text-white/60" />
            </SelectTrigger>
            <SelectContent className="bg-white/90 backdrop-blur-xl border-white/50">
              {overtimeTypes.map((type) => (
                <SelectItem key={type.id} value={type.code}>
                  {type.name_zh}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.overtime_type && (
            <p className="text-red-300 text-sm">請選擇加班類型</p>
          )}
        </div>
      </div>
    </div>
  );
};
