
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CheckInRecord } from '@/types';
import { 
  handleLocationCheckIn, 
  handleIpCheckIn
} from '@/utils/checkInHandlers';
import { useSupabaseCheckIn } from './useSupabaseCheckIn';

export const useCheckIn = (userId: string) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [checkInMethod, setCheckInMethod] = useState<'location' | 'ip'>('location');
  const [actionType, setActionType] = useState<'check-in' | 'check-out'>('check-in');
  const [todayRecords, setTodayRecords] = useState<{ checkIn?: CheckInRecord, checkOut?: CheckInRecord }>({});

  const { createCheckInRecord, getTodayCheckInRecords } = useSupabaseCheckIn();

  // 載入今日打卡記錄
  useEffect(() => {
    const loadTodayRecords = async () => {
      if (!userId) {
        console.log('No userId provided, skipping records load');
        setTodayRecords({});
        return;
      }

      console.log('Loading today records for user:', userId);
      
      try {
        const records = await getTodayCheckInRecords(userId);
        console.log('Loaded today records:', records);
        setTodayRecords(records);

        // 設定下一個動作類型
        if (records.checkIn && !records.checkOut) {
          setActionType('check-out');
        } else {
          setActionType('check-in');
        }
      } catch (error) {
        console.error('Error loading today records:', error);
        // 不顯示錯誤訊息，避免干擾用戶體驗
        setTodayRecords({});
      }
    };

    loadTodayRecords();
  }, [userId, getTodayCheckInRecords]);

  const onLocationCheckIn = () => {
    if (!userId) {
      toast({
        title: "打卡失敗",
        description: "請先登入",
        variant: "destructive",
      });
      return;
    }

    console.log('Location check-in with user ID:', userId);

    setLoading(true);
    setError(null);

    handleLocationCheckIn(
      userId,
      actionType,
      async (record) => {
        setLoading(false);
        const actionMsg = actionType === 'check-in' ? '上班打卡' : '下班打卡';
        
        console.log('Creating check-in record:', record);
        
        // 儲存到 Supabase
        const success = await createCheckInRecord(record);
        if (success) {
          toast({
            title: `${actionMsg}成功！`,
            description: `您已成功在${record.details.locationName}${actionMsg}。距離: ${Math.round(record.details.distance || 0)}公尺`,
          });

          // 更新本地狀態
          if (actionType === 'check-in') {
            setTodayRecords(prev => ({ ...prev, checkIn: record }));
            setActionType('check-out');
          } else {
            setTodayRecords(prev => ({ ...prev, checkOut: record }));
          }
        } else {
          toast({
            title: "打卡失敗",
            description: "無法儲存打卡記錄，請稍後再試",
            variant: "destructive",
          });
        }
      },
      (errorMessage) => {
        setLoading(false);
        setError(errorMessage);
        
        toast({
          title: "打卡失敗",
          description: errorMessage,
          variant: "destructive",
        });
      },
      setDistance
    );
  };

  const onIpCheckIn = () => {
    if (!userId) {
      toast({
        title: "打卡失敗",
        description: "請先登入",
        variant: "destructive",
      });
      return;
    }

    console.log('IP check-in with user ID:', userId);

    setLoading(true);
    setError(null);

    handleIpCheckIn(
      userId,
      actionType,
      async (record) => {
        setLoading(false);
        const actionMsg = actionType === 'check-in' ? '上班打卡' : '下班打卡';
        
        console.log('Creating IP check-in record:', record);
        
        // 儲存到 Supabase
        const success = await createCheckInRecord(record);
        if (success) {
          toast({
            title: `${actionMsg}成功！`,
            description: `您已成功遠端${actionMsg}。IP: ${record.details.ip}`,
          });

          // 更新本地狀態
          if (actionType === 'check-in') {
            setTodayRecords(prev => ({ ...prev, checkIn: record }));
            setActionType('check-out');
          } else {
            setTodayRecords(prev => ({ ...prev, checkOut: record }));
          }
        } else {
          toast({
            title: "打卡失敗",
            description: "無法儲存打卡記錄，請稍後再試",
            variant: "destructive",
          });
        }
      },
      (errorMessage) => {
        setLoading(false);
        setError(errorMessage);
        
        toast({
          title: "無法取得網路資訊",
          description: errorMessage,
          variant: "destructive",
        });
      }
    );
  };

  return {
    loading,
    error,
    distance,
    checkInMethod,
    setCheckInMethod,
    actionType,
    setActionType,
    todayRecords,
    onLocationCheckIn,
    onIpCheckIn
  };
};
