
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
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    // 驗證日期是否有效
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error('❌ 無效的時間格式:', { startTime, endTime });
      return 0;
    }
    
    const diff = end.getTime() - start.getTime();
    
    if (diff <= 0) {
      console.error('❌ 結束時間必須晚於開始時間:', { startTime, endTime });
      return 0;
    }
    
    const hours = diff / (1000 * 60 * 60);
    
    // 限制到小數點後一位，並確保合理範圍
    const calculatedHours = Math.round(hours * 10) / 10;
    
    console.log('⏰ 計算加班時數:', {
      startTime,
      endTime,
      diffMs: diff,
      hours: calculatedHours
    });
    
    return Math.max(0, Math.min(24, calculatedHours)); // 限制在0-24小時之間
  } catch (error) {
    console.error('❌ 計算加班時數時發生錯誤:', error);
    return 0;
  }
};
