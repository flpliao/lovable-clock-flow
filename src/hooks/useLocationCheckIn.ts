import { Department } from '@/components/departments/types';
import { useCurrentUser } from '@/hooks/useStores';
import { supabase } from '@/integrations/supabase/client';
import { CheckInRecord } from '@/types';
import {
    isWithinCheckInRange
} from '@/utils/departmentCheckInUtils';
import { getCurrentPosition } from '@/utils/geolocationUtils';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from './use-toast';
import { useSupabaseCheckIn } from './useSupabaseCheckIn';

export const useLocationCheckIn = (userId: string, actionType: 'check-in' | 'check-out') => {
  const { createCheckInRecord } = useSupabaseCheckIn();
  const currentUser = useCurrentUser();
  const [distance, setDistance] = useState<number | null>(null);

  // 查詢部門資料
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*');
      
      if (error) throw error;
      
      // Transform the data to match Department type
      return (data || []).map(item => ({
        ...item,
        type: item.type as 'headquarters' | 'branch' | 'store' | 'department'
      })) as Department[];
    }
  });

  // 查詢系統設定
  const { data: systemSettings } = useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*');
      
      if (error) throw error;
      
      // Transform settings array to object
      const settingsObj: Record<string, string> = {};
      data?.forEach(setting => {
        settingsObj[setting.setting_key] = setting.setting_value;
      });
      
      return settingsObj;
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
      console.log('🚀 開始位置打卡流程:', {
        userId,
        userName: currentUser.name,
        userDepartment: currentUser.department
      });

      // 取得位置
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      console.log('📍 用戶位置:', { latitude, longitude });

      // 系統距離限制設定
      const systemDistanceLimit = systemSettings?.check_in_distance_limit ? 
        parseInt(systemSettings.check_in_distance_limit) : 500;

      console.log('⚙️ 系統設定:', { systemDistanceLimit });

      let targetDepartment: Department | null = null;
      let locationName = '總公司';

      console.log('🔍 所有部門資料:', departments.map(d => ({ id: d.id, name: d.name })));
      console.log('👀 尋找部門:', currentUser.department);

      // 如果員工有部門，尋找對應的部門資料
      if (currentUser.department) {
        // 使用完全匹配來找部門
        targetDepartment = departments.find(dept => dept.name === currentUser.department);
        
        console.log('🏢 部門查詢結果:', {
          searchDepartment: currentUser.department,
          foundDepartment: targetDepartment?.name,
          foundDepartmentId: targetDepartment?.id,
          gpsStatus: targetDepartment?.gps_status,
          coordinates: targetDepartment ? {
            lat: targetDepartment.latitude,
            lng: targetDepartment.longitude
          } : null
        });

        if (!targetDepartment) {
          console.error('❌ 找不到部門，所有可用部門名稱:', departments.map(d => d.name));
          toast({
            title: "打卡失敗",
            description: `找不到部門「${currentUser.department}」的設定資料，請聯繫管理者檢查部門設定`,
            variant: "destructive",
          });
          return false;
        }

        // 檢查部門GPS是否設定完成
        if (targetDepartment.gps_status !== 'converted' || !targetDepartment.latitude || !targetDepartment.longitude) {
          toast({
            title: "打卡失敗",
            description: `部門「${targetDepartment.name}」的GPS座標尚未設定完成，請聯繫管理者`,
            variant: "destructive",
          });
          return false;
        }

        locationName = targetDepartment.name;
      }

      // 如果沒有部門或部門GPS未設定，使用總公司位置（從geolocation.ts）
      if (!targetDepartment) {
        // 導入總公司座標
        const { COMPANY_LOCATION } = await import('@/utils/geolocation');
        targetDepartment = {
          id: 'headquarters',
          name: '總公司',
          latitude: COMPANY_LOCATION.latitude,
          longitude: COMPANY_LOCATION.longitude,
          gps_status: 'converted',
          address_verified: true
        } as Department;
        
        console.log('🏢 使用總公司位置:', COMPANY_LOCATION);
      }

      // 檢查打卡範圍
      const rangeCheck = isWithinCheckInRange(
        latitude, 
        longitude, 
        targetDepartment, 
        systemDistanceLimit
      );
      
      setDistance(rangeCheck.distance);

      console.log('📐 距離檢查結果:', rangeCheck);

      if (!rangeCheck.isWithinRange) {
        toast({
          title: "打卡失敗",
          description: `距離${locationName}過遠 (${rangeCheck.distance}公尺)，超過允許範圍 ${rangeCheck.allowedDistance}公尺`,
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
          locationName: locationName,
          departmentLatitude: targetDepartment.latitude,
          departmentLongitude: targetDepartment.longitude,
          departmentName: targetDepartment.name
        }
      };

      console.log('📝 準備建立打卡記錄:', checkInData);

      const success = await createCheckInRecord(checkInData);
      
      if (success) {
        console.log('✅ 打卡成功');
        return true;
      }

      return false;
    } catch (error) {
      console.error('❌ 位置打卡失敗:', error);
      
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
