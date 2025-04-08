
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { LeaveFormValues, getLeaveTypeById } from '@/utils/leaveTypes';

interface LeaveFormDetailsProps {
  form: UseFormReturn<LeaveFormValues>;
  selectedLeaveType: string | null;
}

export function LeaveFormDetails({ form, selectedLeaveType }: LeaveFormDetailsProps) {
  const currentLeaveType = selectedLeaveType ? getLeaveTypeById(selectedLeaveType) : null;
  
  return (
    <>
      <FormField
        control={form.control}
        name="reason"
        render={({ field }) => (
          <FormItem>
            <FormLabel>請假事由</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="請輸入請假事由" 
                className="resize-none" 
                rows={4}
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Attachment field for leave types that require it */}
      {currentLeaveType?.requiresAttachment && (
        <FormField
          control={form.control}
          name="attachment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>附件上傳</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input 
                    type="file" 
                    className="flex-1" 
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        field.onChange(e.target.files[0]);
                      }
                    }} 
                  />
                </div>
              </FormControl>
              <FormDescription>
                請上傳相關證明文件 (如: 醫師診斷證明、證書等)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}
