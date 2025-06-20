
import { useSupabaseCheckIn } from './useSupabaseCheckIn';
import { useUser } from '@/contexts/UserContext';
import { toast } from './use-toast';
import { getCurrentPosition } from '@/utils/geolocationUtils';
import { 
  getDepartmentForCheckIn, 
  isWithinCheckInRange 
} from '@/utils/departmentCheckInUtils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { CheckInRecord } from '@/types';

export const useLocationCheckIn = (userId: string, actionType: 'check-in' | 'check-out') => {
  const { createCheckInRecord } = useSupabaseCheckIn();
  const { currentUser } = useUser();
  const [distance, setDistance] = useState<number | null>(null);

  // 查詢部門資料
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  // 查詢系統設定
  const { data: systemSettings } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const onLocationCheckIn = async () => {
    if (!userId || !currentUser) {
      toast({
        title: "打卡失敗",
        description: "使用者資訊不完整",
        variant: "destructive",
      });
      return false;
    }

    try {
      // 取得位置
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      // 取得部門資料
      const department = getDepartmentForCheckIn(departments, currentUser.department);
      
      if (!department) {
        toast({
          title: "打卡失敗",
          description: "找不到部門資料",
          variant: "destructive",
        });
        return false;
      }

      // 檢查打卡範圍
      const systemDistanceLimit = systemSettings?.check_in_distance_limit || 500;
      const rangeCheck = isWithinCheckInRange(
        latitude, 
        longitude, 
        department, 
        systemDistanceLimit
      );
      
      setDistance(rangeCheck.distance);

      if (!rangeCheck.isWithinRange) {
        toast({
          title: "打卡失敗",
          description: `距離過遠 (${rangeCheck.distance}公尺)，超過允許範圍 ${rangeCheck.allowedDistance}公尺`,
          variant: "destructive",
        });
        return false;
      }

      // 建立打卡記錄
      const checkInData: Omit<CheckInRecord, 'id'> = {
        userId: userId,
        timestamp: new Date().toISOString(),
        type: 'location',
        status: 'success',
        action: actionType,
        details: {
          latitude: latitude,
          longitude: longitude,
          distance: rangeCheck.distance,
          locationName: department.name,
          address: department.location || ''
        }
      };

      const success = await createCheckInRecord(checkInData);
      
      if (success) {
        // 移除成功提醒，保持簡潔的使用者體驗
        return true;
      }

      return false;
    } catch (error) {
      console.error('位置打卡失敗:', error);
      
      if (error instanceof GeolocationPositionError) {
        let errorMessage = '無法取得位置資訊';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '請允許位置存取權限';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '位置資訊無法取得';
            break;
          case error.TIMEOUT:
            errorMessage = '位置取得超時，請重試';
            break;
        }
        
        toast({
          title: "打卡失敗",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "打卡失敗",
          description: "位置打卡失敗，請稍後重試",
          variant: "destructive",
        });
      }
      
      throw error;
    }
  };

  return {
    distance,
    onLocationCheckIn
  };
};
