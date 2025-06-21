
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '@/contexts/UserContext';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { calculateAnnualLeaveDays, formatYearsOfService, calculateWorkDays } from '@/utils/annualLeaveCalculator';
import { toast } from '@/components/ui/use-toast';

// 請假表單驗證 schema
const leaveRequestSchema = z.object({
  leave_type: z.string().min(1, '請選擇請假類型'),
  start_date: z.date({ required_error: '請選擇開始日期' }),
  end_date: z.date({ required_error: '請選擇結束日期' }),
  reason: z.string().min(1, '請輸入請假事由'),
  attachment: z.any().optional(),
}).refine((data) => data.end_date >= data.start_date, {
  message: '結束日期不能早於開始日期',
  path: ['end_date'],
});

export type LeaveRequestFormData = z.infer<typeof leaveRequestSchema>;

export function useLeaveRequestForm() {
  const { currentUser } = useUser();
  const { createLeaveRequest } = useLeaveManagementContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [annualLeaveBalance, setAnnualLeaveBalance] = useState<{
    totalDays: number;
    usedDays: number;
    remainingDays: number;
    yearsOfService: string;
  } | null>(null);

  const form = useForm<LeaveRequestFormData>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      reason: '',
    },
  });

  const watchedValues = form.watch();
  
  // 計算請假時數
  const calculatedHours = useMemo(() => {
    if (watchedValues.start_date && watchedValues.end_date) {
      const workDays = calculateWorkDays(watchedValues.start_date, watchedValues.end_date);
      return workDays * 8; // 每工作日8小時
    }
    return 0;
  }, [watchedValues.start_date, watchedValues.end_date]);

  // 載入年假餘額資料
  useEffect(() => {
    if (!currentUser || !currentUser.hire_date) {
      setAnnualLeaveBalance(null);
      return;
    }

    const hireDate = new Date(currentUser.hire_date);
    const totalDays = calculateAnnualLeaveDays(hireDate);
    const yearsOfService = formatYearsOfService(hireDate);
    
    // TODO: 從請假記錄計算已使用天數
    // 這裡暫時設為0，實際應從已核准的特休請假記錄統計
    const usedDays = 0;
    const remainingDays = totalDays - usedDays;

    setAnnualLeaveBalance({
      totalDays,
      usedDays,
      remainingDays,
      yearsOfService,
    });
  }, [currentUser]);

  // 驗證特休餘額
  const validateAnnualLeave = () => {
    if (watchedValues.leave_type === 'annual' && annualLeaveBalance) {
      const requestedDays = calculatedHours / 8;
      if (requestedDays > annualLeaveBalance.remainingDays) {
        return `特休餘額不足，您剩餘 ${annualLeaveBalance.remainingDays} 天，請重新調整請假時數`;
      }
    }
    return null;
  };

  // 提交表單
  const handleSubmit = async (data: LeaveRequestFormData) => {
    if (!currentUser) return;

    // 驗證特休餘額
    const validationError = validateAnnualLeave();
    if (validationError) {
      toast({
        title: '申請失敗',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const leaveRequest = {
        id: '',
        user_id: currentUser.id,
        start_date: data.start_date.toISOString().split('T')[0],
        end_date: data.end_date.toISOString().split('T')[0],
        leave_type: data.leave_type as any,
        status: 'pending' as const,
        hours: calculatedHours,
        reason: data.reason,
        approval_level: 1,
        current_approver: 'mock-approver-id', // TODO: 從審核流程取得
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        approvals: [{
          id: `${Date.now()}`,
          leave_request_id: '',
          approver_id: 'mock-approver-id',
          approver_name: '主管',
          status: 'pending' as const,
          level: 1
        }]
      };

      const success = await createLeaveRequest(leaveRequest);
      
      if (success) {
        toast({
          title: '申請成功',
          description: '請假申請已送出，等待主管審核',
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: '申請失敗',
        description: '請檢查網路連線後重試',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    currentUser,
    annualLeaveBalance,
    calculatedHours,
    isSubmitting,
    validationError: validateAnnualLeave(),
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}
