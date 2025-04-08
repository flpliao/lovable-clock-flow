
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LEAVE_TYPES, getLeaveTypeById } from '@/utils/leaveTypes';
import { UseFormReturn } from 'react-hook-form';
import { LeaveFormValues } from '@/utils/leaveTypes';

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
          <FormLabel>請假類型</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="選擇請假類型" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {LEAVE_TYPES.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}{' '}
                  {!type.isPaid && <span className="text-gray-400 text-xs">(無薪)</span>}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentLeaveType && (
            <FormDescription>
              {currentLeaveType.description}
              {currentLeaveType.maxDaysPerYear && (
                <span> (每年上限 {currentLeaveType.maxDaysPerYear} 天)</span>
              )}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
