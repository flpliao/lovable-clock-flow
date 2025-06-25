
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
import OvertimeAuthCheck from './OvertimeAuthCheck';
import { useSessionManager } from '@/hooks/useSessionManager';

interface OvertimeRequestFormProps {
  onSuccess?: () => void;
}

const OvertimeRequestForm: React.FC<OvertimeRequestFormProps> = ({ onSuccess }) => {
  const [overtimeTypes, setOvertimeTypes] = useState<OvertimeType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { ensureValidSession } = useSessionManager();

  const form = useForm<OvertimeFormData>();
  const { handleSubmit, formState: { errors } } = form;

  useEffect(() => {
    loadOvertimeTypes();
  }, []);

  const loadOvertimeTypes = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 載入加班類型...');
      
      const types = await overtimeService.getOvertimeTypes();
      setOvertimeTypes(types);
      console.log('✅ 加班類型載入成功:', types.length, '項');
    } catch (error: any) {
      console.error('❌ 載入加班類型失敗:', error);
      const errorMessage = error?.message || '載入加班類型失敗';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: OvertimeFormData) => {
    console.log('📝 開始提交加班申請...');
    console.log('📋 表單資料:', data);
    
    setIsSubmitting(true);
    
    try {
      // 提交前先驗證 session 有效性
      console.log('🔒 提交前驗證 Session...');
      const sessionValid = await ensureValidSession();
      
      if (!sessionValid) {
        console.log('❌ Session 驗證失敗，中止提交');
        toast.error('登入狀態已過期，請重新登入後再試');
        return;
      }
      
      console.log('✅ Session 驗證通過，繼續提交');
      console.log('📤 提交加班申請至後端...');
      
      await overtimeService.submitOvertimeRequest(data);
      
      console.log('✅ 加班申請提交成功');
      toast.success('加班申請提交成功');
      
      // 重置表單
      form.reset();
      
      // 觸發成功回調
      onSuccess?.();
    } catch (error: any) {
      console.error('❌ 提交失敗:', error);
      
      const errorMessage = error?.message || '加班申請提交失敗';
      console.log('錯誤訊息:', errorMessage);
      
      if (errorMessage.includes('登入狀態') || errorMessage.includes('session') || errorMessage.includes('認證')) {
        toast.error('登入狀態已過期，請重新登入');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <OvertimeFormHeader />
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
            <span className="text-white">載入中...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <OvertimeAuthCheck>
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
    </OvertimeAuthCheck>
  );
};

export default OvertimeRequestForm;
