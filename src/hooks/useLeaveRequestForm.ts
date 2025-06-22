
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { differenceInDays } from 'date-fns';
import { useUser } from '@/contexts/UserContext';
import { useSupabaseLeaveManagement } from '@/hooks/useSupabaseLeaveManagement';
import { useToast } from '@/hooks/use-toast';
import { loadUserStaffData, UserStaffData } from '@/services/staffDataService';
import { validateAnnualLeave } from '@/services/leaveValidationService';
import { submitLeaveRequest, LeaveSubmissionData } from '@/services/leaveSubmissionService';

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
    const loadData = async () => {
      if (!currentUser?.id) {
        setIsLoadingUserData(false);
        return;
      }

      try {
        const data = await loadUserStaffData(currentUser.id);
        setUserStaffData(data);
      } catch (error) {
        console.error('載入員工資料時發生錯誤:', error);
        setUserStaffData(null);
      } finally {
        setIsLoadingUserData(false);
      }
    };

    loadData();
  }, [currentUser?.id]);

  // 驗證特休申請
  useEffect(() => {
    const error = validateAnnualLeave(watchedValues.leave_type, calculatedHours, userStaffData);
    setValidationError(error);
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
      const submissionData: LeaveSubmissionData = {
        start_date: data.start_date,
        end_date: data.end_date,
        leave_type: data.leave_type,
        reason: data.reason,
      };

      const result = await submitLeaveRequest(submissionData, currentUser.id, calculatedHours, userStaffData);

      if (result.autoApproved) {
        form.reset();
        await refreshData();
        
        toast({
          title: "申請成功",
          description: "✅ 您的請假申請已自動核准（目前無設定直屬主管）",
        });
      } else if (result.leaveRequest) {
        const success = await createLeaveRequest(result.leaveRequest);
        
        if (success) {
          form.reset();
          
          // 根據主管層級顯示不同的提示訊息
          const hasMultipleLevels = userStaffData?.supervisor_id && (await import('@/services/leaveSubmissionService')).getSupervisorHierarchy(currentUser.id).then(h => h.length > 1);
          
          const description = hasMultipleLevels 
            ? "✅ 已提交，將依序交由各層主管審核" 
            : "✅ 已提交，等待直屬主管審核中";
            
          toast({
            title: "申請成功",
            description,
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
