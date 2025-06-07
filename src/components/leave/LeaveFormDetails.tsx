
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { LeaveFormValues, getLeaveTypeById } from '@/utils/leaveTypes';
import { visionProStyles } from '@/utils/visionProStyles';

interface LeaveFormDetailsProps {
  form: UseFormReturn<LeaveFormValues>;
  selectedLeaveType: string | null;
}

export function LeaveFormDetails({ form, selectedLeaveType }: LeaveFormDetailsProps) {
  const currentLeaveType = selectedLeaveType ? getLeaveTypeById(selectedLeaveType) : null;
  
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="reason"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white font-medium drop-shadow-md">請假事由</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="請輸入請假事由" 
                className="resize-none backdrop-blur-xl bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-xl hover:bg-white/30 focus:bg-white/30 transition-colors duration-200" 
                rows={4}
                {...field} 
              />
            </FormControl>
            <FormMessage className="text-red-300 drop-shadow-md" />
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
              <FormLabel className="text-white font-medium drop-shadow-md">附件上傳</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input 
                    type="file" 
                    className="flex-1 backdrop-blur-xl bg-white/20 border-white/30 text-white file:bg-white/30 file:text-white file:border-0 file:rounded-lg rounded-xl hover:bg-white/30 transition-colors duration-200" 
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        field.onChange(e.target.files[0]);
                      }
                    }} 
                  />
                </div>
              </FormControl>
              <FormDescription className="text-white/80 font-medium drop-shadow-md">
                請上傳相關證明文件 (如: 醫師診斷證明、證書等)
              </FormDescription>
              <FormMessage className="text-red-300 drop-shadow-md" />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
