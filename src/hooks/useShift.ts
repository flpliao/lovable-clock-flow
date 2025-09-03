import {
  createShift,
  deleteShift,
  getAllShifts,
  getShift,
  getShifts,
  updateShift,
} from '@/services/shiftService';
import {
  createWorkSchedule,
  deleteWorkSchedule,
  updateWorkSchedule,
} from '@/services/workScheduleService';
import { useShiftStore } from '@/stores/shiftStore';
import { CreateShiftData, UpdateShiftData } from '@/types/shift';
import { CreateWorkScheduleData, UpdateWorkScheduleData, WorkSchedule } from '@/types/workSchedule';
import { showError } from '@/utils/toast';
import { useState } from 'react';

export const useShift = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { shifts, setShifts, addShift, setShift, removeShift, getShiftBySlug } = useShiftStore();

  // 載入所有班次
  const loadAllShifts = async () => {
    if (isLoading || shifts.length > 0) return;

    setIsLoading(true);
    try {
      const data = await getAllShifts();
      setShifts(data);
      setIsLoading(false);
    } catch (error) {
      showError(error.message);

      setShifts([]);
      setIsLoading(false);
    }
  };

  // 載入班次列表（分頁）
  const loadShifts = async (params?: { page?: number; per_page?: number; search?: string }) => {
    setIsLoading(true);

    try {
      const data = await getShifts(params);
      setShifts(data);
      setIsLoading(false);
    } catch (error) {
      showError(error.message);
    }
  };

  // 載入單一班次
  const loadShift = async (slug: string) => {
    setIsLoading(true);

    try {
      await getShift(slug);
      setIsLoading(false);
    } catch (error) {
      showError(error.message);
    }
  };

  // 建立班次
  const handleCreateShift = async (shiftData: CreateShiftData) => {
    try {
      const newShift = await createShift(shiftData);
      addShift(newShift);
    } catch (error) {
      showError(error.message);
    }
  };

  // 更新班次
  const handleUpdateShift = async (slug: string, shiftData: UpdateShiftData) => {
    try {
      const updatedShift = await updateShift(slug, shiftData);
      setShift(slug, updatedShift);
    } catch (error) {
      showError(error.message);
    }
  };

  // 刪除班次
  const handleDeleteShift = async (slug: string) => {
    try {
      await deleteShift(slug);
      removeShift(slug);
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  // 建立工作時程
  const handleCreateWorkSchedule = async (
    workScheduleData: CreateWorkScheduleData
  ): Promise<boolean> => {
    try {
      const newWorkSchedule = await createWorkSchedule(workScheduleData);
      const shift = shifts.find(s => s.slug === workScheduleData.shift_slug);
      if (shift) {
        const updatedWorkSchedules = [...(shift.work_schedules || []), newWorkSchedule];
        const updatedShift = {
          ...shift,
          work_schedules: updatedWorkSchedules,
          cycle_days: updatedWorkSchedules.length, // 更新週期天數
        };
        setShift(shift.slug, updatedShift);
      }
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  // 更新工作時程
  const handleUpdateWorkSchedule = async (
    slug: string,
    workScheduleData: UpdateWorkScheduleData
  ): Promise<boolean> => {
    try {
      const updatedWorkSchedule = await updateWorkSchedule(slug, workScheduleData);
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
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  // 刪除工作時程
  const handleDeleteWorkSchedule = async (slug: string): Promise<boolean> => {
    try {
      await deleteWorkSchedule(slug);
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
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  // 複製工作時程
  const handleDuplicateWorkSchedule = async (workSchedule: WorkSchedule) => {
    try {
      // 找到包含此 workSchedule 的 shift
      const shift = shifts.find(s => s.work_schedules?.some(ws => ws.slug === workSchedule.slug));
      if (!shift) {
        throw new Error('找不到對應的班次');
      }

      // 建立複製的資料，移除 id 和 slug，讓後端生成新的
      const duplicateData: CreateWorkScheduleData = {
        shift_slug: shift.slug,
        clock_in_time: workSchedule.clock_in_time,
        clock_out_time: workSchedule.clock_out_time,
        status: workSchedule.status,
        ot_start_after_hours: workSchedule.ot_start_after_hours,
        ot_start_after_minutes: workSchedule.ot_start_after_minutes,
      };

      const newWorkSchedule = await createWorkSchedule(duplicateData);
      if (newWorkSchedule) {
        // 更新對應的 shift 中的 work_schedules
        const updatedWorkSchedules = [...(shift.work_schedules || []), newWorkSchedule];
        const updatedShift = {
          ...shift,
          work_schedules: updatedWorkSchedules,
          cycle_days: updatedWorkSchedules.length, // 更新週期天數
        };
        setShift(shift.slug, updatedShift);
      }
    } catch (error) {
      showError(error.message);
    }
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
    getShiftBySlug,

    // 工作時程操作方法
    handleCreateWorkSchedule,
    handleUpdateWorkSchedule,
    handleDeleteWorkSchedule,
    handleDuplicateWorkSchedule,
  };
};
