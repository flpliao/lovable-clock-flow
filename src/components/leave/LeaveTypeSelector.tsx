
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LEAVE_TYPES, getLeaveTypeById } from '@/utils/leaveTypes';
import { UseFormReturn } from 'react-hook-form';
import { LeaveFormValues } from '@/utils/leaveTypes';
import { visionProStyles } from '@/utils/visionProStyles';

interface LeaveTypeSelectorProps {
  form: UseFormReturn<LeaveFormValues>;
  selectedLeaveType: string | null;
}

export function LeaveTypeSelector({ form, selectedLeaveType }: LeaveTypeSelectorProps) {
  const currentLeaveType = selectedLeaveType ? getLeaveTypeById(selectedLeaveType) : null;

  return (
    <FormField
      control={form.control}
      name="leave_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-white font-medium drop-shadow-md">請假類型</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="backdrop-blur-xl bg-white/20 border-white/30 text-white rounded-xl hover:bg-white/30 transition-colors duration-200">
                <SelectValue placeholder="選擇請假類型" className="text-white" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="backdrop-blur-3xl bg-white/90 border-white/30 rounded-2xl shadow-2xl">
              {LEAVE_TYPES.map((type) => (
                <SelectItem 
                  key={type.id} 
                  value={type.id}
                  className="hover:bg-white/20 focus:bg-white/20 rounded-xl"
                >
                  {type.name}{' '}
                  {!type.isPaid && <span className="text-gray-500 text-xs">(無薪)</span>}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentLeaveType && (
            <FormDescription className="text-white/80 font-medium drop-shadow-md">
              {currentLeaveType.description}
              {currentLeaveType.maxDaysPerYear && (
                <span> (每年上限 {currentLeaveType.maxDaysPerYear} 天)</span>
              )}
            </FormDescription>
          )}
          <FormMessage className="text-red-300 drop-shadow-md" />
        </FormItem>
      )}
    />
  );
}
