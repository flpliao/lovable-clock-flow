
import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';

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
  const [todayShift, setTodayShift] = useState<Shift | null>(null);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Simulating the server-side scheduled job that would run at 8:00 AM
    // In a real app, this would be a server notification or push message
    const checkAndDisplayShift = () => {
      if (!currentUser || hasShown) return;

      const today = new Date().toISOString().split('T')[0];
      
      // Find user's shift for today
      const userShift = mockShifts.find(
        shift => shift.userId === currentUser.id && shift.workDate === today
      );

      if (userShift) {
        setTodayShift(userShift);
        
        // Show the toast notification (simulating the automatic reminder)
        toast({
          title: "今日排班提醒",
          description: `${currentUser.name}，你今天的上班時間為：${userShift.startTime} ~ ${userShift.endTime}，記得打卡喔！`,
          duration: 10000, // longer duration so user can see it
        });
        
        setHasShown(true);
      }
    };

    // Simulate the scheduled notification after a slight delay
    // (this mimics what would happen at 8am in a real system)
    const timer = setTimeout(checkAndDisplayShift, 1500);
    
    return () => clearTimeout(timer);
  }, [currentUser, toast, hasShown]);

  // If user has no shift today or we've already displayed the notification
  if (!todayShift || !currentUser) {
    return null;
  }

  // Optional: Render a visual element showing the shift info
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4 flex items-start">
      <Bell className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
      <div>
        <p className="font-medium text-amber-800">今日排班提醒</p>
        <p className="text-amber-700">
          {currentUser.name}，你今天的上班時間為：{todayShift.startTime} ~ {todayShift.endTime}，記得打卡喔！
        </p>
      </div>
    </div>
  );
};

export default ShiftReminder;
