import { CheckInPointService } from '@/services/checkInPointService';
import { useCheckInPointStore } from '@/stores/checkInPointStore';
import { CheckInPoint } from '@/types/checkIn';
import { getCurrentPosition } from '@/utils/location';
import { showError } from '@/utils/toast';
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

    try {
      const checkInPoints = await CheckInPointService.getNearbyCheckInPoints(latitude, longitude);
      setCheckInPoints(checkInPoints);
    } catch (error) {
      showError(error.message);
    }

    setIsLoading(false);
  };

  const handleCreateCheckInPoint = async (checkpoint: Omit<CheckInPoint, 'id' | 'created_at'>) => {
    try {
      const newCheckInPoints = await CheckInPointService.createCheckInPoint(checkpoint);
      addCheckInPoint(newCheckInPoints);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleUpdateCheckInPoint = async (id: string, checkpoint: Partial<CheckInPoint>) => {
    try {
      const updatedCheckInPoints = await CheckInPointService.updateCheckInPoint(id, checkpoint);
      setCheckInPoint(id, updatedCheckInPoints);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleDeleteCheckInPoint = async (id: string) => {
    try {
      await CheckInPointService.deleteCheckInPoint(id);
      removeCheckInPoint(id);
    } catch (error) {
      showError(error.message);
    }
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
