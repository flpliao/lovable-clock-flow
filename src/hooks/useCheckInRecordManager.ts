
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CheckInRecord } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useCheckInRecordManager = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // 載入所有打卡記錄（系統管理員專用）
  const loadAllRecords = async (): Promise<CheckInRecord[]> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('check_in_records')
        .select(`
          *,
          staff:staff_id (
            name,
            department,
            position
          )
        `)
        .order('timestamp', { ascending: false })
        .limit(500); // 限制數量避免載入過多資料

      if (error) throw error;

      const formattedRecords = (data || []).map((record: any) => ({
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
        },
        staff_name: Array.isArray(record.staff) ? record.staff[0]?.name : record.staff?.name
      }));

      return formattedRecords;
    } catch (error) {
      console.error('載入全部記錄失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入全部打卡記錄",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 載入下屬打卡記錄（管理員專用）
  const loadSubordinateRecords = async (supervisorId: string): Promise<CheckInRecord[]> => {
    setLoading(true);
    try {
      // 先找出下屬
      const { data: subordinates, error: subordinatesError } = await supabase
        .from('staff')
        .select('id')
        .eq('supervisor_id', supervisorId);

      if (subordinatesError) throw subordinatesError;

      if (!subordinates || subordinates.length === 0) {
        return [];
      }

      const subordinateIds = subordinates.map(s => s.id);

      const { data, error } = await supabase
        .from('check_in_records')
        .select(`
          *,
          staff:staff_id (
            name,
            department,
            position
          )
        `)
        .in('user_id', subordinateIds)
        .order('timestamp', { ascending: false })
        .limit(500);

      if (error) throw error;

      const formattedRecords = (data || []).map((record: any) => ({
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
        },
        staff_name: Array.isArray(record.staff) ? record.staff[0]?.name : record.staff?.name
      }));

      return formattedRecords;
    } catch (error) {
      console.error('載入下屬記錄失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入下屬打卡記錄",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // 刪除打卡記錄（系統管理員專用）
  const deleteCheckInRecord = async (recordId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('check_in_records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('刪除打卡記錄失敗:', error);
      throw error;
    }
  };

  return {
    loading,
    loadAllRecords,
    loadSubordinateRecords,
    deleteCheckInRecord
  };
};
