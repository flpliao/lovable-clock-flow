import { useToast } from '@/hooks/use-toast';
import { useCurrentUser } from '@/hooks/useStores';
import { supabase } from '@/integrations/supabase/client';
import { NotificationDatabaseOperations } from '@/services/notifications';
import { useState } from 'react';

interface MissedCheckinFormData {
  request_date: string;
  missed_type: 'check_in' | 'check_out' | 'both';
  requested_check_in_time: string;
  requested_check_out_time: string;
  reason: string;
}

interface MissedCheckinSubmitData {
  staff_id: string;
  request_date: string;
  missed_type: 'check_in' | 'check_out' | 'both';
  reason: string;
  requested_check_in_time?: string;
  requested_check_out_time?: string;
}

interface MissedCheckinRequestData {
  id: string;
  staff_id: string;
  request_date: string;
  missed_type: 'check_in' | 'check_out' | 'both';
  reason: string;
  requested_check_in_time?: string;
  requested_check_out_time?: string;
}

interface UseMissedCheckinFormOptions {
  initialData?: Partial<MissedCheckinFormData>;
}

export const useMissedCheckinForm = (
  onSuccess: () => void,
  options?: UseMissedCheckinFormOptions
) => {
  const currentUser = useCurrentUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<MissedCheckinFormData>({
    request_date: options?.initialData?.request_date || new Date().toISOString().split('T')[0],
    missed_type: options?.initialData?.missed_type || 'check_in',
    requested_check_in_time: options?.initialData?.requested_check_in_time || '',
    requested_check_out_time: options?.initialData?.requested_check_out_time || '',
    reason: options?.initialData?.reason || '',
  });

  const resetForm = () => {
    setFormData({
      request_date: options?.initialData?.request_date || new Date().toISOString().split('T')[0],
      missed_type: options?.initialData?.missed_type || 'check_in',
      requested_check_in_time: options?.initialData?.requested_check_in_time || '',
      requested_check_out_time: options?.initialData?.requested_check_out_time || '',
      reason: options?.initialData?.reason || '',
    });
  };

  const updateFormData = (updates: Partial<MissedCheckinFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
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

  const createManagerNotification = async (requestData: MissedCheckinRequestData) => {
    try {
      // 查詢所有主管和管理員
      const { data: managers, error } = await supabase
        .from('staff')
        .select('id, name, role')
        .or('role.eq.admin,role.eq.manager,role.eq.hr_manager');

      if (error) {
        console.error('查詢主管失敗:', error);
        return;
      }

      if (!managers || managers.length === 0) {
        console.log('沒有找到主管');
        return;
      }

      const getMissedTypeText = (type: string) => {
        switch (type) {
          case 'check_in':
            return '忘記上班打卡';
          case 'check_out':
            return '忘記下班打卡';
          case 'both':
            return '忘記上下班打卡';
          default:
            return type;
        }
      };

      // 為每個主管創建通知
      for (const manager of managers) {
        await NotificationDatabaseOperations.addNotification(manager.id, {
          title: '有新的忘記打卡申請待審核',
          message: `${currentUser?.name} 申請${getMissedTypeText(formData.missed_type)}審核 (${formData.request_date})`,
          type: 'missed_checkin_approval',
          data: {
            missedCheckinRequestId: requestData.id,
            actionRequired: true,
            applicantName: currentUser?.name,
            requestDate: formData.request_date,
            missedType: formData.missed_type,
          },
        });
      }

      console.log(`已發送忘記打卡申請通知給 ${managers.length} 位主管`);
    } catch (error) {
      console.error('創建主管通知失敗:', error);
    }
  };

  return {
    formData,
    loading,
    updateFormData,
    submitForm,
    resetForm,
  };
};
