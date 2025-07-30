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
  const [isLoading, setIsLoading] = useState(false);
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
    if (data.length > 0 || isLoading) return;

    setIsLoading(true);
    const { latitude, longitude } = await getCurrentPosition();
    setCurrentPos({ latitude, longitude });
    const checkInPoints = await getNearbyCheckInPoints(latitude, longitude);
    setCheckInPoints(checkInPoints);
    setIsLoading(false);
  };

  const createCheckInPoint = async (checkpoint: Omit<CheckInPoint, 'id' | 'created_at'>) => {
    const newCheckInPoints = await createCheckInPointService(checkpoint);
    addCheckInPoint(newCheckInPoints);
  };

  const updateCheckInPoint = async (id: string, checkpoint: Partial<CheckInPoint>) => {
    const updatedCheckInPoints = await updateCheckInPointService(id, checkpoint);
    updateCheckInStore(id, updatedCheckInPoints);
  };

  const deleteCheckInPoint = async (id: string) => {
    const status = await deleteCheckInPointService(id);

    if (status === 'success') {
      removeCheckInStore(id);
    }
  };

  return {
    data,
    isLoading,
    loadCheckInPoints,
    createCheckInPoint,
    updateCheckInPoint,
    deleteCheckInPoint,
    currentPos,
  };
}
