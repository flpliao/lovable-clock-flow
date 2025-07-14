import { useCurrentUser } from '@/hooks/useStores';
import { supabase } from '@/integrations/supabase/client';
import { MissedCheckinRequest } from '@/types/missedCheckin';
import { useCallback, useState } from 'react';

export const useMissedCheckinRecords = () => {
  const currentUser = useCurrentUser();
  const [missedCheckinRecords, setMissedCheckinRecords] = useState<MissedCheckinRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMissedCheckinRecords = useCallback(async () => {
    if (!currentUser?.id) {
      console.log('沒有使用者 ID，跳過載入忘打卡記錄');
      setMissedCheckinRecords([]);
      return;
    }

    setLoading(true);
    try {
      console.log('開始載入忘打卡記錄，使用者ID:', currentUser.id);

      const { data, error } = await supabase
        .from('missed_checkin_requests')
        .select('*')
        .eq('staff_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('載入忘打卡記錄失敗:', error);
        setMissedCheckinRecords([]);
        return;
      }

      const formattedData = (data || []).map(item => ({
        ...item,
        missed_type: item.missed_type as 'check_in' | 'check_out' | 'both',
        status: item.status as 'pending' | 'approved' | 'rejected',
      }));

      console.log('成功載入忘打卡記錄:', formattedData.length, '筆');
      setMissedCheckinRecords(formattedData);
    } catch (error) {
      console.error('載入忘打卡記錄時發生錯誤:', error);
      setMissedCheckinRecords([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  const refreshMissedCheckinRecords = useCallback(async () => {
    await loadMissedCheckinRecords();
  }, [loadMissedCheckinRecords]);

  return {
    missedCheckinRecords,
    loading,
    loadMissedCheckinRecords,
    refreshMissedCheckinRecords,
  };
};
