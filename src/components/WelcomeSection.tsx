
import React from 'react';
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
    <div className="py-6 sm:py-8">
      <div className="space-y-6">
        {/* 問候語 */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-white drop-shadow-lg">
            您好，{userName}
          </h1>
          <p className="text-white/90 text-base sm:text-lg font-medium drop-shadow-md">
            歡迎使用員工考勤系統
          </p>
        </div>
        
        {/* 時間資訊 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:gap-8 gap-4 mt-8">
          <div className="flex items-center justify-center sm:justify-start space-x-4 p-4">
            <div className="p-3 bg-blue-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50 text-white">
              <Clock className="h-6 w-6" />
            </div>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-white drop-shadow-lg">
              {timeString}
            </span>
          </div>
          
          <div className="flex items-center justify-center sm:justify-end space-x-4 p-4">
            <div className="p-3 bg-green-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50 text-white">
              <Calendar className="h-6 w-6" />
            </div>
            <span className="text-base sm:text-lg font-semibold text-white drop-shadow-lg">
              {dateString}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
