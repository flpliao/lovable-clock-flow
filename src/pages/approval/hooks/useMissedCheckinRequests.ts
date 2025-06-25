
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MissedCheckinRequest } from '@/types/missedCheckin';

export const useMissedCheckinRequests = () => {
  const { toast } = useToast();
  const [missedCheckinRequests, setMissedCheckinRequests] = useState<MissedCheckinRequest[]>([]);

  const loadMissedCheckinRequests = useCallback(async () => {
    try {
      console.log('🔍 載入待審核忘記打卡申請...');
      
      // 查詢所有待審核的忘記打卡申請
      const { data, error } = await supabase
        .from('missed_checkin_requests')
        .select(`
          *,
          staff:staff_id (
            name,
            department,
            position,
            branch_name,
            supervisor_id
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
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
  }, []);

  const handleMissedCheckinApproval = useCallback(async (requestId: string, action: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase.from('missed_checkin_requests').update({
        status: action,
        approved_by: '550e8400-e29b-41d4-a716-446655440001', // 使用預設用戶 ID
        approved_by_name: '系統管理員',
        approval_comment: action === 'approved' ? '系統核准' : '系統拒絕',
        approval_date: new Date().toISOString(),
        rejection_reason: action === 'rejected' ? '系統拒絕' : null
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
  }, [toast]);

  return {
    missedCheckinRequests,
    loadMissedCheckinRequests,
    handleMissedCheckinApproval,
    setMissedCheckinRequests
  };
};
