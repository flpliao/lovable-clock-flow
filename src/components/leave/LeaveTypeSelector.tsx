
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
          <FormLabel className="text-gray-700 font-medium">請假類型</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-white border-gray-300 hover:bg-gray-50">
                <SelectValue placeholder="選擇請假類型" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white border shadow-lg rounded-lg">
              {LEAVE_TYPES.map((type) => (
                <SelectItem 
                  key={type.id} 
                  value={type.id}
                  className="hover:bg-gray-50 focus:bg-gray-50"
                >
                  {type.name}{' '}
                  {!type.isPaid && <span className="text-gray-500 text-xs">(無薪)</span>}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentLeaveType && (
            <FormDescription className="text-gray-600">
              {currentLeaveType.description}
              {currentLeaveType.maxDaysPerYear && (
                <span> (每年上限 {currentLeaveType.maxDaysPerYear} 天)</span>
              )}
            </FormDescription>
          )}
          <FormMessage className="text-red-500" />
        </FormItem>
      )}
    />
  );
}
