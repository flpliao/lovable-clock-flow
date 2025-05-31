
import { Overtime } from '@/types/attendance';

export const getOvertimeTypeText = (type: string): string => {
  const types: Record<string, string> = {
    'weekday': '平日加班',
    'weekend': '假日加班',
    'holiday': '國定假日加班'
  };
  return types[type] || '未知';
};

export const getCompensationTypeText = (type: string): string => {
  const types: Record<string, string> = {
    'pay': '加班費',
    'time_off': '補休',
    'both': '加班費+補休'
  };
  return types[type] || '未知';
};

export const calculateOvertimeHours = (startTime: string, endTime: string): number => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diff = end.getTime() - start.getTime();
  return Math.round((diff / (1000 * 60 * 60)) * 100) / 100;
};
