
import { useState, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MissedCheckinRequest } from '@/types/missedCheckin';

export const useMissedCheckinRequests = () => {
  const { currentUser } = useUser();
  const { toast } = useToast();
  const [missedCheckinRequests, setMissedCheckinRequests] = useState<MissedCheckinRequest[]>([]);

  const loadMissedCheckinRequests = useCallback(async () => {
    if (!currentUser?.id) return;
    try {
      console.log('🔍 載入待審核忘記打卡申請，當前用戶:', currentUser.id, currentUser.name);
      const { data, error } = await supabase.from('missed_checkin_requests').select(`
          *,
          staff:staff_id (
            name,
            department,
            position,
            branch_name
          )
        `).eq('status', 'pending').order('created_at', {
        ascending: false
      });
      
      if (error) {
        console.error('❌ 載入忘記打卡申請失敗:', error);
        return;
      }
      
      const formattedData = (data || []).map(item => ({
        ...item,
        missed_type: item.missed_type as 'check_in' | 'check_out' | 'both',
        status: item.status as 'pending' | 'approved' | 'rejected',
        staff: Array.isArray(item.staff) ? item.staff[0] : item.staff
      }));
      
      console.log('✅ 成功載入待審核忘記打卡申請:', formattedData.length, '筆');
      setMissedCheckinRequests(formattedData);
    } catch (error) {
      console.error('❌ 載入忘記打卡申請時發生錯誤:', error);
    }
  }, [currentUser?.id, currentUser?.name]);

  const handleMissedCheckinApproval = useCallback(async (requestId: string, action: 'approved' | 'rejected') => {
    if (!currentUser) return;
    try {
      const { error } = await supabase.from('missed_checkin_requests').update({
        status: action,
        approved_by: currentUser.id,
        approval_comment: action === 'approved' ? '主管核准' : '主管拒絕',
        approval_date: new Date().toISOString()
      }).eq('id', requestId);
      
      if (error) throw error;
      
      toast({
        title: action === 'approved' ? "申請已核准" : "申請已拒絕",
        description: `忘記打卡申請已${action === 'approved' ? '核准' : '拒絕'}`
      });

      setMissedCheckinRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('審核失敗:', error);
      toast({
        title: "審核失敗",
        description: "無法處理申請，請稍後重試",
        variant: "destructive"
      });
    }
  }, [currentUser, toast]);

  return {
    missedCheckinRequests,
    loadMissedCheckinRequests,
    handleMissedCheckinApproval,
    setMissedCheckinRequests
  };
};
