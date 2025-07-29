import {
  createCheckInPoint as createCheckInPointService,
  deleteCheckInPoint as deleteCheckInPointService,
  getNearbyCheckInPoints,
  updateCheckInPoint as updateCheckInPointService,
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
    addCheckInPoint,
    updateCheckInPoint: updateCheckInStore,
    removeCheckInPoint: removeCheckInStore,
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

  const createCheckInPoint = async (checkpoint: Omit<CheckInPoint, 'id' | 'created_at'>) => {
    try {
      const newCheckInPoints = await createCheckInPointService(checkpoint);
      addCheckInPoint(newCheckInPoints[0]);
    } catch (error) {
      console.error('新增打卡點失敗:', error);
      throw error;
    }
  };

  const updateCheckInPoint = async (id: string, checkpoint: Partial<CheckInPoint>) => {
    try {
      const updatedCheckInPoints = await updateCheckInPointService(id, checkpoint);
      updateCheckInStore(id, updatedCheckInPoints[0]);
    } catch (error) {
      console.error('更新打卡點失敗:', error);
      throw error;
    }
  };

  const deleteCheckInPoint = async (id: string) => {
    try {
      await deleteCheckInPointService(id);
      removeCheckInStore(id);
    } catch (error) {
      console.error('刪除打卡點失敗:', error);
      throw error;
    }
  };

  return {
    data,
    loading,
    loadCheckInPoints,
    createCheckInPoint,
    updateCheckInPoint,
    deleteCheckInPoint,
    currentPos,
  };
}
