
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useSupabaseCheckIn } from './useSupabaseCheckIn';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ReminderState {
  isActive: boolean;
  reminderCount: number;
  lastReminderTime: Date | null;
  maxReminders: number;
  intervalMinutes: number;
}

export const useCheckInReminder = () => {
  const { currentUser } = useUser();
  const { getTodayCheckInRecords } = useSupabaseCheckIn();
  const { toast } = useToast();
  const [reminderState, setReminderState] = useState<ReminderState>({
    isActive: false,
    reminderCount: 0,
    lastReminderTime: null,
    maxReminders: 2,
    intervalMinutes: 5
  });

  // 檢查並發送提醒
  const checkAndSendReminder = async (actionType: 'check-in' | 'check-out') => {
    if (!currentUser?.id || reminderState.reminderCount >= reminderState.maxReminders) {
      return;
    }

    const now = new Date();
    const shouldSendReminder = !reminderState.lastReminderTime || 
      (now.getTime() - reminderState.lastReminderTime.getTime()) >= (reminderState.intervalMinutes * 60 * 1000);

    if (shouldSendReminder) {
      const action = actionType === 'check-in' ? '上班' : '下班';
      
      toast({
        title: "打卡提醒",
        description: `您還沒有${action}打卡喔！請記得完成打卡。`,
        duration: 8000,
      });

      setReminderState(prev => ({
        ...prev,
        reminderCount: prev.reminderCount + 1,
        lastReminderTime: now
      }));

      console.log(`發送${action}打卡提醒 (第${reminderState.reminderCount + 1}次)`);
    }
  };

  // 重置提醒狀態
  const resetReminders = () => {
    setReminderState(prev => ({
      ...prev,
      reminderCount: 0,
      lastReminderTime: null
    }));
  };

  // 每天重置提醒計數器
  useEffect(() => {
    const resetDaily = () => {
      const now = new Date();
      const isNewDay = !reminderState.lastReminderTime || 
        now.toDateString() !== reminderState.lastReminderTime.toDateString();
      
      if (isNewDay) {
        resetReminders();
      }
    };

    const interval = setInterval(resetDaily, 60 * 60 * 1000); // 每小時檢查
    resetDaily(); // 立即檢查

    return () => clearInterval(interval);
  }, [reminderState.lastReminderTime]);

  return {
    reminderState,
    checkAndSendReminder,
    resetReminders
  };
};
