
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

  const form = useForm<OvertimeFormData>();
  const { handleSubmit, formState: { errors } } = form;

  useEffect(() => {
    loadOvertimeTypes();
  }, []);

  const loadOvertimeTypes = async () => {
    try {
      const types = await overtimeService.getOvertimeTypes();
      setOvertimeTypes(types);
      console.log('✅ 載入加班類型:', types.length, '種');
    } catch (error) {
      console.error('❌ 載入加班類型失敗:', error);
      toast.error('載入加班類型失敗');
    }
  };

  const onSubmit = async (data: OvertimeFormData) => {
    setIsSubmitting(true);
    try {
      console.log('📝 提交加班申請:', data);
      
      const requestId = await overtimeService.submitOvertimeRequest(data);
      
      toast.success('加班申請提交成功！系統將自動分配審核流程。', {
        description: `申請編號: ${requestId.slice(0, 8)}...`
      });
      
      form.reset();
      onSuccess?.();
      
      console.log('✅ 加班申請提交成功:', requestId);
    } catch (error) {
      console.error('❌ 提交失敗:', error);
      toast.error('加班申請提交失敗', {
        description: error?.message || '請稍後重試'
      });
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
