
import { useState } from 'react';
import { useDepartmentManagementContext } from '@/components/departments/DepartmentManagementContext';
import { useSystemSettings } from './useSystemSettings';
import { useSupabaseCheckIn } from './useSupabaseCheckIn';
import { isWithinCheckInRange, isDepartmentReadyForCheckIn } from '@/utils/departmentCheckInUtils';
import { getCurrentPosition } from '@/utils/geolocationUtils';
import { toast } from './use-toast';
import { CheckInRecord } from '@/types';

export const useLocationCheckIn = (userId: string, actionType: 'check-in' | 'check-out') => {
  const [distance, setDistance] = useState<number | null>(null);
  const { departments } = useDepartmentManagementContext();
  const { checkInDistanceLimit } = useSystemSettings();
  const { createCheckInRecord } = useSupabaseCheckIn();

  const onLocationCheckIn = async () => {
    if (!userId) {
      toast({
        title: "打卡失敗",
        description: "使用者資訊不完整",
        variant: "destructive",
      });
      return false;
    }

    try {
      // 取得使用者位置
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      console.log('📍 使用者位置:', { latitude, longitude });

      // 取得使用者部門資料
      const userDepartment = departments.find(dept => 
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
          checkInDistanceLimit
        );
        
        setDistance(rangeCheck.distance);
        locationName = userDepartment.name;
        departmentLat = userDepartment.latitude;
        departmentLng = userDepartment.longitude;
        departmentName = userDepartment.name;

        if (!rangeCheck.isWithinRange) {
          const errorMsg = `距離過遠：${rangeCheck.distance}公尺 (允許範圍：${rangeCheck.allowedDistance}公尺)`;
          toast({
            title: "打卡失敗",
            description: `您距離 ${locationName} 過遠，目前距離 ${rangeCheck.distance} 公尺，允許範圍為 ${rangeCheck.allowedDistance} 公尺`,
            variant: "destructive",
          });
          throw new Error(errorMsg);
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
            allowed_distance: checkInDistanceLimit,
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
        
        return true;
      }

      return false;
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
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "打卡失敗",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  };

  return {
    distance,
    onLocationCheckIn
  };
};
