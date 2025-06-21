
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser } from '@/contexts/UserContext';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { calculateAnnualLeaveDays, formatYearsOfService, calculateWorkDays } from '@/utils/annualLeaveCalculator';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const [userStaffData, setUserStaffData] = useState<{
    name: string;
    department: string;
    position: string;
    hire_date: string | null;
    yearsOfService: string;
    totalAnnualLeaveDays: number;
    usedAnnualLeaveDays: number;
    remainingAnnualLeaveDays: number;
  } | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

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

  // 載入使用者人員資料與特休資訊
  useEffect(() => {
    const loadUserStaffData = async () => {
      if (!currentUser?.id) {
        console.log('No current user, skipping staff data load');
        setUserStaffData(null);
        setIsLoadingUserData(false);
        return;
      }

      try {
        setIsLoadingUserData(true);
        console.log('Loading staff data for user:', currentUser.id);
        
        // 從 staff 表查詢使用者的完整人員資料
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('name, department, position, hire_date')
          .eq('id', currentUser.id)
          .maybeSingle();

        if (staffError) {
          console.error('查詢人員資料失敗:', staffError);
          setUserStaffData(null);
          setIsLoadingUserData(false);
          return;
        }

        if (!staffData) {
          console.log('找不到使用者的人員資料');
          setUserStaffData(null);
          setIsLoadingUserData(false);
          return;
        }

        console.log('人員資料:', staffData);

        // 如果沒有入職日期，設定基本資料但不計算特休
        if (!staffData.hire_date) {
          setUserStaffData({
            name: staffData.name,
            department: staffData.department,
            position: staffData.position,
            hire_date: null,
            yearsOfService: '未設定',
            totalAnnualLeaveDays: 0,
            usedAnnualLeaveDays: 0,
            remainingAnnualLeaveDays: 0,
          });
          setIsLoadingUserData(false);
          return;
        }

        // 計算年資和特休天數
        const hireDate = new Date(staffData.hire_date);
        const totalDays = calculateAnnualLeaveDays(hireDate);
        const yearsOfService = formatYearsOfService(hireDate);
        
        // 計算已使用的特休天數（從已核准的特別休假記錄統計）
        const currentYear = new Date().getFullYear();
        const { data: leaveData, error: leaveError } = await supabase
          .from('leave_requests')
          .select('hours')
          .eq('user_id', currentUser.id)
          .eq('leave_type', 'annual')
          .eq('status', 'approved')
          .gte('start_date', `${currentYear}-01-01`)
          .lte('start_date', `${currentYear}-12-31`);

        if (leaveError) {
          console.error('查詢請假記錄失敗:', leaveError);
        }

        const usedHours = (leaveData || []).reduce((total, record) => total + Number(record.hours), 0);
        const usedDays = usedHours / 8;
        const remainingDays = Math.max(0, totalDays - usedDays);

        setUserStaffData({
          name: staffData.name,
          department: staffData.department,
          position: staffData.position,
          hire_date: staffData.hire_date,
          yearsOfService,
          totalAnnualLeaveDays: totalDays,
          usedAnnualLeaveDays: usedDays,
          remainingAnnualLeaveDays: remainingDays,
        });

        console.log('特休資訊計算完成:', {
          yearsOfService,
          totalDays,
          usedDays,
          remainingDays
        });

      } catch (error) {
        console.error('載入人員資料失敗:', error);
        setUserStaffData(null);
      } finally {
        setIsLoadingUserData(false);
      }
    };

    loadUserStaffData();
  }, [currentUser?.id]);

  // 驗證特休餘額
  const validateAnnualLeave = () => {
    if (watchedValues.leave_type === 'annual' && userStaffData) {
      // 檢查是否已設定入職日期
      if (!userStaffData.hire_date) {
        return '尚未設定入職日期，無法申請特別休假。請至人員資料設定入職日期。';
      }
      
      const requestedDays = calculatedHours / 8;
      if (requestedDays > userStaffData.remainingAnnualLeaveDays) {
        return `特休餘額不足，您剩餘 ${userStaffData.remainingAnnualLeaveDays} 天，請重新調整請假時段`;
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
    userStaffData,
    isLoadingUserData,
    calculatedHours,
    isSubmitting,
    validationError: validateAnnualLeave(),
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}
