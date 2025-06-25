
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { overtimeService } from '@/services/overtimeService';
import type { OvertimeFormData, OvertimeType } from '@/types/overtime';
import { OvertimeFormHeader } from './form/OvertimeFormHeader';
import { OvertimeBasicInfo } from './form/OvertimeBasicInfo';
import { OvertimeTimeSettings } from './form/OvertimeTimeSettings';
import { OvertimeCompensation } from './form/OvertimeCompensation';
import { OvertimeReason } from './form/OvertimeReason';
import { OvertimeSubmitButton } from './form/OvertimeSubmitButton';

interface OvertimeRequestFormProps {
  onSuccess?: () => void;
}

const OvertimeRequestForm: React.FC<OvertimeRequestFormProps> = ({ onSuccess }) => {
  const [overtimeTypes, setOvertimeTypes] = useState<OvertimeType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OvertimeFormData>({
    defaultValues: {
      overtime_type: '',
      overtime_date: '',
      start_time: '',
      end_time: '',
      reason: '',
      compensation_type: 'overtime_pay'
    }
  });
  const { handleSubmit, formState: { errors }, watch } = form;

  // 監控表單數據變化以便調試
  const watchedData = watch();
  console.log('📋 表單當前數據:', watchedData);

  useEffect(() => {
    loadOvertimeTypes();
  }, []);

  const loadOvertimeTypes = async () => {
    console.log('🔄 載入加班類型中...');
    try {
      const types = await overtimeService.getOvertimeTypes();
      setOvertimeTypes(types);
      console.log('✅ 加班類型載入成功:', types);
    } catch (error) {
      console.error('❌ 載入加班類型失敗:', error);
      toast.error('載入加班類型失敗');
    }
  };

  const onSubmit = async (data: OvertimeFormData) => {
    console.log('🚀 開始提交表單，表單數據:', data);
    
    // 驗證表單數據完整性
    const missingFields = [];
    if (!data.overtime_type) missingFields.push('加班類型');
    if (!data.overtime_date) missingFields.push('加班日期');
    if (!data.start_time) missingFields.push('開始時間');
    if (!data.end_time) missingFields.push('結束時間');
    if (!data.reason?.trim()) missingFields.push('加班原因');

    if (missingFields.length > 0) {
      const errorMessage = `請填寫以下必填欄位: ${missingFields.join('、')}`;
      console.error('❌ 表單驗證失敗:', errorMessage);
      toast.error(errorMessage);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('📤 開始調用 overtimeService.submitOvertimeRequest');
      const requestId = await overtimeService.submitOvertimeRequest(data);
      console.log('✅ 加班申請提交成功，申請ID:', requestId);
      
      toast.success('加班申請提交成功！');
      
      // 重置表單
      form.reset({
        overtime_type: '',
        overtime_date: '',
        start_time: '',
        end_time: '',
        reason: '',
        compensation_type: 'overtime_pay'
      });
      
      // 調用成功回調
      if (onSuccess) {
        console.log('📞 調用 onSuccess 回調');
        onSuccess();
      }
    } catch (error) {
      console.error('❌ 加班申請提交失敗:', error);
      const errorMessage = error instanceof Error ? error.message : '加班申請提交失敗';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <OvertimeFormHeader />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <OvertimeBasicInfo 
          form={form}
          overtimeTypes={overtimeTypes}
          errors={errors}
        />

        <OvertimeTimeSettings 
          form={form}
          errors={errors}
        />

        <OvertimeCompensation form={form} />

        <OvertimeReason 
          form={form}
          errors={errors}
        />

        <OvertimeSubmitButton isSubmitting={isSubmitting} />
      </form>
    </div>
  );
};

export default OvertimeRequestForm;
