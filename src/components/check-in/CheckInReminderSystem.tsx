import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useCurrentUser } from '@/hooks/useStores';
import { useSupabaseCheckIn } from '@/hooks/useSupabaseCheckIn';
import { supabase } from '@/integrations/supabase/client';
import { Bell, Clock } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface Schedule {
  id: string;
  staff_id: string;
  work_date: string;
  start_time: string;
  end_time: string;
}

interface ReminderSettings {
  id: string;
  staff_id: string;
  reminder_type: string;
  reminder_time: string;
  reminder_days: number[];
  is_active: boolean;
  notification_method: string[];
  message_template: string;
  trigger_condition: {
    max_reminders: number;
    reminder_interval_minutes: number;
  };
}

const CheckInReminderSystem: React.FC = () => {
  const currentUser = useCurrentUser();
  const { getTodayCheckInRecords } = useSupabaseCheckIn();
  const { toast } = useToast();
  const [todaySchedule, setTodaySchedule] = useState<Schedule | null>(null);
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings | null>(null);
  const [reminderCount, setReminderCount] = useState(0);
  const [lastReminderTime, setLastReminderTime] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const resetIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 檢查今日排班
  useEffect(() => {
    const checkTodaySchedule = async () => {
      if (!currentUser?.id) return;

      try {
        const today = new Date().toISOString().split('T')[0];
        
        // 模擬排班資料 - 實際應用中應從資料庫獲取
        const mockSchedules: Schedule[] = [
          {
            id: '1',
            staff_id: currentUser.id,
            work_date: today,
            start_time: '09:00',
            end_time: '18:00'
          }
        ];

        const schedule = mockSchedules.find(s => s.staff_id === currentUser.id && s.work_date === today);
        setTodaySchedule(schedule || null);

        console.log('CheckInReminderSystem - 今日排班:', schedule);
      } catch (error) {
        console.error('檢查排班時發生錯誤:', error);
      }
    };

    checkTodaySchedule();
  }, [currentUser?.id]);

  // 檢查提醒設定
  useEffect(() => {
    const loadReminderSettings = async () => {
      if (!currentUser?.id) return;

      try {
        const { data, error } = await supabase
          .from('reminder_settings')
          .select('*')
          .eq('staff_id', currentUser.id)
          .eq('reminder_type', 'check_in_missed')
          .eq('is_active', true)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('載入提醒設定失敗:', error);
          return;
        }

        if (data) {
          setReminderSettings(data as unknown as ReminderSettings);
        } else {
          // 如果沒有設定，創建預設設定
          const defaultSettings: Omit<ReminderSettings, 'id'> = {
            staff_id: currentUser.id,
            reminder_type: 'check_in_missed',
            reminder_time: '00:05:00',
            reminder_days: [1, 2, 3, 4, 5],
            is_active: true,
            notification_method: ['toast'],
            message_template: '您還沒有打卡喔！請記得完成{action}打卡。',
            trigger_condition: {
              max_reminders: 2,
              reminder_interval_minutes: 5
            }
          };

          const { data: newSettings, error: insertError } = await supabase
            .from('reminder_settings')
            .insert(defaultSettings)
            .select()
            .single();

          if (insertError) {
            console.error('創建預設提醒設定失敗:', insertError);
          } else if (newSettings) {
            setReminderSettings(newSettings as unknown as ReminderSettings);
          }
        }
      } catch (error) {
        console.error('處理提醒設定時發生錯誤:', error);
      }
    };

    loadReminderSettings();
  }, [currentUser?.id]);

  // 檢查是否需要提醒
  useEffect(() => {
    if (!todaySchedule || !reminderSettings || !currentUser?.id) {
      // 清理現有的間隔器
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const checkMissedCheckIn = async () => {
      try {
        const now = new Date();
        const todayRecords = await getTodayCheckInRecords(currentUser.id);
        
        // 解析排班時間
        const [startHour, startMinute] = todaySchedule.start_time.split(':').map(Number);
        const [endHour, endMinute] = todaySchedule.end_time.split(':').map(Number);
        
        const scheduleStart = new Date();
        scheduleStart.setHours(startHour, startMinute, 0, 0);
        
        const scheduleEnd = new Date();
        scheduleEnd.setHours(endHour, endMinute, 0, 0);

        // 檢查上班打卡提醒
        const shouldRemindCheckIn = !todayRecords.checkIn && 
          now > new Date(scheduleStart.getTime() + 5 * 60 * 1000);

        // 檢查下班打卡提醒
        const shouldRemindCheckOut = todayRecords.checkIn && 
          !todayRecords.checkOut && 
          now > new Date(scheduleEnd.getTime() + 5 * 60 * 1000);

        if (shouldRemindCheckIn || shouldRemindCheckOut) {
          const action = shouldRemindCheckIn ? '上班' : '下班';
          
          // 檢查提醒次數和間隔
          const maxReminders = reminderSettings.trigger_condition?.max_reminders || 2;
          const intervalMinutes = reminderSettings.trigger_condition?.reminder_interval_minutes || 5;
          
          if (reminderCount < maxReminders) {
            const shouldSendReminder = !lastReminderTime || 
              (now.getTime() - lastReminderTime.getTime()) >= (intervalMinutes * 60 * 1000);

            if (shouldSendReminder) {
              const message = reminderSettings.message_template.replace('{action}', action);
              
              toast({
                title: "打卡提醒",
                description: message,
                duration: 8000,
              });

              setReminderCount(prev => prev + 1);
              setLastReminderTime(now);
              
              console.log(`CheckInReminderSystem - 發送${action}打卡提醒 (第${reminderCount + 1}次)`);
            }
          }
        }
      } catch (error) {
        console.error('檢查打卡提醒時發生錯誤:', error);
      }
    };

    // 每分鐘檢查一次 - 但防止重複設定
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(checkMissedCheckIn, 60 * 1000);
    
    // 立即檢查一次
    checkMissedCheckIn();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [todaySchedule, reminderSettings, currentUser?.id, toast, reminderCount, lastReminderTime]);

  // 重置提醒計數器（每天重置）
  useEffect(() => {
    const resetReminders = () => {
      const now = new Date();
      const isNewDay = !lastReminderTime || 
        now.toDateString() !== lastReminderTime.toDateString();
      
      if (isNewDay) {
        setReminderCount(0);
        setLastReminderTime(null);
      }
    };

    // 每小時檢查一次是否需要重置 - 但防止重複設定
    if (resetIntervalRef.current) {
      clearInterval(resetIntervalRef.current);
    }
    resetIntervalRef.current = setInterval(resetReminders, 60 * 60 * 1000);
    resetReminders(); // 立即檢查一次

    return () => {
      if (resetIntervalRef.current) {
        clearInterval(resetIntervalRef.current);
        resetIntervalRef.current = null;
      }
    };
  }, [lastReminderTime]);

  // 清理所有間隔器
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (resetIntervalRef.current) {
        clearInterval(resetIntervalRef.current);
      }
    };
  }, []);

  // 如果沒有排班，不顯示任何內容
  if (!todaySchedule) {
    return null;
  }

  // 如果排班沒有設定時間（在家工作或自由接案），不顯示提醒
  if (!todaySchedule.start_time || !todaySchedule.end_time) {
    return null;
  }

  return (
    <div className="mt-4">
      {reminderSettings && (
        <Alert className="bg-blue-50 border-blue-200">
          <Bell className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <span>自動補卡提醒已啟用</span>
              <div className="flex items-center text-sm text-blue-600">
                <Clock className="h-3 w-3 mr-1" />
                <span>今日排班: {todaySchedule.start_time} - {todaySchedule.end_time}</span>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CheckInReminderSystem;
