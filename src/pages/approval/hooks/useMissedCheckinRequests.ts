import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MissedCheckinRequest } from '@/types/missedCheckin';
import { useCurrentUser } from '@/hooks/useStores';
import { NotificationDatabaseOperations } from '@/services/notifications';

export const useMissedCheckinRequests = () => {
  const { toast } = useToast();
  const currentUser = useCurrentUser();
  const [missedCheckinRequests, setMissedCheckinRequests] = useState<MissedCheckinRequest[]>([]);

  const loadMissedCheckinRequests = useCallback(async () => {
    try {
      console.log('🔍 載入待審核忘記打卡申請...');

      // 查詢所有待審核的忘記打卡申請
      const { data, error } = await supabase
        .from('missed_checkin_requests')
        .select(
          `
          *,
          staff:staff_id (
            name,
            department,
            position,
            branch_name,
            supervisor_id
          )
        `
        )
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 載入忘記打卡申請失敗:', error);
        return;
      }

      const formattedData = (data || []).map(item => ({
        ...item,
        missed_type: item.missed_type as 'check_in' | 'check_out',
        status: item.status as 'pending' | 'approved' | 'rejected',
        staff: Array.isArray(item.staff) ? item.staff[0] : item.staff,
      }));

      console.log('✅ 成功載入待審核忘記打卡申請:', formattedData.length, '筆');
      setMissedCheckinRequests(formattedData);
    } catch (error) {
      console.error('❌ 載入忘記打卡申請時發生錯誤:', error);
    }
  }, []);

  const handleMissedCheckinApproval = useCallback(
    async (requestId: string, action: 'approved' | 'rejected') => {
      if (!currentUser) {
        console.error('❌ 沒有當前用戶資訊，無法進行審核');
        return;
      }

      try {
        // 先獲取申請的詳細資訊
        const { data: requestData, error: fetchError } = await supabase
          .from('missed_checkin_requests')
          .select(
            `
          *,
          staff:staff_id (
            name,
            department,
            position,
            branch_name
          )
        `
          )
          .eq('id', requestId)
          .single();

        if (fetchError || !requestData) {
          throw new Error('無法獲取申請資訊');
        }

        // 更新申請狀態
        const { error } = await supabase
          .from('missed_checkin_requests')
          .update({
            status: action,
            approved_by: currentUser.id,
            approved_by_name: currentUser.name,
            approval_comment: action === 'approved' ? '核准' : '拒絕',
            approval_date: new Date().toISOString(),
            rejection_reason: action === 'rejected' ? '拒絕' : null,
          })
          .eq('id', requestId);

        if (error) throw error;

        // 發送通知給申請人
        await createApplicantNotification(requestData as MissedCheckinRequest, action);

        toast({
          title: action === 'approved' ? '申請已核准' : '申請已拒絕',
          description: `忘記打卡申請已${action === 'approved' ? '核准' : '拒絕'}`,
        });

        setMissedCheckinRequests(prev => prev.filter(req => req.id !== requestId));
      } catch (error) {
        console.error('審核失敗:', error);
        toast({
          title: '審核失敗',
          description: '無法處理申請，請稍後重試',
          variant: 'destructive',
        });
      }
    },
    [toast, currentUser]
  );

  const createApplicantNotification = async (
    requestData: MissedCheckinRequest,
    action: 'approved' | 'rejected'
  ) => {
    try {
      const staffInfo = Array.isArray(requestData.staff) ? requestData.staff[0] : requestData.staff;
      const actionText = action === 'approved' ? '已核准' : '已被退回';

      await NotificationDatabaseOperations.addNotification(requestData.staff_id, {
        title: '忘記打卡申請結果',
        message: `您的忘記打卡申請${actionText} (${requestData.request_date})`,
        type: 'missed_checkin_approval',
        data: {
          missedCheckinRequestId: requestData.id,
          actionRequired: false,
          applicantName: staffInfo?.name,
          requestDate: requestData.request_date,
          missedType: requestData.missed_type,
        },
      });

      console.log(`✅ 已發送忘記打卡申請結果通知給 ${staffInfo?.name}`);
    } catch (error) {
      console.error('❌ 創建申請人通知失敗:', error);
    }
  };

  return {
    missedCheckinRequests,
    loadMissedCheckinRequests,
    handleMissedCheckinApproval,
    setMissedCheckinRequests,
  };
};
