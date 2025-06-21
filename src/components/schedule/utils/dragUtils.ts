
import { format } from 'date-fns';

export interface DragScheduleItem {
  id: string;
  userId: string;
  workDate: string;
  timeSlot: string;
  startTime: string;
  endTime: string;
}

export interface DragValidationResult {
  isValid: boolean;
  message?: string;
}

export const validateDragOperation = (
  draggedSchedule: DragScheduleItem,
  targetDate: string | Date,
  allSchedules: DragScheduleItem[]
): DragValidationResult => {
  // 移除所有限制，允許自由拖動
  return {
    isValid: true
  };
};

export const getScheduleConflicts = (schedules: DragScheduleItem[]): string[] => {
  // 移除衝突檢查，返回空數組
  return [];
};
