
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckInRecord } from '@/types';

export const useCheckInCreator = () => {
  const { toast } = useToast();

  const createCheckInRecord = async (record: Omit<CheckInRecord, 'id'>, currentUserId?: string) => {
    try {
      // 檢查用戶是否已登入
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Authentication error:', authError);
        toast({
          title: "打卡失敗",
          description: "請先登入",
          variant: "destructive"
        });
        return false;
      }

      console.log('Creating check-in record for authenticated user:', user.id);
      console.log('Record data:', record);

      const distance = record.details.distance 
        ? Math.round(record.details.distance) 
        : null;
      
      console.log('處理後的距離:', distance);
      
      const recordData = {
        user_id: user.id, // 使用 Supabase 認證的用戶 ID
        staff_id: user.id, // 同樣使用認證的用戶 ID
        timestamp: record.timestamp,
        type: record.type,
        status: record.status,
        action: record.action,
        latitude: record.details.latitude || null,
        longitude: record.details.longitude || null,
        distance: distance,
        ip_address: record.details.ip || null,
        location_name: record.details.locationName || null
      };
      
      console.log('即將插入資料庫的記錄:', recordData);

      const { data, error } = await supabase
        .from('check_in_records')
        .insert(recordData)
        .select();

      if (error) {
        console.error('打卡記錄儲存失敗:', error);
        toast({
          title: "打卡失敗",
          description: `無法記錄打卡資料: ${error.message}`,
          variant: "destructive"
        });
        return false;
      }

      console.log('打卡記錄建立成功:', data);
      
      toast({
        title: record.action === 'check-in' ? "上班打卡成功" : "下班打卡成功",
        description: "打卡記錄已儲存",
      });
      
      return true;
    } catch (error) {
      console.error('建立打卡記錄失敗:', error);
      toast({
        title: "打卡失敗",
        description: "無法記錄打卡資料",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    createCheckInRecord
  };
};
