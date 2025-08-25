import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { UserStaffData } from '@/services/staffDataService';
import useDefaultLeaveTypeStore from '@/stores/defaultLeaveTypeStore';

interface LeaveTypeSelectorProps {
  form: UseFormReturn<{
    leave_type: string;
    start_date: Date;
    end_date: Date;
    reason: string;
  }>;
  selectedLeaveType?: string;
  calculatedDays?: number;
  hasHireDate?: boolean;
  userStaffData?: UserStaffData | null;
}

export function LeaveTypeSelector({
  form,
  selectedLeaveType,
  calculatedDays = 0,
  hasHireDate = false,
  userStaffData,
}: LeaveTypeSelectorProps) {
  const { defaultLeaveTypes, isLoading, isLoaded, fetchDefaultLeaveTypes } =
    useDefaultLeaveTypeStore();

  // 載入預設假別類型資料
  useEffect(() => {
    if (!isLoaded && !isLoading) {
      fetchDefaultLeaveTypes().catch(console.error);
    }
  }, [isLoaded, isLoading, fetchDefaultLeaveTypes]);

  // 將 API 資料轉換為 UI 需要的格式，並添加 requiresHireDate 邏輯
  const leaveTypes = defaultLeaveTypes.map(type => ({
    value: type.code.toLowerCase(),
    label: type.name,
    requiresHireDate: type.code === 'ANNUAL', // 只有特休需要入職日期
  }));

  const renderLeaveTypeStatus = (leaveType: string) => {
    if (leaveType === 'annual') {
      if (!hasHireDate) {
        return (
          <div className="mt-2 p-3 bg-orange-500/20 border border-orange-300/30 rounded-lg">
            <div className="flex items-start gap-2 text-orange-100">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">無法申請特別休假</p>
                <p className="text-xs mt-1 text-orange-200">
                  尚未設定入職日期，請聯繫管理員在人員資料中設定您的入職日期後再申請特別休假。
                </p>
              </div>
            </div>
          </div>
        );
      } else if (userStaffData) {
        const remainingDays = userStaffData.remainingAnnualLeaveDays;
        const totalDays = userStaffData.totalAnnualLeaveDays;
        const usedDays = userStaffData.usedAnnualLeaveDays;

        return (
          <div className="mt-2 space-y-2">
            <div className="p-3 bg-green-500/20 border border-green-300/30 rounded-lg">
              <div className="flex items-start gap-2 text-green-100">
                <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">特別休假可申請</p>
                  <p className="text-xs mt-1 text-green-200">
                    年資：{userStaffData.yearsOfService} | 特休餘額：{remainingDays} 天 | 年度總計：
                    {totalDays} 天 | 已使用：{usedDays} 天
                  </p>
                </div>
              </div>
            </div>

            {calculatedDays > 0 && (
              <div className="p-3 bg-blue-500/20 border border-blue-300/30 rounded-lg">
                <div className="flex items-start gap-2 text-blue-100">
                  <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">申請天數檢查</p>
                    <p className="text-xs mt-1 text-blue-200">
                      本次申請：{calculatedDays} 天
                      {calculatedDays > remainingDays ? (
                        <span className="text-red-300 ml-2">（超過餘額 {remainingDays} 天）</span>
                      ) : (
                        <span className="text-green-300 ml-2">（餘額充足）</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="leave_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white font-medium">請假類型</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/60">
                  <SelectValue placeholder="請選擇請假類型" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {leaveTypes.map(type => {
                  const isDisabled = type.requiresHireDate && !hasHireDate;
                  return (
                    <SelectItem key={type.value} value={type.value} disabled={isDisabled}>
                      <div className="flex items-center gap-2">
                        {type.label}
                        {isDisabled && <AlertTriangle className="h-3 w-3 text-orange-500" />}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 顯示選擇的假別狀態 */}
      {selectedLeaveType && renderLeaveTypeStatus(selectedLeaveType)}
    </div>
  );
}
