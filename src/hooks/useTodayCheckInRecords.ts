
import { supabase } from '@/integrations/supabase/client';
import { CheckInRecord } from '@/types';

export const useTodayCheckInRecords = () => {
  const getTodayCheckInRecords = async (userId: string) => {
    try {
      if (!userId) return { checkIn: undefined, checkOut: undefined };

      const today = new Date().toISOString().split('T')[0];
      
      console.log('查詢今日記錄，日期:', today, '使用者ID:', userId);
      
      const { data, error } = await supabase
        .from('check_in_records')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', `${today}T00:00:00.000Z`)
        .lt('timestamp', `${today}T23:59:59.999Z`)
        .eq('status', 'success')
        .order('timestamp', { ascending: true });

      console.log('今日記錄查詢結果:', { data, error });
      
      if (error) {
        console.error('Error getting today records:', error);
        return { checkIn: undefined, checkOut: undefined };
      }

      const checkInRecord = (data || []).find((record: any) => record.action === 'check-in');
      const checkOutRecord = (data || []).find((record: any) => record.action === 'check-out');

      const formatRecord = (record: any): CheckInRecord | undefined => {
        if (!record) return undefined;
        
        return {
          id: record.id,
          userId: record.user_id,
          timestamp: record.timestamp,
          type: record.type as 'location' | 'ip',
          status: record.status as 'success' | 'failed',
          action: record.action as 'check-in' | 'check-out',
          details: {
            latitude: record.latitude,
            longitude: record.longitude,
            distance: record.distance,
            ip: record.ip_address,
            locationName: record.location_name
          }
        };
      };

      return {
        checkIn: formatRecord(checkInRecord),
        checkOut: formatRecord(checkOutRecord)
      };
    } catch (error) {
      console.error('取得今日打卡記錄失敗:', error);
      return { checkIn: undefined, checkOut: undefined };
    }
  };

  return {
    getTodayCheckInRecords
  };
};
