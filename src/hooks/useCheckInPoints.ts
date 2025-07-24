import {
  addCheckInPoint,
  deleteCheckInPoint,
  getNearbyCheckInPoints,
  updateCheckInPoint,
} from '@/services/checkInPointService';
import { useCheckInPointStore } from '@/stores/checkInPointStore';
import { CheckInPoint } from '@/types/checkIn';
import { getCurrentPosition } from '@/utils/location';
import { useState } from 'react';

export function useCheckInPoints() {
  const [loading, setLoading] = useState(false);
  const [currentPos, setCurrentPos] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
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
      const { latitude, longitude } = await getCurrentPosition();
      setCurrentPos({ latitude, longitude });
      const checkInPoints = await getNearbyCheckInPoints(latitude, longitude);
      setCheckInPoints(checkInPoints);
    } catch (error) {
      console.error('載入打卡點失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCheckpoint = async (checkpoint: Omit<CheckInPoint, 'id' | 'created_at'>) => {
    try {
      const newCheckInPoints = await addCheckInPoint(checkpoint);
      addToStore(newCheckInPoints[0]);
    } catch (error) {
      console.error('新增打卡點失敗:', error);
      throw error;
    }
  };

  const updateCheckpoint = async (id: number, checkpoint: Partial<CheckInPoint>) => {
    try {
      const updatedCheckInPoints = await updateCheckInPoint(id, checkpoint);
      updateInStore(id, updatedCheckInPoints[0]);
    } catch (error) {
      console.error('更新打卡點失敗:', error);
      throw error;
    }
  };

  const deleteCheckpoint = async (id: number) => {
    try {
      await deleteCheckInPoint(id);
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
    currentPos,
  };
}
