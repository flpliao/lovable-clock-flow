
import { useState, useEffect } from 'react';
import { SystemSettingsService } from '@/services/systemSettingsService';

export const useSystemSettings = () => {
  const [checkInDistanceLimit, setCheckInDistanceLimit] = useState<number>(500);
  const [loading, setLoading] = useState(true);

  const loadCheckInDistanceLimit = async () => {
    try {
      const distance = await SystemSettingsService.getCheckInDistanceLimit();
      setCheckInDistanceLimit(distance);
      console.log('📍 載入的打卡距離限制:', distance, '公尺');
    } catch (error) {
      console.error('載入打卡距離限制失敗:', error);
      setCheckInDistanceLimit(500); // 使用預設值
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCheckInDistanceLimit();
    
    // 初始化預設系統設定
    SystemSettingsService.initializeDefaultSettings();
  }, []);

  const refreshSettings = () => {
    setLoading(true);
    loadCheckInDistanceLimit();
  };

  return {
    checkInDistanceLimit,
    loading,
    refreshSettings
  };
};
