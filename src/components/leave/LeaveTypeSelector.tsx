
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { LeaveFormValues } from '@/utils/leaveTypes';
import { LeaveTypeService } from '@/services/payroll/leaveTypeService';
import { LeaveType } from '@/types/hr';
import { useUser } from '@/contexts/UserContext';

interface LeaveTypeSelectorProps {
  form: UseFormReturn<LeaveFormValues>;
  selectedLeaveType: string | null;
}

export function LeaveTypeSelector({ form, selectedLeaveType }: LeaveTypeSelectorProps) {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useUser();

  useEffect(() => {
    const loadLeaveTypes = async () => {
      try {
        const data = await LeaveTypeService.getLeaveTypes();
        setLeaveTypes(data || []);
      } catch (error) {
        console.error('載入請假類型失敗:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaveTypes();
  }, []);

  // 根據用戶性別過濾請假類型
  const getFilteredLeaveTypes = () => {
    if (!currentUser) return leaveTypes;
    
    return leaveTypes.filter(type => {
      // 如果有性別限制，檢查是否符合用戶性別
      if (type.gender_restriction) {
        // 這裡假設用戶資料中有 gender 欄位，實際需要根據系統設計調整
        // 目前先允許所有假別，後續可以加入性別驗證
        return true;
      }
      return true;
    });
  };

  const currentLeaveType = selectedLeaveType ? 
    leaveTypes.find(type => type.code === selectedLeaveType) : null;

  const filteredLeaveTypes = getFilteredLeaveTypes();

  if (loading) {
    return (
      <FormField
        control={form.control}
        name="leave_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700 font-medium">請假類型</FormLabel>
            <FormControl>
              <Select disabled>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="載入中..." />
                </SelectTrigger>
              </Select>
            </FormControl>
            <FormMessage className="text-red-500" />
          </FormItem>
        )}
      />
    );
  }

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
              {filteredLeaveTypes.map((type) => (
                <SelectItem 
                  key={type.id} 
                  value={type.code}
                  className="hover:bg-gray-50 focus:bg-gray-50"
                >
                  {type.name_zh}
                  {!type.is_paid && <span className="text-gray-500 text-xs ml-2">(無薪)</span>}
                  {type.gender_restriction && (
                    <span className="text-blue-500 text-xs ml-2">
                      ({type.gender_restriction === 'female' ? '限女性' : '限男性'})
                    </span>
                  )}
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
              {currentLeaveType.max_days_per_month && (
                <span> (每月上限 {currentLeaveType.max_days_per_month} 天)</span>
              )}
            </FormDescription>
          )}
          <FormMessage className="text-red-500" />
        </FormItem>
      )}
    />
  );
}
