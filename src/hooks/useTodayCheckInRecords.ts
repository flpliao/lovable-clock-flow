
import { supabase } from '@/integrations/supabase/client';
import { CheckInRecord } from '@/types';

export const useTodayCheckInRecords = () => {
  const getTodayCheckInRecords = async (userId?: string) => {
    try {
      // 檢查用戶是否已登入，優先使用 Supabase 認證的用戶 ID
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('No authenticated user found');
        return { checkIn: undefined, checkOut: undefined };
      }

      const targetUserId = user.id; // 使用認證的用戶 ID
      console.log('查詢今日記錄，使用者 ID:', targetUserId);

      // 使用當地時間計算今日範圍
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      
      const startOfDayISO = startOfDay.toISOString();
      const endOfDayISO = endOfDay.toISOString();
      
      console.log('查詢今日記錄範圍:', { startOfDayISO, endOfDayISO, targetUserId });
      
      const { data, error } = await supabase
        .from('check_in_records')
        .select('*')
        .eq('user_id', targetUserId)
        .gte('timestamp', startOfDayISO)
        .lt('timestamp', endOfDayISO)
        .eq('status', 'success')
        .order('timestamp', { ascending: true });

      console.log('今日記錄查詢結果:', { data, error });
      
      if (error) {
        console.error('Error getting today records:', error);
        return { checkIn: undefined, checkOut: undefined };
      }

      if (!data || data.length === 0) {
        console.log('今日無打卡記錄');
        return { checkIn: undefined, checkOut: undefined };
      }

      const checkInRecord = data.find((record: any) => record.action === 'check-in');
      const checkOutRecord = data.find((record: any) => record.action === 'check-out');

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

      const result = {
        checkIn: formatRecord(checkInRecord),
        checkOut: formatRecord(checkOutRecord)
      };

      console.log('格式化後的今日記錄:', result);
      return result;
    } catch (error) {
      console.error('取得今日打卡記錄失敗:', error);
      return { checkIn: undefined, checkOut: undefined };
    }
  };

  return {
    getTodayCheckInRecords
  };
};
