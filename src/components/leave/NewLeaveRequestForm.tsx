
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { LeaveFormValues, leaveFormSchema } from '@/utils/leaveTypes';
import { LeaveRequestFormFields } from './LeaveRequestFormFields';
import { LeaveTypeDetailCard } from './LeaveTypeDetailCard';
import { calculateWorkingHours } from '@/utils/workingHoursCalculator';
import { validateLeaveRequest } from '@/utils/leaveValidation';
import { datePickerToDatabase } from '@/utils/dateUtils';
import { differenceInDays, format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface NewLeaveRequestFormProps {
  onSubmit?: () => void;
}

export function NewLeaveRequestForm({ onSubmit }: NewLeaveRequestFormProps) {
  const { toast } = useToast();
  const { currentUser } = useUser();
  const { createLeaveRequest } = useLeaveManagementContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedHours, setCalculatedHours] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      leave_type: '',
      start_date: undefined,
      end_date: undefined,
      reason: ''
    }
  });

  const watchedStartDate = form.watch('start_date');
  const watchedEndDate = form.watch('end_date');
  const watchedLeaveType = form.watch('leave_type');

  // 計算請假時數
  useEffect(() => {
    if (watchedStartDate && watchedEndDate) {
      const hours = calculateWorkingHours(watchedStartDate, watchedEndDate);
      setCalculatedHours(hours);
      console.log('計算請假時數:', {
        startDate: watchedStartDate,
        endDate: watchedEndDate,
        calculatedHours: hours
      });
    } else {
      setCalculatedHours(0);
    }
  }, [watchedStartDate, watchedEndDate]);

  // 驗證請假申請
  useEffect(() => {
    const validateRequest = async () => {
      if (watchedStartDate && watchedEndDate && watchedLeaveType && currentUser) {
        try {
          console.log('開始驗證請假申請:', {
            leaveType: watchedLeaveType,
            startDate: watchedStartDate,
            endDate: watchedEndDate,
            hours: calculatedHours,
            userId: currentUser.id
          });

          const validation = await validateLeaveRequest({
            leave_type: watchedLeaveType,
            start_date: watchedStartDate,
            end_date: watchedEndDate,
            hours: calculatedHours,
            user_id: currentUser.id
          });

          if (!validation.isValid) {
            setValidationError(validation.message);
            console.log('驗證失敗:', validation.message);
          } else {
            setValidationError(null);
            console.log('驗證通過');
          }
        } catch (error) {
          console.error('驗證過程發生錯誤:', error);
          setValidationError('驗證過程發生錯誤，請稍後再試');
        }
      } else {
        setValidationError(null);
      }
    };

    if (calculatedHours > 0) {
      validateRequest();
    }
  }, [watchedStartDate, watchedEndDate, watchedLeaveType, calculatedHours, currentUser]);

  // 模擬剩餘假期天數和已使用天數 (實際應該從後端獲取)
  const getLeaveData = (leaveType: string) => {
    const mockData: Record<string, { remainingDays?: number; usedDays: number }> = {
      'annual': { remainingDays: 10, usedDays: 5 },
      'sick': { remainingDays: 27, usedDays: 3 },
      'personal': { remainingDays: 12, usedDays: 2 },
      'marriage': { remainingDays: 8, usedDays: 0 },
      'bereavement': { remainingDays: 8, usedDays: 0 },
      'maternity': { remainingDays: 56, usedDays: 0 },
      'paternity': { remainingDays: 7, usedDays: 0 },
      'menstrual': { remainingDays: 10, usedDays: 2 },
      'occupational': { usedDays: 0 },
      'parental': { usedDays: 0 },
      'other': { usedDays: 0 }
    };
    
    return mockData[leaveType] || { usedDays: 0 };
  };

  const handleSubmit = async (data: LeaveFormValues) => {
    if (!currentUser) {
      toast({
        title: "錯誤",
        description: "請先登入系統",
        variant: "destructive"
      });
      return;
    }

    if (validationError) {
      toast({
        title: "申請失敗",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    if (calculatedHours <= 0) {
      toast({
        title: "申請失敗", 
        description: "請選擇有效的請假日期",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      console.log('提交請假申請:', {
        originalData: data,
        calculatedHours,
        currentUser: currentUser.id
      });

      // 使用修正的日期轉換函式
      const startDateStr = datePickerToDatabase(data.start_date);
      const endDateStr = datePickerToDatabase(data.end_date);

      console.log('轉換後的日期:', {
        startDate: startDateStr,
        endDate: endDateStr
      });

      const leaveRequest = {
        id: '', // 會由資料庫自動生成
        user_id: currentUser.id,
        start_date: startDateStr,
        end_date: endDateStr,
        leave_type: data.leave_type as any,
        status: 'pending' as const,
        hours: calculatedHours,
        reason: data.reason,
        approval_level: 1,
        current_approver: currentUser.supervisor_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('準備建立請假申請:', leaveRequest);

      const success = await createLeaveRequest(leaveRequest);
      
      if (success) {
        toast({
          title: "申請成功",
          description: "請假申請已提交，等待審核",
        });
        
        // 重置表單
        form.reset();
        setCalculatedHours(0);
        setValidationError(null);
        
        // 呼叫回調函式
        if (onSubmit) {
          onSubmit();
        }
      }
    } catch (error) {
      console.error('提交請假申請失敗:', error);
      toast({
        title: "申請失敗",
        description: "提交請假申請時發生錯誤",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 檢查是否有入職日期
  const hasHireDate = Boolean(currentUser?.hire_date);

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <LeaveRequestFormFields 
            form={form}
            calculatedHours={calculatedHours}
            validationError={validationError}
            hasHireDate={hasHireDate}
          />
          
          {/* 請假類型詳細資訊卡片 - 當選擇了請假類型時顯示 */}
          {watchedLeaveType && (
            <LeaveTypeDetailCard 
              leaveType={watchedLeaveType}
              remainingDays={getLeaveData(watchedLeaveType).remainingDays}
              usedDays={getLeaveData(watchedLeaveType).usedDays}
            />
          )}
          
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || validationError !== null || calculatedHours <= 0}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  提交中...
                </>
              ) : (
                '提交申請'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
