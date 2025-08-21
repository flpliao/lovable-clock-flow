
import { useState } from 'react';
import { useCheckInTodayRecords } from './useCheckInTodayRecords';
import { useLocationCheckInWithDepartment } from './useLocationCheckInWithDepartment';
import { useIpCheckIn } from './useIpCheckIn';

export const useCheckIn = (userId: string, selectedDepartmentId?: string | null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkInMethod, setCheckInMethod] = useState<'location' | 'ip'>('location');
  
  // 使用分離的 hooks
  const { todayRecords, actionType, loadTodayRecords } = useCheckInTodayRecords(userId);
  const { distance, onLocationCheckIn: performLocationCheckIn } = useLocationCheckInWithDepartment(userId, actionType, selectedDepartmentId || null);
  const { onIpCheckIn: performIpCheckIn } = useIpCheckIn(userId, actionType);

  // 位置打卡
  const onLocationCheckIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const success = await performLocationCheckIn();
      if (success) {
        // 重新載入今日記錄
        await loadTodayRecords();
      }
    } catch (error) {
      // 錯誤已在 useLocationCheckInWithDepartment 中處理
      setError(error instanceof Error ? error.message : '位置打卡失敗');
    } finally {
      setLoading(false);
    }
  };

  // IP打卡
  const onIpCheckIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const success = await performIpCheckIn();
      if (success) {
        // 重新載入今日記錄
        await loadTodayRecords();
      }
    } catch (error) {
      // 錯誤已在 useIpCheckIn 中處理
      setError('IP打卡失敗');
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
