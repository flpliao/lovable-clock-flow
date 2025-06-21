
import { format, isBefore, startOfDay } from 'date-fns';

export interface DragScheduleItem {
  id: string;
  userId: string;
  workDate: string;
  timeSlot: string;
  startTime: string;
  endTime: string;
}

export const validateDragOperation = (
  draggedItem: DragScheduleItem,
  targetDate: Date,
  existingSchedules: DragScheduleItem[]
): { isValid: boolean; message?: string } => {
  const targetDateString = format(targetDate, 'yyyy-MM-dd');
  const today = startOfDay(new Date());
  
  // 檢查是否拖到過去的日期
  if (isBefore(targetDate, today)) {
    return {
      isValid: false,
      message: '無法排入過去的日期'
    };
  }
  
  // 檢查目標日期是否已有該員工的排班
  const existingScheduleOnTarget = existingSchedules.find(
    schedule => 
      schedule.userId === draggedItem.userId && 
      schedule.workDate === targetDateString &&
      schedule.id !== draggedItem.id
  );
  
  if (existingScheduleOnTarget) {
    return {
      isValid: false,
      message: '此員工在這一天已有排班，請確認後再嘗試。'
    };
  }
  
  return { isValid: true };
};

export const getScheduleConflicts = (schedules: DragScheduleItem[]): string[] => {
  const conflicts: string[] = [];
  const userDateMap = new Map<string, Set<string>>();
  
  schedules.forEach(schedule => {
    const key = `${schedule.userId}-${schedule.workDate}`;
    if (!userDateMap.has(key)) {
      userDateMap.set(key, new Set());
    }
    userDateMap.get(key)?.add(schedule.id);
  });
  
  userDateMap.forEach((scheduleIds, key) => {
    if (scheduleIds.size > 1) {
      const [userId] = key.split('-');
      conflicts.push(userId);
    }
  });
  
  return [...new Set(conflicts)];
};
