
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckInRecord } from '@/types';

export const useCheckInCreator = () => {
  const { toast } = useToast();

  const createCheckInRecord = async (record: Omit<CheckInRecord, 'id'>, currentUserId: string) => {
    if (!currentUserId) {
      toast({
        title: "錯誤",
        description: "請先登入",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('建立打卡記錄:', record);

      const distance = record.details.distance 
        ? Math.round(record.details.distance) 
        : null;
      
      console.log('處理後的距離:', distance);
      
      const recordData = {
        user_id: currentUserId,
        staff_id: currentUserId,
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

      // 暫時關閉 RLS 來測試插入
      const { data, error } = await supabase
        .from('check_in_records')
        .insert(recordData)
        .select();

      if (error) {
        console.error('打卡記錄儲存失敗:', error);
        
        // 如果是 RLS 錯誤，提供更詳細的訊息
        if (error.message.includes('row-level security policy')) {
          toast({
            title: "打卡失敗",
            description: "資料庫權限問題，請聯繫管理員",
            variant: "destructive"
          });
        } else {
          toast({
            title: "打卡失敗",
            description: `無法記錄打卡資料: ${error.message}`,
            variant: "destructive"
          });
        }
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
