
import React, { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UseFormReturn } from 'react-hook-form';
import { LeaveFormValues } from '@/utils/leaveTypes';
import { LeaveTypeService } from '@/services/payroll/leaveTypeService';
import { AlertTriangle, FileText, DollarSign } from 'lucide-react';

interface LeaveType {
  id: string;
  code: string;
  name_zh: string;
  name_en: string;
  is_paid: boolean;
  max_days_per_year?: number;
  requires_attachment: boolean;
  description?: string;
}

interface LeaveTypeSelectorProps {
  form: UseFormReturn<LeaveFormValues>;
  selectedLeaveType: string | null;
  calculatedDays?: number;
}

export function LeaveTypeSelector({ form, selectedLeaveType, calculatedDays = 0 }: LeaveTypeSelectorProps) {
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
  
  // 驗證假別天數限制
  const validateDaysLimit = () => {
    if (!currentLeaveType || !currentLeaveType.max_days_per_year || !calculatedDays) {
      return null;
    }
    
    if (calculatedDays > currentLeaveType.max_days_per_year) {
      return `超過該假別年度上限（${currentLeaveType.max_days_per_year}天），請調整申請天數`;
    }
    
    return null;
  };

  const daysLimitError = validateDaysLimit();

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="leave_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-white font-medium drop-shadow-sm">請假類型</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
              <FormControl>
                <SelectTrigger className="bg-white/20 border-white/30 text-white placeholder:text-white/60 backdrop-blur-sm">
                  <SelectValue placeholder={loading ? "載入中..." : "選擇請假類型"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white/95 backdrop-blur-xl border border-white/40 shadow-xl rounded-xl z-50">
                {leaveTypes.map((type) => (
                  <SelectItem 
                    key={type.id} 
                    value={type.code}
                    className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-medium text-slate-800">{type.name_zh}</span>
                      <div className="flex items-center gap-1 ml-2">
                        {!type.is_paid && (
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                            無薪
                          </span>
                        )}
                        {type.requires_attachment && (
                          <FileText className="h-3 w-3 text-blue-600" />
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage className="text-red-200" />
          </FormItem>
        )}
      />

      {/* 假別詳細資訊與提示 */}
      {currentLeaveType && (
        <div className="space-y-3">
          {/* 基本資訊 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-white font-medium">假別資訊</span>
              </div>
              
              {currentLeaveType.description && (
                <p className="text-white/80 text-sm">{currentLeaveType.description}</p>
              )}
              
              {currentLeaveType.max_days_per_year && (
                <p className="text-white/80 text-sm">
                  年度上限：{currentLeaveType.max_days_per_year} 天
                </p>
              )}
            </div>
          </div>

          {/* 無薪假提示 */}
          {!currentLeaveType.is_paid && (
            <Alert className="bg-orange-500/20 border-orange-300/30 backdrop-blur-sm">
              <DollarSign className="h-4 w-4 text-orange-300" />
              <AlertDescription className="text-orange-100 font-medium">
                此為無薪假別，請假期間不給薪
              </AlertDescription>
            </Alert>
          )}

          {/* 附件需求提示 */}
          {currentLeaveType.requires_attachment && (
            <Alert className="bg-blue-500/20 border-blue-300/30 backdrop-blur-sm">
              <FileText className="h-4 w-4 text-blue-300" />
              <AlertDescription className="text-blue-100 font-medium">
                此假別需要上傳相關證明文件
              </AlertDescription>
            </Alert>
          )}

          {/* 天數超限錯誤提示 */}
          {daysLimitError && (
            <Alert className="bg-red-500/20 border-red-300/30 backdrop-blur-sm">
              <AlertTriangle className="h-4 w-4 text-red-300" />
              <AlertDescription className="text-red-100 font-medium">
                {daysLimitError}
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
