
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { OvertimeFormData } from '@/types/overtime';

interface OvertimeReasonProps {
  form: UseFormReturn<OvertimeFormData>;
  errors: any;
}

export const OvertimeReason: React.FC<OvertimeReasonProps> = ({
  form,
  errors
}) => {
  const { register } = form;

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-5 w-5 text-white">📝</div>
        <h3 className="text-lg font-semibold text-white drop-shadow-md">加班原因</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="reason" className="text-white font-medium">詳細說明</Label>
        <Textarea
          {...register('reason', { required: '請填寫加班原因' })}
          placeholder="請詳細說明加班原因..."
          rows={4}
          className="bg-white/20 border-white/30 text-white placeholder-white/60 backdrop-blur-xl resize-none"
        />
        {errors.reason && (
          <p className="text-red-300 text-sm">{errors.reason.message}</p>
        )}
      </div>
    </div>
  );
};
