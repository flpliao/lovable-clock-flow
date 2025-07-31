import {
  createShift as createShiftService,
  deleteShift as deleteShiftService,
  getAllShifts,
  getShift,
  getShifts,
  updateShift as updateShiftService,
} from '@/services/shiftService';
import { useShiftStore } from '@/stores/shiftStore';
import { CreateShiftData, UpdateShiftData } from '@/types/shift';
import { useState } from 'react';

export const useShift = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { shifts, setShifts, addShift, updateShift, removeShift } = useShiftStore();

  // 載入所有班次
  const loadAllShifts = async () => {
    if (isLoading || shifts.length > 0) return;

    setIsLoading(true);
    setError(null);

    const data = await getAllShifts();
    setShifts(data);
    setIsLoading(false);
    return data;
  };

  // 載入班次列表（分頁）
  const loadShifts = async (params?: { page?: number; per_page?: number; search?: string }) => {
    setIsLoading(true);
    setError(null);

    const data = await getShifts(params);
    setShifts(data);
    setIsLoading(false);
    return data;
  };

  // 載入單一班次
  const loadShift = async (slug: string) => {
    setIsLoading(true);
    setError(null);

    const data = await getShift(slug);
    setIsLoading(false);
    return data;
  };

  // 建立班次
  const createShiftData = async (shiftData: CreateShiftData) => {
    setIsLoading(true);
    setError(null);

    const newShift = await createShiftService(shiftData);
    if (newShift) {
      addShift(newShift);
    }
    setIsLoading(false);
    return newShift;
  };

  // 更新班次
  const updateShiftData = async (slug: string, shiftData: UpdateShiftData) => {
    setIsLoading(true);
    setError(null);

    const updatedShift = await updateShiftService(slug, shiftData);
    if (updatedShift) {
      updateShift(slug, updatedShift);
    }
    setIsLoading(false);
    return updatedShift;
  };

  // 刪除班次
  const deleteShiftData = async (slug: string) => {
    setIsLoading(true);
    setError(null);

    const success = await deleteShiftService(slug);
    if (success) {
      removeShift(slug);
    }
    setIsLoading(false);
    return success;
  };

  // 清除錯誤
  const clearError = () => {
    setError(null);
  };

  return {
    // 狀態
    shifts,
    isLoading,
    error,

    // 操作方法
    loadAllShifts,
    loadShifts,
    loadShift,
    createShiftData,
    updateShiftData,
    deleteShiftData,
    clearError,
  };
};
