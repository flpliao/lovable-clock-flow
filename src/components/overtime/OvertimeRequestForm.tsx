
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
import { supabase } from '@/integrations/supabase/client';

interface OvertimeRequestFormProps {
  onSuccess?: () => void;
}

const OvertimeRequestForm: React.FC<OvertimeRequestFormProps> = ({ onSuccess }) => {
  const [overtimeTypes, setOvertimeTypes] = useState<OvertimeType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authStatus, setAuthStatus] = useState<{
    isAuthenticated: boolean;
    user: any;
    session: any;
  } | null>(null);

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
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    console.log('🔐 檢查前端認證狀態...');
    try {
      const status = await overtimeService.checkUserAuthentication();
      setAuthStatus(status);
      console.log('🔐 前端認證狀態更新:', status);
      
      if (!status.isAuthenticated) {
        toast.error('登入狀態已過期，請重新登入', {
          duration: 5000,
          action: {
            label: '重新登入',
            onClick: () => {
              // 這裡可以導向登入頁面
              window.location.href = '/login';
            }
          }
        });
      }
    } catch (error) {
      console.error('❌ 檢查認證狀態失敗:', error);
      setAuthStatus({ isAuthenticated: false, user: null, session: null });
    }
  };

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
    
    // 重新檢查認證狀態
    await checkAuthenticationStatus();
    
    if (!authStatus?.isAuthenticated) {
      console.error('❌ 用戶未登入或認證狀態無效');
      toast.error('登入狀態已過期，請重新登入', {
        duration: 5000,
        action: {
          label: '重新登入',
          onClick: () => {
            window.location.href = '/login';
          }
        }
      });
      return;
    }
    
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
      console.log('🔐 當前認證狀態:', authStatus);
      
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
      
      // 特別處理認證相關錯誤
      if (errorMessage.includes('登入') || errorMessage.includes('認證') || errorMessage.includes('權限')) {
        toast.error(errorMessage, {
          duration: 5000,
          action: {
            label: '重新登入',
            onClick: () => {
              window.location.href = '/login';
            }
          }
        });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 顯示認證狀態警告
  if (authStatus && !authStatus.isAuthenticated) {
    return (
      <div className="space-y-6">
        <OvertimeFormHeader />
        <div className="backdrop-blur-xl bg-red-500/20 border border-red-500/30 rounded-3xl shadow-xl p-6 text-center">
          <h3 className="text-lg font-semibold text-white mb-4">⚠️ 登入狀態異常</h3>
          <p className="text-white/80 mb-4">
            您的登入狀態已過期或無效，請重新登入後再試。
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-white/30 border border-white/40 text-white font-semibold px-6 py-2 rounded-xl hover:bg-white/50 transition-all duration-300"
          >
            重新登入
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OvertimeFormHeader />

      {/* 認證狀態指示器 */}
      {authStatus && (
        <div className="backdrop-blur-xl bg-green-500/20 border border-green-500/30 rounded-2xl shadow-xl p-3 text-center">
          <p className="text-green-100 text-sm">
            ✅ 登入狀態正常 (用戶ID: {authStatus.user?.id?.slice(0, 8)}...)
          </p>
        </div>
      )}

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
