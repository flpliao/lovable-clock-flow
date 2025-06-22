
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, differenceInDays } from 'date-fns';
import { useUser } from '@/contexts/UserContext';
import { useSupabaseLeaveManagement } from '@/hooks/useSupabaseLeaveManagement';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const leaveFormSchema = z.object({
  leave_type: z.string().min(1, '請選擇請假類型'),
  start_date: z.date({
    required_error: '請選擇開始日期',
  }),
  end_date: z.date({
    required_error: '請選擇結束日期',
  }),
  reason: z.string().min(1, '請填寫請假原因'),
}).refine((data) => {
  return data.end_date >= data.start_date;
}, {
  message: '結束日期不能早於開始日期',
  path: ['end_date'],
});

type LeaveFormValues = z.infer<typeof leaveFormSchema>;

interface UserStaffData {
  name: string;
  department: string;
  position: string;
  hire_date: string | null;
  supervisor_id: string | null;
  yearsOfService: string;
  totalAnnualLeaveDays: number;
  usedAnnualLeaveDays: number;
  remainingAnnualLeaveDays: number;
}

export const useLeaveRequestForm = () => {
  const { currentUser } = useUser();
  const { toast } = useToast();
  const { createLeaveRequest, refreshData } = useSupabaseLeaveManagement();
  
  const [userStaffData, setUserStaffData] = useState<UserStaffData | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const form = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveFormSchema),
    defaultValues: {
      reason: '',
    },
  });

  const watchedValues = form.watch();
  
  // 計算請假時數
  const calculatedHours = watchedValues.start_date && watchedValues.end_date 
    ? (differenceInDays(watchedValues.end_date, watchedValues.start_date) + 1) * 8
    : 0;

  // 載入用戶員工資料
  useEffect(() => {
    const loadUserStaffData = async () => {
      if (!currentUser?.id) {
        setIsLoadingUserData(false);
        return;
      }

      try {
        console.log('Loading staff data for user:', currentUser.id);
        
        // 從 staff 表獲取員工資料（包含 supervisor_id）
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('name, department, position, hire_date, supervisor_id')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (staffError) {
          console.error('載入員工資料失敗:', staffError);
          setUserStaffData(null);
          return;
        }

        if (!staffData) {
          console.log('找不到員工資料');
          setUserStaffData(null);
          return;
        }

        // 計算年資
        let yearsOfService = '0年';
        let totalAnnualLeaveDays = 0;
        
        if (staffData.hire_date) {
          const hireDate = new Date(staffData.hire_date);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - hireDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          const years = Math.floor(diffDays / 365);
          const months = Math.floor((diffDays % 365) / 30);
          
          if (years > 0) {
            yearsOfService = months > 0 ? `${years}年${months}個月` : `${years}年`;
          } else {
            yearsOfService = `${months}個月`;
          }

          // 根據年資計算特休天數
          if (years >= 10) {
            totalAnnualLeaveDays = Math.min(30, 15 + (years - 10) + 1);
          } else if (years >= 5) {
            totalAnnualLeaveDays = 15;
          } else if (years >= 3) {
            totalAnnualLeaveDays = 14;
          } else if (years >= 2) {
            totalAnnualLeaveDays = 10;
          } else if (years >= 1) {
            totalAnnualLeaveDays = 7;
          } else if (diffDays >= 180) {
            totalAnnualLeaveDays = 3;
          }
        }

        // 計算已使用的特休天數
        const currentYear = new Date().getFullYear();
        const { data: leaveRecords, error: leaveError } = await supabase
          .from('leave_requests')
          .select('hours')
          .eq('user_id', currentUser.id)
          .eq('leave_type', 'annual')
          .eq('status', 'approved')
          .gte('start_date', `${currentYear}-01-01`)
          .lte('start_date', `${currentYear}-12-31`);

        let usedAnnualLeaveDays = 0;
        if (!leaveError && leaveRecords) {
          usedAnnualLeaveDays = leaveRecords.reduce((total, record) => {
            return total + (Number(record.hours) / 8);
          }, 0);
        }

        const remainingAnnualLeaveDays = Math.max(0, totalAnnualLeaveDays - usedAnnualLeaveDays);

        setUserStaffData({
          name: staffData.name,
          department: staffData.department,
          position: staffData.position,
          hire_date: staffData.hire_date,
          supervisor_id: staffData.supervisor_id,
          yearsOfService,
          totalAnnualLeaveDays,
          usedAnnualLeaveDays,
          remainingAnnualLeaveDays,
        });

      } catch (error) {
        console.error('載入員工資料時發生錯誤:', error);
        setUserStaffData(null);
      } finally {
        setIsLoadingUserData(false);
      }
    };

    loadUserStaffData();
  }, [currentUser?.id]);

  // 驗證特休申請
  useEffect(() => {
    if (watchedValues.leave_type === 'annual' && userStaffData && calculatedHours > 0) {
      const requestDays = calculatedHours / 8;
      if (requestDays > userStaffData.remainingAnnualLeaveDays) {
        setValidationError(`特休餘額不足！您的剩餘特休天數為 ${userStaffData.remainingAnnualLeaveDays} 天，但申請了 ${requestDays} 天。`);
      } else {
        setValidationError(null);
      }
    } else if (watchedValues.leave_type === 'annual' && userStaffData && !userStaffData.hire_date) {
      setValidationError('尚未設定入職日期，無法申請特別休假。');
    } else {
      setValidationError(null);
    }
  }, [watchedValues.leave_type, calculatedHours, userStaffData]);

  const handleSubmit = async (data: LeaveFormValues) => {
    if (!currentUser?.id) {
      toast({
        title: "錯誤",
        description: "請先登入",
        variant: "destructive"
      });
      return;
    }

    if (validationError) {
      toast({
        title: "驗證失敗",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 檢查是否有直屬主管
      const hasSupervisor = userStaffData?.supervisor_id && userStaffData.supervisor_id.trim() !== '';
      const shouldAutoApprove = !hasSupervisor;

      const leaveRequest = {
        id: '',
        user_id: currentUser.id,
        staff_id: currentUser.id,
        start_date: format(data.start_date, 'yyyy-MM-dd'),
        end_date: format(data.end_date, 'yyyy-MM-dd'),
        leave_type: data.leave_type as any,
        status: shouldAutoApprove ? 'approved' : 'pending' as const,
        hours: calculatedHours,
        reason: data.reason,
        approval_level: shouldAutoApprove ? 0 : 1,
        current_approver: shouldAutoApprove ? null : userStaffData?.supervisor_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // 如果自動核准，需要額外處理核准資訊
      if (shouldAutoApprove) {
        const { data: insertedData, error: insertError } = await supabase
          .from('leave_requests')
          .insert({
            ...leaveRequest,
            approved_at: new Date().toISOString(),
            approved_by: 'system'
          })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        form.reset();
        await refreshData();
        
        toast({
          title: "申請成功",
          description: "✅ 您的請假申請已自動核准（目前無設定直屬主管）",
        });
      } else {
        const success = await createLeaveRequest(leaveRequest);
        
        if (success) {
          form.reset();
          toast({
            title: "申請成功",
            description: "✅ 已提交，等待主管審核中",
          });
        }
      }
    } catch (error) {
      console.error('提交請假申請失敗:', error);
      toast({
        title: "申請失敗",
        description: "無法提交請假申請，請稍後再試",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    currentUser,
    userStaffData,
    isLoadingUserData,
    calculatedHours,
    isSubmitting,
    validationError,
    handleSubmit,
  };
};
