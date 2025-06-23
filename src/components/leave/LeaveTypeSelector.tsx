
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { LeaveFormValues } from '@/utils/leaveTypes';
import { LeaveTypeService } from '@/services/payroll/leaveTypeService';

interface LeaveType {
  id: string;
  code: string;
  name_zh: string;
  name_en: string;
  is_paid: boolean;
  max_days_per_year?: number;
  description?: string;
}

interface LeaveTypeSelectorProps {
  form: UseFormReturn<LeaveFormValues>;
  selectedLeaveType: string | null;
}

export function LeaveTypeSelector({ form, selectedLeaveType }: LeaveTypeSelectorProps) {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaveTypes();
  }, []);

  const loadLeaveTypes = async () => {
    try {
      const data = await LeaveTypeService.getActiveLeaveTypes();
      setLeaveTypes(data || []);
    } catch (error) {
      console.error('載入假別失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentLeaveType = leaveTypes.find(type => type.code === selectedLeaveType);

  return (
    <FormField
      control={form.control}
      name="leave_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium">請假類型</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
            <FormControl>
              <SelectTrigger className="bg-white border-gray-300 hover:bg-gray-50">
                <SelectValue placeholder={loading ? "載入中..." : "選擇請假類型"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-white border shadow-lg rounded-lg">
              {leaveTypes.map((type) => (
                <SelectItem 
                  key={type.id} 
                  value={type.code}
                  className="hover:bg-gray-50 focus:bg-gray-50"
                >
                  {type.name_zh}{' '}
                  {!type.is_paid && <span className="text-gray-500 text-xs">(無薪)</span>}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {currentLeaveType && (
            <FormDescription className="text-gray-600">
              {currentLeaveType.description}
              {currentLeaveType.max_days_per_year && (
                <span> (每年上限 {currentLeaveType.max_days_per_year} 天)</span>
              )}
              {!currentLeaveType.is_paid && (
                <span className="text-orange-600 font-medium"> • 此為無薪假</span>
              )}
            </FormDescription>
          )}
          <FormMessage className="text-red-500" />
        </FormItem>
      )}
    />
  );
}
