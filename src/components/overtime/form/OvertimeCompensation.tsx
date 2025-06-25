
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Gift } from 'lucide-react';
import type { OvertimeFormData } from '@/types/overtime';

interface OvertimeCompensationProps {
  form: UseFormReturn<OvertimeFormData>;
}

export const OvertimeCompensation: React.FC<OvertimeCompensationProps> = ({
  form
}) => {
  const { setValue } = form;

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Gift className="h-5 w-5 text-white" />
        <h3 className="text-lg font-semibold text-white drop-shadow-md">補償方式</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="compensation_type" className="text-white font-medium">補償類型</Label>
        <Select onValueChange={(value) => setValue('compensation_type', value)}>
          <SelectTrigger className="bg-white/20 border-white/30 text-white backdrop-blur-xl">
            <SelectValue placeholder="選擇補償方式" className="text-white/60" />
          </SelectTrigger>
          <SelectContent className="bg-white/90 backdrop-blur-xl border-white/50">
            <SelectItem value="overtime_pay">加班費</SelectItem>
            <SelectItem value="compensatory_time">補休</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
