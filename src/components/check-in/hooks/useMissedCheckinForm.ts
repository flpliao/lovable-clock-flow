import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentUser } from '@/hooks/useStores';
import { MissedCheckinRequest } from '@/types/missedCheckin';

export interface MissedCheckinFormData {
  request_date: string;
  missed_type: 'check_in' | 'check_out';
  requested_check_in_time: string;
  requested_check_out_time: string;
  reason: string;
}

export interface MissedCheckinSubmitData {
  staff_id: string;
  request_date: string;
  missed_type: 'check_in' | 'check_out';
  reason: string;
  requested_check_in_time?: string;
  requested_check_out_time?: string;
}

export interface MissedCheckinRequestData {
  id: string;
  staff_id: string;
  request_date: string;
  missed_type: 'check_in' | 'check_out';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_check_in_time?: string;
  requested_check_out_time?: string;
  created_at: string;
  updated_at: string;
}

export const useMissedCheckinForm = (onSuccess: () => void) => {
  const { toast } = useToast();
  const currentUser = useCurrentUser();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<MissedCheckinFormData>({
    request_date: new Date().toISOString().split('T')[0],
    missed_type: 'check_in',
    requested_check_in_time: '',
    requested_check_out_time: '',
    reason: '',
  });

  const updateFormData = (changes: Partial<MissedCheckinFormData>) => {
    setFormData(prev => ({ ...prev, ...changes }));
  };

  const resetForm = () => {
    setFormData({
      request_date: new Date().toISOString().split('T')[0],
      missed_type: 'check_in',
      requested_check_in_time: '',
      requested_check_out_time: '',
      reason: '',
    });
  };

  const createManagerNotification = async (requestData: MissedCheckinRequestData) => {
    try {
      // 這裡可以實作通知主管的邏輯
      console.log('建立主管通知:', requestData);
    } catch (error) {
      console.error('建立通知失敗:', error);
    }
  };

  const submitForm = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const submitData: MissedCheckinSubmitData = {
        staff_id: currentUser.id,
        request_date: formData.request_date,
        missed_type: formData.missed_type,
        reason: formData.reason,
      };

      // 根據申請類型添加時間
      if (formData.missed_type === 'check_in') {
        if (formData.requested_check_in_time) {
          submitData.requested_check_in_time = `${formData.request_date}T${formData.requested_check_in_time}:00`;
        }
      }

      if (formData.missed_type === 'check_out') {
        if (formData.requested_check_out_time) {
          submitData.requested_check_out_time = `${formData.request_date}T${formData.requested_check_out_time}:00`;
        }
      }

      const { data: insertedData, error } = await supabase
        .from('missed_checkin_requests')
        .insert(submitData)
        .select()
        .single();

      if (error) throw error;

      // 創建通知給主管
      await createManagerNotification(insertedData as MissedCheckinRequestData);

      toast({
        title: '申請已提交',
        description: '忘記打卡申請已成功提交，等待主管審核',
      });

      resetForm();
      onSuccess();
    } catch (error) {
      console.error('提交申請失敗:', error);
      toast({
        title: '提交失敗',
        description: '無法提交忘記打卡申請，請稍後重試',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): string | null => {
    if (!formData.request_date) {
      return '請選擇申請日期';
    }

    if (!formData.reason.trim()) {
      return '請填寫申請原因';
    }

    if (formData.missed_type === 'check_in' && !formData.requested_check_in_time) {
      return '請填寫預計上班時間';
    }

    if (formData.missed_type === 'check_out' && !formData.requested_check_out_time) {
      return '請填寫預計下班時間';
    }

    return null;
  };

  const getMissedTypeText = (type: 'check_in' | 'check_out') => {
    switch (type) {
      case 'check_in':
        return '忘記上班打卡';
      case 'check_out':
        return '忘記下班打卡';
      default:
        return type;
    }
  };

  return {
    formData,
    loading,
    updateFormData,
    submitForm,
    validateForm,
    getMissedTypeText,
  };
};
