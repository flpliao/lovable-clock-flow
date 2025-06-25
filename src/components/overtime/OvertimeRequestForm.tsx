
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OvertimeRequestFormProps {
  onSuccess?: () => void;
}

const OvertimeRequestForm: React.FC<OvertimeRequestFormProps> = ({ onSuccess }) => {
  const [overtimeTypes, setOvertimeTypes] = useState<OvertimeType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<OvertimeFormData>();
  const { handleSubmit, formState: { errors } } = form;

  useEffect(() => {
    loadOvertimeTypes();
  }, []);

  const loadOvertimeTypes = async () => {
    try {
      setIsLoading(true);
      setAuthError(null);
      console.log('🔄 載入加班類型...');
      
      const types = await overtimeService.getOvertimeTypes();
      setOvertimeTypes(types);
      console.log('✅ 加班類型載入成功:', types.length, '項');
    } catch (error) {
      console.error('❌ 載入加班類型失敗:', error);
      toast.error('載入加班類型失敗');
      setAuthError('載入加班類型失敗，請重新整理頁面');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    console.log('🔄 用戶點擊重試');
    loadOvertimeTypes();
  };

  const onSubmit = async (data: OvertimeFormData) => {
    console.log('📝 開始提交加班申請...');
    console.log('📋 表單資料:', data);
    
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      // 表單驗證
      const requiredFields = ['overtime_type', 'overtime_date', 'start_time', 'end_time', 'reason'];
      const missingFields = requiredFields.filter(field => !data[field as keyof OvertimeFormData]);
      
      if (missingFields.length > 0) {
        toast.error(`請填寫必填欄位: ${missingFields.join(', ')}`);
        return;
      }

      // 時間驗證
      if (data.start_time && data.end_time) {
        const startTime = new Date(`2000-01-01T${data.start_time}`);
        const endTime = new Date(`2000-01-01T${data.end_time}`);
        
        if (endTime <= startTime) {
          toast.error('結束時間必須晚於開始時間');
          return;
        }
      }

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
      
      // 檢查是否為認證錯誤
      if (errorMessage.includes('未登入') || errorMessage.includes('認證') || errorMessage.includes('session')) {
        setAuthError('登入狀態已過期，請重新登入');
        toast.error('登入狀態已過期，請重新登入');
      } else if (errorMessage.includes('找不到對應的員工資料')) {
        setAuthError('找不到對應的員工資料，請聯絡系統管理員');
        toast.error('找不到對應的員工資料，請聯絡系統管理員');
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
            <RefreshCw className="h-6 w-6 animate-spin text-white mr-2" />
            <span className="text-white">載入中...</span>
          </div>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="space-y-6">
        <OvertimeFormHeader />
        <Alert className="backdrop-blur-xl bg-red-500/20 border border-red-300/30 shadow-xl">
          <AlertTriangle className="h-4 w-4 text-red-300" />
          <AlertDescription className="text-red-200">
            {authError}
          </AlertDescription>
        </Alert>
        <div className="text-center">
          <Button
            onClick={handleRetry}
            variant="outline"
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            重新載入
          </Button>
        </div>
      </div>
    );
  }

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
