
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { overtimeSubmissionService } from '@/services/overtime/overtimeSubmissionService';
import { calculateOvertimeHours } from '@/utils/overtimeUtils';
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
  const { toast } = useToast();

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

      // 準備提交資料
      const overtimeData = {
        staff_id: currentUser.id,
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
