import {
  createShift as createShiftService,
  deleteShift as deleteShiftService,
  getAllShifts,
  getShift,
  getShifts,
  updateShift as updateShiftService,
} from '@/services/shiftService';
import {
  createWorkSchedule as createWorkScheduleService,
  deleteWorkSchedule as deleteWorkScheduleService,
  updateWorkSchedule as updateWorkScheduleService,
} from '@/services/workScheduleService';
import { useShiftStore } from '@/stores/shiftStore';
import { CreateShiftData, UpdateShiftData } from '@/types/shift';
import { CreateWorkScheduleData, UpdateWorkScheduleData } from '@/types/workSchedule';
import { useState } from 'react';

export const useShift = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { shifts, setShifts, addShift, setShift, removeShift } = useShiftStore();

  // 載入所有班次
  const loadAllShifts = async () => {
    if (isLoading || shifts.length > 0) return;

    setIsLoading(true);

    const data = await getAllShifts();
    setShifts(data);
    setIsLoading(false);
    return data;
  };

  // 載入班次列表（分頁）
  const loadShifts = async (params?: { page?: number; per_page?: number; search?: string }) => {
    setIsLoading(true);

    const data = await getShifts(params);
    setShifts(data);
    setIsLoading(false);
    return data;
  };

  // 載入單一班次
  const loadShift = async (slug: string) => {
    setIsLoading(true);

    const data = await getShift(slug);
    setIsLoading(false);
    return data;
  };

  // 建立班次
  const handleCreateShift = async (shiftData: CreateShiftData) => {
    const newShift = await createShiftService(shiftData);
    if (newShift) {
      addShift(newShift);
    }

    return newShift;
  };

  // 更新班次
  const handleUpdateShift = async (slug: string, shiftData: UpdateShiftData) => {
    const updatedShift = await updateShiftService(slug, shiftData);
    if (updatedShift) {
      setShift(slug, updatedShift);
    }

    return updatedShift;
  };

  // 刪除班次
  const handleDeleteShift = async (slug: string) => {
    const success = await deleteShiftService(slug);
    if (success) {
      removeShift(slug);
    }

    return success;
  };

  // 建立工作時程
  const handleCreateWorkSchedule = async (workScheduleData: CreateWorkScheduleData) => {
    const newWorkSchedule = await createWorkScheduleService(workScheduleData);
    if (newWorkSchedule) {
      // 更新對應的 shift 中的 work_schedules
      const shift = shifts.find(s => s.id === workScheduleData.shift_id);
      if (shift) {
        const updatedWorkSchedules = [...(shift.work_schedules || []), newWorkSchedule];
        const updatedShift = {
          ...shift,
          work_schedules: updatedWorkSchedules,
          cycle_days: updatedWorkSchedules.length, // 更新週期天數
        };
        setShift(shift.slug, updatedShift);
      }
    }

    return newWorkSchedule;
  };

  // 更新工作時程
  const handleUpdateWorkSchedule = async (
    slug: string,
    workScheduleData: UpdateWorkScheduleData
  ) => {
    const updatedWorkSchedule = await updateWorkScheduleService(slug, workScheduleData);
    if (updatedWorkSchedule) {
      // 更新對應的 shift 中的 work_schedules
      const shift = shifts.find(s => s.work_schedules?.some(ws => ws.slug === slug));
      if (shift) {
        const updatedWorkSchedules =
          shift.work_schedules?.map(ws => (ws.slug === slug ? updatedWorkSchedule : ws)) || [];
        const updatedShift = {
          ...shift,
          work_schedules: updatedWorkSchedules,
          cycle_days: updatedWorkSchedules.length, // 更新週期天數
        };
        setShift(shift.slug, updatedShift);
      }
    }

    return updatedWorkSchedule;
  };

  // 刪除工作時程
  const handleDeleteWorkSchedule = async (slug: string) => {
    const success = await deleteWorkScheduleService(slug);
    if (success) {
      // 從對應的 shift 中移除 work_schedule
      const shift = shifts.find(s => s.work_schedules?.some(ws => ws.slug === slug));
      if (shift) {
        const updatedWorkSchedules = shift.work_schedules?.filter(ws => ws.slug !== slug) || [];
        const updatedShift = {
          ...shift,
          work_schedules: updatedWorkSchedules,
          cycle_days: updatedWorkSchedules.length, // 更新週期天數
        };
        setShift(shift.slug, updatedShift);
      }
    }

    return success;
  };

  return {
    // 狀態
    shifts,
    isLoading,

    // 班次操作方法
    loadAllShifts,
    loadShifts,
    loadShift,
    handleCreateShift,
    handleUpdateShift,
    handleDeleteShift,

    // 工作時程操作方法
    handleCreateWorkSchedule,
    handleUpdateWorkSchedule,
    handleDeleteWorkSchedule,
  };
};
