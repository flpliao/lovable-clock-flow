import {
  createCheckInPoint,
  deleteCheckInPoint,
  getNearbyCheckInPoints,
  updateCheckInPoint,
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
    setCheckInPoint,
    removeCheckInPoint,
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

  const handleCreateCheckInPoint = async (checkpoint: Omit<CheckInPoint, 'id' | 'created_at'>) => {
    const newCheckInPoints = await createCheckInPoint(checkpoint);
    addCheckInPoint(newCheckInPoints);
  };

  const handleUpdateCheckInPoint = async (id: string, checkpoint: Partial<CheckInPoint>) => {
    const updatedCheckInPoints = await updateCheckInPoint(id, checkpoint);
    setCheckInPoint(id, updatedCheckInPoints);
  };

  const handleDeleteCheckInPoint = async (id: string) => {
    const success = await deleteCheckInPoint(id);

    if (success) {
      removeCheckInPoint(id);
    }

    return success;
  };

  return {
    data,
    isLoading,
    loadCheckInPoints,
    handleCreateCheckInPoint,
    handleUpdateCheckInPoint,
    handleDeleteCheckInPoint,
    currentPos,
  };
}
