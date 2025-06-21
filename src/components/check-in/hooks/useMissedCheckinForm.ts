
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MissedCheckinFormData {
  request_date: string;
  missed_type: 'check_in' | 'check_out' | 'both';
  requested_check_in_time: string;
  requested_check_out_time: string;
  reason: string;
}

export const useMissedCheckinForm = (onSuccess: () => void) => {
  const { currentUser } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<MissedCheckinFormData>({
    request_date: new Date().toISOString().split('T')[0],
    missed_type: 'check_in',
    requested_check_in_time: '',
    requested_check_out_time: '',
    reason: ''
  });

  const resetForm = () => {
    setFormData({
      request_date: new Date().toISOString().split('T')[0],
      missed_type: 'check_in',
      requested_check_in_time: '',
      requested_check_out_time: '',
      reason: ''
    });
  };

  const updateFormData = (updates: Partial<MissedCheckinFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const submitForm = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const submitData: any = {
        staff_id: currentUser.id,
        request_date: formData.request_date,
        missed_type: formData.missed_type,
        reason: formData.reason
      };

      // 根據申請類型添加時間
      if (formData.missed_type === 'check_in' || formData.missed_type === 'both') {
        if (formData.requested_check_in_time) {
          submitData.requested_check_in_time = `${formData.request_date}T${formData.requested_check_in_time}:00`;
        }
      }

      if (formData.missed_type === 'check_out' || formData.missed_type === 'both') {
        if (formData.requested_check_out_time) {
          submitData.requested_check_out_time = `${formData.request_date}T${formData.requested_check_out_time}:00`;
        }
      }

      const { error } = await supabase
        .from('missed_checkin_requests')
        .insert(submitData);

      if (error) throw error;

      toast({
        title: "申請已提交",
        description: "忘記打卡申請已成功提交，等待主管審核",
      });

      resetForm();
      onSuccess();
    } catch (error) {
      console.error('提交申請失敗:', error);
      toast({
        title: "提交失敗",
        description: "無法提交忘記打卡申請，請稍後重試",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    updateFormData,
    submitForm,
    resetForm
  };
};
