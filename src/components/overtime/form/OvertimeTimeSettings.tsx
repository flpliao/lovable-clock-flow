
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import type { OvertimeFormData } from '@/types/overtime';

interface OvertimeTimeSettingsProps {
  form: UseFormReturn<OvertimeFormData>;
  errors: any;
}

export const OvertimeTimeSettings: React.FC<OvertimeTimeSettingsProps> = ({
  form,
  errors
}) => {
  const { register } = form;

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Clock className="h-5 w-5 text-white" />
        <h3 className="text-lg font-semibold text-white drop-shadow-md">時間設定</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 開始時間 */}
        <div className="space-y-2">
          <Label htmlFor="start_time" className="text-white font-medium">開始時間</Label>
          <Input
            type="time"
            {...register('start_time', { required: '請選擇開始時間' })}
            className="bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-xl"
            placeholder="--:--"
          />
          {errors.start_time && (
            <p className="text-red-300 text-sm">{errors.start_time.message}</p>
          )}
        </div>

        {/* 結束時間 */}
        <div className="space-y-2">
          <Label htmlFor="end_time" className="text-white font-medium">結束時間</Label>
          <Input
            type="time"
            {...register('end_time', { required: '請選擇結束時間' })}
            className="bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-xl"
            placeholder="--:--"
          />
          {errors.end_time && (
            <p className="text-red-300 text-sm">{errors.end_time.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
