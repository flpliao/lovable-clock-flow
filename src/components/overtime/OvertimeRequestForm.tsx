
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
        title: '錯誤',
        description: '請先登入後再提交申請',
        variant: 'destructive',
      });
      return;
    }

    // 驗證表單資料
    if (!formData.overtimeDate || !formData.startTime || !formData.endTime || 
        !formData.overtimeType || !formData.compensationType || !formData.reason) {
      toast({
        title: '錯誤',
        description: '請填寫所有必填欄位',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 計算加班時數
      const startDateTime = `${formData.overtimeDate}T${formData.startTime}:00`;
      const endDateTime = `${formData.overtimeDate}T${formData.endTime}:00`;
      const hours = calculateOvertimeHours(startDateTime, endDateTime);

      // 準備提交資料 - 確保只能為自己申請
      const overtimeData = {
        staff_id: currentUser.id,  // 強制設定為當前用戶ID
        overtime_date: formData.overtimeDate,
        start_time: startDateTime,
        end_time: endDateTime,
        overtime_type: formData.overtimeType as 'weekday' | 'weekend' | 'holiday',
        compensation_type: formData.compensationType as 'pay' | 'time_off' | 'both',
        reason: formData.reason,
        hours: hours
      };

      console.log('📝 提交加班申請資料:', overtimeData);

      // 使用新的提交服務
      const result = await overtimeSubmissionService.submitOvertimeRequest(overtimeData, currentUser.id);
      
      toast({
        title: '申請成功',
        description: '您的加班申請已提交，等待主管審核',
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
    } catch (error) {
      console.error('❌ 提交加班申請失敗:', error);
      toast({
        title: '申請失敗',
        description: error instanceof Error ? error.message : '提交加班申請時發生錯誤，請稍後再試',
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
