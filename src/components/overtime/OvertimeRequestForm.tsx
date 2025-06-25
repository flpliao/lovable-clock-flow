
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { overtimeSubmissionService } from '@/services/overtime/overtimeSubmissionService';
import { calculateOvertimeHours } from '@/utils/overtimeUtils';
import { loadUserStaffData } from '@/services/staffDataService';
import OvertimeFormHeader from './components/OvertimeFormHeader';
import OvertimeBasicInfoSection from './components/OvertimeBasicInfoSection';
import OvertimeTimeSection from './components/OvertimeTimeSection';
import OvertimeCompensationSection from './components/OvertimeCompensationSection';
import OvertimeReasonSection from './components/OvertimeReasonSection';
import OvertimeSubmitSection from './components/OvertimeSubmitSection';

const OvertimeRequestForm: React.FC = () => {
  const { currentUser } = useUser();
  const [formData, setFormData] = useState({
    overtimeDate: '',
    startTime: '',
    endTime: '',
    overtimeType: '',
    compensationType: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidatingUser, setIsValidatingUser] = useState(true);
  const [userValidated, setUserValidated] = useState(false);
  const { toast } = useToast();

  // 驗證用戶是否為有效員工
  useEffect(() => {
    const validateUser = async () => {
      if (!currentUser) {
        setIsValidatingUser(false);
        return;
      }

      try {
        console.log('🔍 驗證用戶員工資料:', currentUser.id);
        await loadUserStaffData(currentUser.id);
        setUserValidated(true);
        console.log('✅ 用戶員工資料驗證成功');
      } catch (error) {
        console.error('❌ 用戶員工資料驗證失敗:', error);
        setUserValidated(false);
        toast({
          title: '驗證失敗',
          description: '無法驗證您的員工資料，請聯繫系統管理員檢查帳戶設定',
          variant: 'destructive',
        });
      } finally {
        setIsValidatingUser(false);
      }
    };

    validateUser();
  }, [currentUser, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: '登入錯誤',
        description: '請先登入後再提交申請',
        variant: 'destructive',
      });
      return;
    }

    if (!userValidated) {
      toast({
        title: '驗證失敗',
        description: '您的員工資料驗證失敗，無法提交申請',
        variant: 'destructive',
      });
      return;
    }

    // 客戶端驗證
    try {
      if (!formData.overtimeDate) {
        throw new Error('請選擇加班日期');
      }
      if (!formData.startTime) {
        throw new Error('請選擇開始時間');
      }
      if (!formData.endTime) {
        throw new Error('請選擇結束時間');
      }
      if (!formData.overtimeType) {
        throw new Error('請選擇加班類型');
      }
      if (!formData.compensationType) {
        throw new Error('請選擇補償方式');
      }
      if (!formData.reason.trim()) {
        throw new Error('請填寫加班原因');
      }

      // 驗證時間合理性
      const startDateTime = `${formData.overtimeDate}T${formData.startTime}:00`;
      const endDateTime = `${formData.overtimeDate}T${formData.endTime}:00`;
      const hours = calculateOvertimeHours(startDateTime, endDateTime);

      if (hours <= 0) {
        throw new Error('結束時間必須晚於開始時間');
      }

      if (hours > 12) {
        throw new Error('單日加班時數不能超過12小時');
      }

      setIsSubmitting(true);

      // 準備提交資料 - 直接使用 currentUser.id 作為 staff_id
      const overtimeData = {
        staff_id: currentUser.id, // 直接使用當前用戶ID
        overtime_date: formData.overtimeDate,
        start_time: startDateTime,
        end_time: endDateTime,
        overtime_type: formData.overtimeType as 'weekday' | 'weekend' | 'holiday',
        compensation_type: formData.compensationType as 'pay' | 'time_off' | 'both',
        reason: formData.reason.trim(),
        hours: hours
      };

      console.log('📝 準備提交加班申請:', overtimeData);

      const result = await overtimeSubmissionService.submitOvertimeRequest(overtimeData, currentUser.id);
      
      toast({
        title: '申請成功',
        description: `您的加班申請已提交成功，申請編號：${result.id.slice(0, 8)}`,
      });
      
      // 重置表單
      setFormData({
        overtimeDate: '',
        startTime: '',
        endTime: '',
        overtimeType: '',
        compensationType: '',
        reason: ''
      });

      console.log('✅ 加班申請提交完成');
      
    } catch (error) {
      console.error('❌ 表單提交錯誤:', error);
      
      const errorMessage = error instanceof Error ? error.message : '提交加班申請時發生錯誤，請稍後再試';
      
      toast({
        title: '申請失敗',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 載入中狀態
  if (isValidatingUser) {
    return (
      <div className="space-y-8">
        <OvertimeFormHeader />
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-8 text-center">
          <div className="text-white">正在驗證員工資料...</div>
        </div>
      </div>
    );
  }

  // 驗證失敗狀態
  if (!userValidated) {
    return (
      <div className="space-y-8">
        <OvertimeFormHeader />
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-8 text-center">
          <div className="text-red-200 mb-4">員工資料驗證失敗</div>
          <div className="text-white/80">請聯繫系統管理員檢查您的帳戶設定</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <OvertimeFormHeader />

      <form onSubmit={handleSubmit} className="space-y-12">
        <OvertimeBasicInfoSection
          overtimeDate={formData.overtimeDate}
          overtimeType={formData.overtimeType}
          onDateChange={(value) => updateFormData('overtimeDate', value)}
          onTypeChange={(value) => updateFormData('overtimeType', value)}
        />

        <OvertimeTimeSection
          startTime={formData.startTime}
          endTime={formData.endTime}
          onStartTimeChange={(value) => updateFormData('startTime', value)}
          onEndTimeChange={(value) => updateFormData('endTime', value)}
        />

        <OvertimeCompensationSection
          compensationType={formData.compensationType}
          onCompensationTypeChange={(value) => updateFormData('compensationType', value)}
        />

        <OvertimeReasonSection
          reason={formData.reason}
          onReasonChange={(value) => updateFormData('reason', value)}
        />

        <OvertimeSubmitSection isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default OvertimeRequestForm;
