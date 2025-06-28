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
import { LeaveBalanceCard } from './LeaveBalanceCard';
import { calculateWorkingHours } from '@/utils/workingHoursCalculator';
import { validateLeaveRequest } from '@/utils/leaveValidation';
import { datePickerToDatabase } from '@/utils/dateUtils';
import { calculateAnnualLeaveDays, formatYearsOfService } from '@/utils/annualLeaveCalculator';
import { differenceInDays, format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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
  const [userStaffData, setUserStaffData] = useState<any>(null);
  const [isLoadingStaffData, setIsLoadingStaffData] = useState(true);

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

  // 載入員工資料
  useEffect(() => {
    const loadStaffData = async () => {
      if (!currentUser?.id) {
        console.log('❌ 沒有當前用戶');
        setIsLoadingStaffData(false);
        return;
      }

      console.log('🚀 開始載入員工資料，用戶ID:', currentUser.id);
      setIsLoadingStaffData(true);
      
      try {
        // 修正：使用 user_id 欄位查詢員工資料
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();

        console.log('📋 查詢員工資料結果:', { staffData, staffError });

        if (staffError) {
          console.error('❌ 載入員工資料失敗:', staffError);
          
          if (staffError.code === 'PGRST116') {
            toast({
              title: "員工資料不存在",
              description: "找不到您的員工資料記錄，請聯繫管理員進行帳號設定",
              variant: "destructive"
            });
          } else {
            toast({
              title: "載入失敗",
              description: "無法載入員工資料：" + staffError.message,
              variant: "destructive"
            });
          }
          setUserStaffData(null);
          return;
        }

        if (!staffData) {
          console.log('⚠️ 找不到員工資料');
          toast({
            title: "員工資料不存在",
            description: "找不到您的員工資料記錄，請聯繫管理員確認帳號設定",
            variant: "destructive"
          });
          setUserStaffData(null);
          return;
        }

        const hireDate = staffData.hire_date;
        console.log('📅 入職日期:', hireDate);
        
        // 計算年資和特休天數
        let yearsOfService = '未設定';
        let totalAnnualLeaveDays = 0;
        let usedAnnualLeaveDays = 0;
        let remainingAnnualLeaveDays = 0;

        if (hireDate) {
          const hireDateObj = new Date(hireDate);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - hireDateObj.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const years = Math.floor(diffDays / 365);
          const months = Math.floor((diffDays % 365) / 30);
          
          yearsOfService = years > 0 ? 
            (months > 0 ? `${years}年${months}個月` : `${years}年`) : 
            `${months}個月`;

          // 計算特休天數
          totalAnnualLeaveDays = calculateAnnualLeaveDays(hireDateObj);
          console.log('📊 計算的特休天數:', totalAnnualLeaveDays);

          // 計算已使用的特休天數 - 修正查詢邏輯
          const currentYear = new Date().getFullYear();
          const { data: leaveRecords, error: leaveError } = await supabase
            .from('leave_requests')
            .select('hours')
            .eq('user_id', currentUser.id)
            .eq('leave_type', 'annual')
            .eq('status', 'approved')
            .gte('start_date', `${currentYear}-01-01`)
            .lte('start_date', `${currentYear}-12-31`);

          if (!leaveError && leaveRecords) {
            usedAnnualLeaveDays = leaveRecords.reduce((total, record) => {
              return total + (Number(record.hours) / 8);
            }, 0);
          }
          console.log('📈 已使用特休天數:', usedAnnualLeaveDays);

          remainingAnnualLeaveDays = Math.max(0, totalAnnualLeaveDays - usedAnnualLeaveDays);
          console.log('📉 剩餘特休天數:', remainingAnnualLeaveDays);
        }

        // 設定完整的員工資料
        const completeStaffData = {
          name: staffData.name,
          department: staffData.department,
          position: staffData.position,
          hire_date: hireDate,
          supervisor_id: staffData.supervisor_id,
          yearsOfService,
          totalAnnualLeaveDays,
          usedAnnualLeaveDays,
          remainingAnnualLeaveDays
        };

        console.log('✅ 完整員工資料:', completeStaffData);
        setUserStaffData(completeStaffData);

      } catch (error) {
        console.error('❌ 載入員工資料時發生錯誤:', error);
        toast({
          title: "載入錯誤",
          description: "載入員工資料時發生系統錯誤，請稍後再試或聯繫管理員",
          variant: "destructive"
        });
        setUserStaffData(null);
      } finally {
        setIsLoadingStaffData(false);
      }
    };

    loadStaffData();
  }, [currentUser?.id, toast]);

  // 計算請假時數
  useEffect(() => {
    if (watchedStartDate && watchedEndDate) {
      const hours = calculateWorkingHours(watchedStartDate, watchedEndDate);
      setCalculatedHours(hours);
      console.log('⏰ 計算請假時數:', hours);
    } else {
      setCalculatedHours(0);
    }
  }, [watchedStartDate, watchedEndDate]);

  // 驗證請假申請
  useEffect(() => {
    const validateRequest = async () => {
      if (watchedStartDate && watchedEndDate && watchedLeaveType && currentUser) {
        try {
          console.log('🔍 開始驗證請假申請');

          const validation = await validateLeaveRequest({
            leave_type: watchedLeaveType,
            start_date: watchedStartDate,
            end_date: watchedEndDate,
            hours: calculatedHours,
            user_id: currentUser.id
          });

          if (!validation.isValid) {
            setValidationError(validation.message);
            console.log('❌ 驗證失敗:', validation.message);
          } else {
            setValidationError(null);
            console.log('✅ 驗證通過');
          }
        } catch (error) {
          console.error('❌ 驗證過程發生錯誤:', error);
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

  // 根據請假類型獲取假期資料
  const getLeaveData = (leaveType: string) => {
    if (leaveType === 'annual' && userStaffData) {
      return {
        remainingDays: userStaffData.remainingAnnualLeaveDays,
        usedDays: userStaffData.usedAnnualLeaveDays
      };
    }

    // 其他假期類型的模擬資料
    const mockData: Record<string, { remainingDays?: number; usedDays: number }> = {
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
      
      console.log('📝 提交請假申請:', data);

      const startDateStr = datePickerToDatabase(data.start_date);
      const endDateStr = datePickerToDatabase(data.end_date);

      const leaveRequest = {
        id: '',
        user_id: currentUser.id,
        start_date: startDateStr,
        end_date: endDateStr,
        leave_type: data.leave_type as any,
        status: 'pending' as const,
        hours: calculatedHours,
        reason: data.reason,
        approval_level: 1,
        current_approver: userStaffData?.supervisor_id || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('📋 準備建立請假申請:', leaveRequest);

      const success = await createLeaveRequest(leaveRequest);
      
      if (success) {
        toast({
          title: "申請成功",
          description: "請假申請已提交，等待審核",
        });
        
        form.reset();
        setCalculatedHours(0);
        setValidationError(null);
        
        if (onSubmit) {
          onSubmit();
        }
      }
    } catch (error) {
      console.error('❌ 提交請假申請失敗:', error);
      toast({
        title: "申請失敗",
        description: "提交請假申請時發生錯誤",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasHireDate = Boolean(userStaffData?.hire_date);

  return (
    <div className="space-y-6">
      {/* 員工資料和特休餘額顯示 */}
      <LeaveBalanceCard 
        userStaffData={userStaffData}
        hasHireDate={hasHireDate}
        isLoading={isLoadingStaffData}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <LeaveRequestFormFields 
            form={form}
            calculatedHours={calculatedHours}
            validationError={validationError}
            hasHireDate={hasHireDate}
            userStaffData={userStaffData}
          />
          
          {/* 請假類型詳細資訊卡片 */}
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
