
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckInRecord } from '@/types';

export const useCheckInCreator = () => {
  const { toast } = useToast();

  const createCheckInRecord = useCallback(async (record: Omit<CheckInRecord, 'id'>, currentUserId?: string) => {
    try {
      console.log('Creating check-in record:', record);
      console.log('Current user ID:', currentUserId);

      // 使用傳入的用戶 ID 或記錄中的用戶 ID
      const targetUserId = currentUserId || record.userId;
      
      if (!targetUserId) {
        console.error('No user ID available for check-in record');
        toast({
          title: "打卡失敗",
          description: "無法確認用戶身份",
          variant: "destructive"
        });
        return false;
      }

      // 先確認用戶在 staff 表中存在
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, user_id')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (staffError) {
        console.error('Error checking staff record:', staffError);
        toast({
          title: "打卡失敗",
          description: "無法確認員工身份",
          variant: "destructive"
        });
        return false;
      }

      if (!staffData) {
        console.error('No staff record found for user:', targetUserId);
        toast({
          title: "打卡失敗",
          description: "找不到員工記錄，請聯繫管理員",
          variant: "destructive"
        });
        return false;
      }

      const distance = record.details.distance 
        ? Math.round(record.details.distance) 
        : null;
      
      console.log('處理後的距離:', distance);
      console.log('使用的 staff_id:', staffData.id);
      
      const recordData = {
        user_id: targetUserId,
        staff_id: staffData.id, // 使用從 staff 表查詢到的 ID
        timestamp: record.timestamp,
        type: record.type,
        status: record.status,
        action: record.action,
        latitude: record.details.latitude || null,
        longitude: record.details.longitude || null,
        distance: distance,
        ip_address: record.details.ip || null,
        location_name: record.details.locationName || null,
        // 新增的GPS比對資料欄位
        department_latitude: record.details.departmentLatitude || null,
        department_longitude: record.details.departmentLongitude || null,
        department_name: record.details.departmentName || null,
        gps_comparison_result: record.details.gpsComparisonResult || null
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
      
      // 顯示成功訊息，包含GPS比對資訊
      const successMessage = record.details.gpsComparisonResult?.message || 
        (record.action === 'check-in' ? "上班打卡成功" : "下班打卡成功");
      
      toast({
        title: successMessage,
        description: record.type === 'location' 
          ? `距離${record.details.departmentName || record.details.locationName}: ${distance}公尺`
          : "打卡記錄已儲存",
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
  }, [toast]);

  return {
    createCheckInRecord
  };
};
