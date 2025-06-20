
import { useState, useEffect, useCallback } from 'react';
import { useSupabaseCheckIn } from './useSupabaseCheckIn';
import { useDepartmentManagementContext } from '@/components/departments/DepartmentManagementContext';
import { useSystemSettings } from './useSystemSettings';
import { isWithinCheckInRange, isDepartmentReadyForCheckIn } from '@/utils/departmentCheckInUtils';
import { toast } from './use-toast';
import { CheckInRecord } from '@/types';

export const useCheckIn = (userId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [checkInMethod, setCheckInMethod] = useState<'location' | 'ip'>('location');
  
  const { createCheckInRecord, getTodayCheckInRecords } = useSupabaseCheckIn();
  const { departments } = useDepartmentManagementContext();
  const { checkInDistanceLimit } = useSystemSettings(); // 使用系統設定的距離限制
  
  // 今日打卡記錄
  const [todayRecords, setTodayRecords] = useState<{
    checkIn?: CheckInRecord;
    checkOut?: CheckInRecord;
  }>({});

  // 載入今日打卡記錄
  const loadTodayRecords = useCallback(async () => {
    if (!userId) return;
    
    try {
      const records = await getTodayCheckInRecords(userId);
      setTodayRecords(records);
      console.log('📅 今日打卡記錄:', records);
    } catch (error) {
      console.error('載入今日打卡記錄失敗:', error);
    }
  }, [userId, getTodayCheckInRecords]);

  // 初始載入
  useEffect(() => {
    loadTodayRecords();
  }, [loadTodayRecords]);

  // 判斷當前應該進行的動作類型
  const actionType: 'check-in' | 'check-out' = todayRecords.checkIn && !todayRecords.checkOut ? 'check-out' : 'check-in';

  // 位置打卡
  const onLocationCheckIn = async () => {
    if (!userId) {
      toast({
        title: "打卡失敗",
        description: "使用者資訊不完整",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 取得使用者位置
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      console.log('📍 使用者位置:', { latitude, longitude });

      // 取得使用者部門資料（這裡需要根據實際業務邏輯調整）
      const userDepartment = departments.find(dept => 
        // 這裡應該根據使用者的部門資訊來匹配
        // 暫時使用第一個可用的部門
        isDepartmentReadyForCheckIn(dept)
      );

      let locationName = '總公司';
      let departmentLat: number | null = null;
      let departmentLng: number | null = null;
      let departmentName: string | null = null;

      if (userDepartment) {
        // 檢查是否在允許範圍內
        const rangeCheck = isWithinCheckInRange(
          latitude, 
          longitude, 
          userDepartment,
          checkInDistanceLimit // 使用系統設定的距離限制
        );
        
        setDistance(rangeCheck.distance);
        locationName = userDepartment.name;
        departmentLat = userDepartment.latitude;
        departmentLng = userDepartment.longitude;
        departmentName = userDepartment.name;

        if (!rangeCheck.isWithinRange) {
          setError(`距離過遠：${rangeCheck.distance}公尺 (允許範圍：${rangeCheck.allowedDistance}公尺)`);
          toast({
            title: "打卡失敗",
            description: `您距離 ${locationName} 過遠，目前距離 ${rangeCheck.distance} 公尺，允許範圍為 ${rangeCheck.allowedDistance} 公尺`,
            variant: "destructive",
          });
          return;
        }
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
          distance: distance,
          locationName: locationName,
          departmentLatitude: departmentLat,
          departmentLongitude: departmentLng,
          departmentName: departmentName,
          gpsComparisonResult: userDepartment ? {
            target_location: {
              name: userDepartment.name,
              latitude: userDepartment.latitude,
              longitude: userDepartment.longitude
            },
            user_location: {
              latitude: latitude,
              longitude: longitude
            },
            distance: distance,
            allowed_distance: checkInDistanceLimit, // 使用系統設定的距離限制
            is_within_range: true
          } : null
        }
      };

      const success = await createCheckInRecord(checkInData);
      
      if (success) {
        toast({
          title: actionType === 'check-in' ? "上班打卡成功" : "下班打卡成功",
          description: distance !== null 
            ? `位置：${locationName}，距離：${distance}公尺` 
            : `位置：${locationName}`,
        });
        
        // 重新載入今日記錄
        await loadTodayRecords();
      }

    } catch (error) {
      console.error('位置打卡失敗:', error);
      let errorMessage = '打卡失敗，請稍後重試';
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '請允許存取位置權限';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '無法取得位置資訊';
            break;
          case error.TIMEOUT:
            errorMessage = '位置請求逾時';
            break;
        }
      }
      
      setError(errorMessage);
      toast({
        title: "打卡失敗",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // IP打卡
  const onIpCheckIn = async () => {
    if (!userId) {
      toast({
        title: "打卡失敗",
        description: "使用者資訊不完整",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 取得IP位址
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      
      // 建立打卡記錄
      const checkInData: Omit<CheckInRecord, 'id'> = {
        userId: userId,
        timestamp: new Date().toISOString(),
        type: 'ip',
        status: 'success',
        action: actionType,
        details: {
          ip: ipData.ip,
          locationName: 'IP打卡'
        }
      };

      const success = await createCheckInRecord(checkInData);
      
      if (success) {
        toast({
          title: actionType === 'check-in' ? "上班打卡成功" : "下班打卡成功",
          description: `IP位址：${ipData.ip}`,
        });
        
        // 重新載入今日記錄
        await loadTodayRecords();
      }

    } catch (error) {
      console.error('IP打卡失敗:', error);
      const errorMessage = 'IP打卡失敗，請稍後重試';
      setError(errorMessage);
      toast({
        title: "打卡失敗",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    distance,
    checkInMethod,
    setCheckInMethod,
    actionType,
    todayRecords,
    onLocationCheckIn,
    onIpCheckIn
  };
};

// 取得當前位置的輔助函數
const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('此瀏覽器不支援地理位置功能'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};
