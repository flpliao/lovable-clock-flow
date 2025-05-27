
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { CheckInRecord } from '@/types';

export const useCheckInRecords = () => {
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const loadingRef = useRef(false);

  const loadCheckInRecords = async (userId?: string) => {
    // 如果沒有提供 userId，則不執行查詢
    if (!userId) {
      console.log('沒有使用者 ID，跳過載入打卡記錄');
      setCheckInRecords([]);
      return;
    }

    // 防止重複載入
    if (loadingRef.current) {
      console.log('正在載入中，跳過重複請求');
      return;
    }
    
    try {
      loadingRef.current = true;
      setLoading(true);
      
      console.log('開始載入打卡記錄，使用者ID:', userId);

      // 確保 userId 是正確的 UUID 格式
      if (!userId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.error('無效的 UUID 格式:', userId);
        setCheckInRecords([]);
        return;
      }

      const { data, error } = await supabase
        .from('check_in_records')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(100);

      console.log('Supabase 查詢結果:', { data, error });

      if (error) {
        console.error('Error loading check-in records:', error);
        toast({
          title: "載入失敗",
          description: `無法載入打卡記錄: ${error.message}`,
          variant: "destructive"
        });
        setCheckInRecords([]);
        return;
      }

      if (!data) {
        console.log('查詢結果為空');
        setCheckInRecords([]);
        return;
      }

      const formattedRecords = data.map((record: any) => ({
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
      }));

      console.log('格式化後的記錄:', formattedRecords);
      setCheckInRecords(formattedRecords);
      
      toast({
        title: "載入成功",
        description: `載入了 ${formattedRecords.length} 筆打卡記錄`,
      });
    } catch (error) {
      console.error('載入打卡記錄失敗:', error);
      toast({
        title: "載入失敗",
        description: "載入打卡記錄時發生錯誤",
        variant: "destructive"
      });
      setCheckInRecords([]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  return {
    checkInRecords,
    loading,
    loadCheckInRecords
  };
};
