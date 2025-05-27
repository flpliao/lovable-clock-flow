
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useSupabaseCheckIn } from '@/hooks/useSupabaseCheckIn';

// Mock shift data for simulation purposes
// In a real app, this would come from an API or database
const mockShifts = [
  {
    id: '1',
    userId: '1',
    workDate: new Date().toISOString().split('T')[0], // Today
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

  // 檢查今日打卡記錄
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
    // 只有在沒有顯示過提醒且使用者已登入的情況下才檢查
    const checkAndDisplayShift = () => {
      if (!currentUser || hasShown) return;

      const today = new Date().toISOString().split('T')[0];
      
      // 檢查是否有今日排班
      const userShift = mockShifts.find(
        shift => shift.userId === currentUser.id && shift.workDate === today
      );

      if (userShift) {
        setTodayShift(userShift);
        
        // 檢查是否已經完成今日打卡
        const hasCheckIn = todayRecords.checkIn;
        const hasCheckOut = todayRecords.checkOut;
        const isWorkComplete = hasCheckIn && hasCheckOut;

        console.log('ShiftReminder - 打卡狀態檢查:', {
          hasCheckIn: !!hasCheckIn,
          hasCheckOut: !!hasCheckOut,
          isWorkComplete
        });

        // 只有在尚未完成今日打卡時才顯示提醒
        if (!isWorkComplete) {
          let message = '';
          if (!hasCheckIn) {
            message = `${currentUser.name}，你今天的上班時間為：${userShift.startTime} ~ ${userShift.endTime}，記得打卡喔！`;
          } else if (!hasCheckOut) {
            message = `${currentUser.name}，你已完成上班打卡，記得下班時也要打卡喔！`;
          }

          if (message) {
            toast({
              title: "今日排班提醒",
              description: message,
              duration: 8000, // 8秒後自動消失
            });
          }
        } else {
          console.log('ShiftReminder - 今日打卡已完成，不顯示提醒');
        }
        
        setHasShown(true);
      }
    };

    // 延遲檢查，確保打卡記錄已載入
    const timer = setTimeout(checkAndDisplayShift, 2000);
    
    return () => clearTimeout(timer);
  }, [currentUser, toast, hasShown, todayRecords]);

  // 如果使用者沒有排班或已經顯示過通知，則不渲染任何內容
  if (!todayShift || !currentUser) {
    return null;
  }

  // 檢查是否已完成今日打卡
  const isWorkComplete = todayRecords.checkIn && todayRecords.checkOut;

  // 如果已完成打卡，不顯示提醒卡片
  if (isWorkComplete) {
    return null;
  }

  // 可選的視覺提醒卡片（只在未完成打卡時顯示）
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4 flex items-start">
      <Bell className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
      <div>
        <p className="font-medium text-amber-800">今日排班提醒</p>
        <p className="text-amber-700">
          {!todayRecords.checkIn 
            ? `${currentUser.name}，你今天的上班時間為：${todayShift.startTime} ~ ${todayShift.endTime}，記得打卡喔！`
            : `${currentUser.name}，你已完成上班打卡，記得下班時也要打卡喔！`
          }
        </p>
      </div>
    </div>
  );
};

export default ShiftReminder;
