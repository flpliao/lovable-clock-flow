
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useUnifiedPermissions } from '@/hooks/useUnifiedPermissions';
import { OvertimeService } from '@/services/overtimeService';
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
  const { currentUser } = useUser();
  const { staffList } = useStaffManagementContext();
  const { hasPermission } = useUnifiedPermissions();

  // 權限檢查
  const canRequestOvertime = hasPermission('overtime:request');

  // 獲取當前用戶的員工資料
  const currentStaff = staffList.find(staff => 
    staff.email === currentUser?.name || 
    staff.name === currentUser?.name ||
    staff.id === currentUser?.id
  );

  if (!canRequestOvertime) {
    return (
      <div className="text-center py-8">
        <div className="text-white/80 text-lg">
          您沒有申請加班的權限
        </div>
      </div>
    );
  }

  if (!currentStaff) {
    return (
      <div className="text-center py-8">
        <div className="text-white/80 text-lg">
          找不到您的員工資料，無法提交加班申請
        </div>
      </div>
    );
  }

  const calculateHours = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    if (end <= start) {
      // 跨日情況
      end.setDate(end.getDate() + 1);
    }
    
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.overtimeDate || !formData.startTime || !formData.endTime || 
        !formData.overtimeType || !formData.compensationType || !formData.reason.trim()) {
      toast({
        title: '資料不完整',
        description: '請填寫所有必填欄位',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const hours = calculateHours(formData.startTime, formData.endTime);
      
      if (hours <= 0) {
        toast({
          title: '時間設定錯誤',
          description: '結束時間必須晚於開始時間',
          variant: 'destructive',
        });
        return;
      }

      const overtimeRequest = {
        staff_id: currentStaff.id,
        overtime_date: formData.overtimeDate,
        start_time: `${formData.overtimeDate}T${formData.startTime}:00Z`,
        end_time: `${formData.overtimeDate}T${formData.endTime}:00Z`,
        hours,
        overtime_type: formData.overtimeType as 'weekday' | 'weekend' | 'holiday',
        compensation_type: formData.compensationType as 'pay' | 'time_off',
        reason: formData.reason.trim()
      };

      console.log('📝 提交加班申請:', overtimeRequest);
      
      await OvertimeService.submitOvertimeRequest(overtimeRequest);
      
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
      console.error('❌ 加班申請提交失敗:', error);
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
