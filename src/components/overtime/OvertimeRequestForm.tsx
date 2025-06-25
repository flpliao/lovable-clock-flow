
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
    } catch (error) {
      console.error('載入加班類型失敗:', error);
      toast.error('載入加班類型失敗');
    }
  };

  const onSubmit = async (data: OvertimeFormData) => {
    setIsSubmitting(true);
    try {
      await overtimeService.submitOvertimeRequest(data);
      toast.success('加班申請提交成功');
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('提交失敗:', error);
      toast.error('加班申請提交失敗');
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
