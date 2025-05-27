
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { CheckInRecord } from '@/types';

export const useSupabaseCheckIn = () => {
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useUser();
  const loadingRef = useRef(false);

  // 載入打卡記錄
  const loadCheckInRecords = async (userId?: string) => {
    if (loadingRef.current) return; // 防止重複載入
    
    try {
      const targetUserId = userId || currentUser?.id;
      if (!targetUserId) {
        console.log('無使用者ID，無法載入記錄');
        return;
      }

      loadingRef.current = true;
      setLoading(true);
      
      console.log('開始載入打卡記錄，使用者ID:', targetUserId);

      const { data, error } = await supabase
        .from('check_in_records')
        .select('*')
        .eq('user_id', targetUserId)
        .order('timestamp', { ascending: false })
        .limit(100); // 限制載入數量

      console.log('Supabase 查詢結果:', { data, error });

      if (error) {
        console.error('Error loading check-in records:', error);
        toast({
          title: "載入失敗",
          description: "無法載入打卡記錄",
          variant: "destructive"
        });
        setCheckInRecords([]);
        return;
      }

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
        }
      }));

      console.log('格式化後的記錄:', formattedRecords);
      setCheckInRecords(formattedRecords);
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

  // 建立打卡記錄
  const createCheckInRecord = async (record: Omit<CheckInRecord, 'id'>) => {
    if (!currentUser) {
      toast({
        title: "錯誤",
        description: "請先登入",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('建立打卡記錄:', record);

      // 資料轉換和檢查
      const distance = record.details.distance 
        ? Math.round(record.details.distance) 
        : null;
      
      console.log('處理後的距離:', distance);
      
      // 檢查資料類型
      const recordData = {
        user_id: currentUser.id,
        staff_id: currentUser.id,
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
          description: "無法記錄打卡資料",
          variant: "destructive"
        });
        return false;
      }

      console.log('打卡記錄建立成功:', data);
      
      // 重新載入記錄
      await loadCheckInRecords();
      
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

  // 取得今日打卡記錄
  const getTodayCheckInRecords = async (userId?: string) => {
    try {
      const targetUserId = userId || currentUser?.id;
      if (!targetUserId) return { checkIn: undefined, checkOut: undefined };

      const today = new Date().toISOString().split('T')[0];
      
      console.log('查詢今日記錄，日期:', today, '使用者ID:', targetUserId);
      
      const { data, error } = await supabase
        .from('check_in_records')
        .select('*')
        .eq('user_id', targetUserId)
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

      return {
        checkIn: checkInRecord ? {
          id: checkInRecord.id,
          userId: checkInRecord.user_id,
          timestamp: checkInRecord.timestamp,
          type: checkInRecord.type as 'location' | 'ip',
          status: checkInRecord.status as 'success' | 'failed',
          action: checkInRecord.action as 'check-in' | 'check-out',
          details: {
            latitude: checkInRecord.latitude,
            longitude: checkInRecord.longitude,
            distance: checkInRecord.distance,
            ip: checkInRecord.ip_address,
            locationName: checkInRecord.location_name
          }
        } : undefined,
        checkOut: checkOutRecord ? {
          id: checkOutRecord.id,
          userId: checkOutRecord.user_id,
          timestamp: checkOutRecord.timestamp,
          type: checkOutRecord.type as 'location' | 'ip',
          status: checkOutRecord.status as 'success' | 'failed',
          action: checkOutRecord.action as 'check-in' | 'check-out',
          details: {
            latitude: checkOutRecord.latitude,
            longitude: checkOutRecord.longitude,
            distance: checkOutRecord.distance,
            ip: checkOutRecord.ip_address,
            locationName: checkOutRecord.location_name
          }
        } : undefined
      };
    } catch (error) {
      console.error('取得今日打卡記錄失敗:', error);
      return { checkIn: undefined, checkOut: undefined };
    }
  };

  // 初始載入 - 使用 useEffect 但避免重複載入
  useEffect(() => {
    if (currentUser && !loadingRef.current) {
      console.log('useEffect 觸發載入記錄，使用者ID:', currentUser.id);
      loadCheckInRecords();
    }
  }, [currentUser?.id]); // 只在 currentUser.id 改變時載入

  return {
    checkInRecords,
    loading,
    createCheckInRecord,
    getTodayCheckInRecords,
    loadCheckInRecords,
    refreshData: loadCheckInRecords
  };
};
