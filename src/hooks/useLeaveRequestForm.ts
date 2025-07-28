import { useToast } from '@/hooks/useToast';
import { leaveRequestService } from '@/services/leaveRequestService';
import { LeaveSubmissionData, submitLeaveRequest } from '@/services/leaveSubmissionService';
import { validateAnnualLeave } from '@/services/leaveValidationService';
import { loadUserStaffData, UserStaffData } from '@/services/staffDataService';
import useEmployeeStore from '@/stores/employeeStore';
import { LeaveFormData } from '@/types/leave';
import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInDays } from 'date-fns';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const leaveFormSchema = z
  .object({
    leave_type: z.string().min(1, '請選擇請假類型'),
    start_date: z.date({
      required_error: '請選擇開始日期',
    }),
    end_date: z.date({
      required_error: '請選擇結束日期',
    }),
    reason: z.string().min(1, '請填寫請假原因'),
  })
  .refine(
    data => {
      return data.end_date >= data.start_date;
    },
    {
      message: '結束日期不能早於開始日期',
      path: ['end_date'],
    }
  );

type LeaveFormValues = z.infer<typeof leaveFormSchema>;

export const useLeaveRequestForm = () => {
  const { employee } = useEmployeeStore();
  const { toast } = useToast();

  const [userStaffData, setUserStaffData] = useState<UserStaffData | null>(null);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [userDataError, setUserDataError] = useState<string | null>(null);
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
  const calculatedHours =
    watchedValues.start_date && watchedValues.end_date
      ? (differenceInDays(watchedValues.end_date, watchedValues.start_date) + 1) * 8
      : 0;

  // 載入用戶員工資料
  useEffect(() => {
    const loadData = async () => {
      if (!employee?.slug) {
        console.log('⚠️ 無當前用戶，跳過資料載入');
        setIsLoadingUserData(false);
        setUserDataError('請先登入系統');
        return;
      }

      console.log('🚀 開始載入用戶資料，用戶ID:', employee.slug);
      setIsLoadingUserData(true);
      setUserDataError(null);

      try {
        const data = await loadUserStaffData(employee.slug);
        setUserStaffData(data);
        setUserDataError(null);
        console.log('✅ 用戶資料載入成功');
      } catch (error) {
        console.error('❌ 載入員工資料時發生錯誤:', error);
        const errorMessage = error instanceof Error ? error.message : '載入員工資料失敗';
        setUserDataError(errorMessage);
        setUserStaffData(null);

        // 顯示錯誤提示
        toast({
          title: '資料載入失敗',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsLoadingUserData(false);
      }
    };

    loadData();
  }, [employee?.slug, toast]);

  // 驗證特休申請
  useEffect(() => {
    if (userDataError) {
      setValidationError('人員資料載入失敗，無法驗證請假申請');
      return;
    }

    const error = validateAnnualLeave(watchedValues.leave_type, calculatedHours, userStaffData);
    setValidationError(error);
  }, [watchedValues.leave_type, calculatedHours, userStaffData, userDataError]);

  const handleSubmit = async (data: LeaveFormValues) => {
    if (!employee?.slug) {
      toast({
        title: '錯誤',
        description: '請先登入',
        variant: 'destructive',
      });
      return;
    }

    if (userDataError) {
      toast({
        title: '資料錯誤',
        description: userDataError,
        variant: 'destructive',
      });
      return;
    }

    if (validationError) {
      toast({
        title: '驗證失敗',
        description: validationError,
        variant: 'destructive',
      });
      return;
    }

    if (!userStaffData) {
      toast({
        title: '資料未載入',
        description: '員工資料尚未載入完成，請稍後再試',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    console.log('🚀 開始提交請假申請流程');

    try {
      const submissionData: LeaveSubmissionData = {
        start_date: data.start_date,
        end_date: data.end_date,
        leave_type: data.leave_type,
        reason: data.reason,
      };

      console.log('📋 準備提交的申請資料:', submissionData);
      const result = await submitLeaveRequest(
        submissionData,
        employee.slug,
        calculatedHours,
        userStaffData
      );

      if (result.autoApproved) {
        console.log('✅ 自動核准流程完成');
        form.reset();

        toast({
          title: '申請成功',
          description: '請假申請已送出並自動核准',
        });
      } else {
        // 需要人工審核的流程
        console.log('📝 開始人工審核流程');

        // Convert LeaveRequestData to the format expected by leaveRequestService
        const leaveFormData: LeaveFormData = {
          start_date: data.start_date,
          end_date: data.end_date,
          leave_type: data.leave_type as 'annual' | 'sick' | 'personal' | 'other',
          reason: data.reason,
        };

        await leaveRequestService.submitLeaveRequest(leaveFormData);

        toast({
          title: '申請成功',
          description: '請假申請已送出，等待主管審核',
        });
      }
    } catch (error) {
      console.error('❌ 提交請假申請失敗:', error);

      // 檢查是否為 RLS 相關錯誤
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (
        errorMessage.includes('row-level security') ||
        errorMessage.includes('RLS') ||
        errorMessage.includes('permission denied')
      ) {
        toast({
          title: '權限錯誤',
          description: '提交申請時發生權限問題，請聯繫系統管理員',
          variant: 'destructive',
        });
      } else if (errorMessage.includes('violates')) {
        toast({
          title: '資料驗證錯誤',
          description: '請檢查申請資料是否正確填寫',
          variant: 'destructive',
        });
      } else {
        toast({
          title: '申請失敗',
          description: '提交請假申請時發生錯誤，請稍後再試',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    employee,
    userStaffData,
    isLoadingUserData,
    userDataError,
    calculatedHours,
    isSubmitting,
    validationError,
    handleSubmit,
  };
};
