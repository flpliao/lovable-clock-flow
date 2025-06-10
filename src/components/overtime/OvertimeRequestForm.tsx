
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import OvertimeFormHeader from './components/OvertimeFormHeader';
import OvertimeBasicInfoSection from './components/OvertimeBasicInfoSection';
import OvertimeTimeSection from './components/OvertimeTimeSection';
import OvertimeCompensationSection from './components/OvertimeCompensationSection';
import OvertimeReasonSection from './components/OvertimeReasonSection';
import OvertimeSubmitSection from './components/OvertimeSubmitSection';

const OvertimeRequestForm: React.FC = () => {
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
    setIsSubmitting(true);
    
    try {
      // 這裡會整合實際的 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模擬 API 調用
      
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
      toast({
        title: '申請失敗',
        description: '提交加班申請時發生錯誤，請稍後再試',
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
    <div className="space-y-8">
      <OvertimeFormHeader />

      <form onSubmit={handleSubmit} className="space-y-8">
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
