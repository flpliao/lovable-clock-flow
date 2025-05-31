
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

interface WelcomeSectionProps {
  userName: string;
}

const WelcomeSection = ({ userName }: WelcomeSectionProps) => {
  const currentTime = new Date();
  const timeString = currentTime.toLocaleTimeString('zh-TW', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
  const dateString = currentTime.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <div className="py-4 sm:py-6">
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
        <CardContent className="p-4 sm:p-6">
          {/* 手機優化的歡迎區塊 */}
          <div className="space-y-3">
            {/* 問候語 */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold mb-1">
                您好，{userName}
              </h1>
              <p className="text-blue-100 text-sm sm:text-base">
                歡迎使用員工考勤系統
              </p>
            </div>
            
            {/* 時間資訊 - 手機優化佈局 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-200" />
                <span className="text-lg sm:text-xl font-mono font-semibold">
                  {timeString}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-200" />
                <span className="text-sm sm:text-base text-blue-100">
                  {dateString}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeSection;
