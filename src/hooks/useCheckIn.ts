
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CheckInRecord } from '@/types';
import { 
  getUserTodayRecords, 
  handleLocationCheckIn, 
  handleIpCheckIn
} from '@/utils/checkInUtils';

export const useCheckIn = (userId: string) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [checkInMethod, setCheckInMethod] = useState<'location' | 'ip'>('location');
  const [actionType, setActionType] = useState<'check-in' | 'check-out'>('check-in');
  const [todayRecords, setTodayRecords] = useState<{ checkIn?: CheckInRecord, checkOut?: CheckInRecord }>({});

  useEffect(() => {
    if (userId) {
      const records = getUserTodayRecords(userId);
      setTodayRecords(records);

      // Set actionType based on existing records
      if (records.checkIn && !records.checkOut) {
        setActionType('check-out');
      }
    }
  }, [userId]);

  const onLocationCheckIn = () => {
    setLoading(true);
    setError(null);

    handleLocationCheckIn(
      userId,
      actionType,
      (record) => {
        setLoading(false);
        const actionMsg = actionType === 'check-in' ? '上班打卡' : '下班打卡';
        
        toast({
          title: `${actionMsg}成功！`,
          description: `您已成功在${record.details.locationName}${actionMsg}。距離: ${Math.round(record.details.distance || 0)}公尺`,
        });

        // Update records
        if (actionType === 'check-in') {
          setTodayRecords(prev => ({ ...prev, checkIn: record }));
        } else {
          setTodayRecords(prev => ({ ...prev, checkOut: record }));
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
    setLoading(true);
    setError(null);

    handleIpCheckIn(
      userId,
      actionType,
      (record) => {
        setLoading(false);
        const actionMsg = actionType === 'check-in' ? '上班打卡' : '下班打卡';
        
        toast({
          title: `${actionMsg}成功！`,
          description: `您已成功遠端${actionMsg}。IP: ${record.details.ip}`,
        });

        // Update records
        if (actionType === 'check-in') {
          setTodayRecords(prev => ({ ...prev, checkIn: record }));
        } else {
          setTodayRecords(prev => ({ ...prev, checkOut: record }));
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
