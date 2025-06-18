
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useSupabaseCheckIn } from '@/hooks/useSupabaseCheckIn';

const mockShifts = [
  {
    id: '1',
    userId: '1',
    workDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '18:00',
  }
];

interface Shift {
  id: string;
  userId: string;
  workDate: string;
  startTime: string;
  endTime: string;
}

const ShiftReminder: React.FC = () => {
  const { toast } = useToast();
  const { currentUser } = useUser();
  const { getTodayCheckInRecords } = useSupabaseCheckIn();
  const [todayShift, setTodayShift] = useState<Shift | null>(null);
  const [hasShown, setHasShown] = useState(false);
  const [todayRecords, setTodayRecords] = useState<{ checkIn?: any, checkOut?: any }>({});

  useEffect(() => {
    const checkTodayRecords = async () => {
      if (currentUser?.id) {
        const records = await getTodayCheckInRecords(currentUser.id);
        setTodayRecords(records);
        console.log('ShiftReminder - 今日打卡記錄:', records);
      }
    };

    checkTodayRecords();
  }, [currentUser?.id, getTodayCheckInRecords]);

  useEffect(() => {
    const checkAndDisplayShift = () => {
      if (!currentUser || hasShown) return;

      const today = new Date().toISOString().split('T')[0];
      
      const userShift = mockShifts.find(
        shift => shift.userId === currentUser.id && shift.workDate === today
      );

      if (userShift) {
        setTodayShift(userShift);
        
        const hasCheckIn = todayRecords.checkIn;
        const hasCheckOut = todayRecords.checkOut;
        const isWorkComplete = hasCheckIn && hasCheckOut;

        console.log('ShiftReminder - 打卡狀態檢查:', {
          hasCheckIn: !!hasCheckIn,
          hasCheckOut: !!hasCheckOut,
          isWorkComplete
        });

        if (!isWorkComplete) {
          let message = '';
          if (!hasCheckIn) {
            message = `${currentUser.name}，你今天的上班時間為：${userShift.startTime} ~ ${userShift.endTime}，記得打卡喔！系統會在您忘記打卡時提醒您。`;
          } else if (!hasCheckOut) {
            message = `${currentUser.name}，你已完成上班打卡，記得下班時也要打卡喔！系統會在下班時間後提醒您。`;
          }

          if (message) {
            toast({
              title: "今日排班提醒",
              description: message,
              duration: 10000,
            });
          }
        } else {
          console.log('ShiftReminder - 今日打卡已完成，不顯示提醒');
        }
        
        setHasShown(true);
      }
    };

    const timer = setTimeout(checkAndDisplayShift, 2000);
    
    return () => clearTimeout(timer);
  }, [currentUser, toast, hasShown, todayRecords]);

  if (!todayShift || !currentUser) {
    return null;
  }

  const isWorkComplete = todayRecords.checkIn && todayRecords.checkOut;

  if (isWorkComplete) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <Bell className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-800">今日排班提醒</p>
          <p className="text-amber-700 text-sm mt-1">
            {!todayRecords.checkIn 
              ? `${currentUser.name}，你今天的上班時間為：${todayShift.startTime} ~ ${todayShift.endTime}，記得打卡喔！`
              : `${currentUser.name}，你已完成上班打卡，記得下班時也要打卡喔！`
            }
          </p>
          <p className="text-xs text-amber-600 mt-2">
            💡 系統會在您忘記打卡時自動提醒您（5分鐘提醒一次，共2次）
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShiftReminder;
