import { useToast } from '@/hooks/useToast';
import { supabase } from '@/integrations/supabase/client';
import { CheckInRecord } from '@/types';
import { useCallback, useRef, useState } from 'react';

export const useCheckInRecords = () => {
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const loadingRef = useRef(false);

  const loadCheckInRecords = useCallback(async (userId?: string) => {
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
        // 只在網路或嚴重錯誤時顯示 toast，避免重複提示
        if (error.code === 'PGRST301' || error.message.includes('network')) {
          toast({
            title: "載入失敗",
            description: `無法載入打卡記錄: ${error.message}`,
            variant: "destructive"
          });
        }
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
      
      console.log(`載入了 ${formattedRecords.length} 筆打卡記錄`);
    } catch (error) {
      console.error('載入打卡記錄失敗:', error);
      // 只在關鍵錯誤時顯示提示
      if (error instanceof Error && error.message.includes('Load failed')) {
        console.error('檢測到 Load failed 錯誤，不顯示 toast 避免重複提示');
      } else {
        toast({
          title: "載入失敗",
          description: "載入打卡記錄時發生錯誤",
          variant: "destructive"
        });
      }
      setCheckInRecords([]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  return {
    checkInRecords,
    loading,
    loadCheckInRecords
  };
};
