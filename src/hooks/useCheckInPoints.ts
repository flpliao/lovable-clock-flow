import { CheckInPointService, type CheckInPoint } from '@/services/checkInPointService';
import { useCheckInPointStore } from '@/stores/checkInPointStore';
import { useState } from 'react';

// 重新導出 CheckInPoint 介面，保持向後相容性
export type { CheckInPoint } from '@/services/checkInPointService';

export function useCheckInPoints() {
  const [loading, setLoading] = useState(false);
  const {
    checkInPoints: data,
    setCheckInPoints,
    addCheckInPoint: addToStore,
    updateCheckInPoint: updateInStore,
    removeCheckInPoint: removeFromStore,
  } = useCheckInPointStore();

  const loadCheckInPoints = async () => {
    if (data.length > 0) return;

    setLoading(true);
    try {
      const checkInPoints = await CheckInPointService.loadCheckInPoints();
      setCheckInPoints(checkInPoints);
    } catch (error) {
      console.error('載入打卡點失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCheckpoint = async (checkpoint: Omit<CheckInPoint, 'id' | 'created_at'>) => {
    try {
      const newCheckInPoints = await CheckInPointService.addCheckInPoint(checkpoint);
      addToStore(newCheckInPoints[0]);
    } catch (error) {
      console.error('新增打卡點失敗:', error);
      throw error;
    }
  };

  const updateCheckpoint = async (id: number, checkpoint: Partial<CheckInPoint>) => {
    try {
      const updatedCheckInPoints = await CheckInPointService.updateCheckInPoint(id, checkpoint);
      updateInStore(id, updatedCheckInPoints[0]);
    } catch (error) {
      console.error('更新打卡點失敗:', error);
      throw error;
    }
  };

  const deleteCheckpoint = async (id: number) => {
    try {
      await CheckInPointService.deleteCheckInPoint(id);
      removeFromStore(id);
    } catch (error) {
      console.error('刪除打卡點失敗:', error);
      throw error;
    }
  };

  return {
    data,
    loading,
    loadCheckInPoints,
    addCheckpoint,
    updateCheckpoint,
    deleteCheckpoint,
  };
}
