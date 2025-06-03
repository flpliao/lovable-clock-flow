
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
    <div className="py-6 sm:py-8">
      <Card className="backdrop-blur-3xl bg-gradient-to-br from-white/25 to-white/10 border border-white/40 shadow-2xl overflow-hidden relative">
        {/* Vision Pro 風格的光效 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 to-purple-500/15"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-80"></div>
        
        <CardContent className="p-6 sm:p-8 relative z-10">
          <div className="space-y-4">
            {/* 問候語 - Vision Pro 風格 */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-white drop-shadow-lg">
                您好，{userName}
              </h1>
              <p className="text-white/90 text-sm sm:text-lg font-medium drop-shadow-md">
                歡迎使用員工考勤系統
              </p>
            </div>
            
            {/* 時間資訊 - Vision Pro 風格 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mt-6">
              <div className="flex items-center justify-center sm:justify-start space-x-3 backdrop-blur-xl bg-white/20 rounded-2xl p-4 border border-white/30 shadow-lg">
                <div className="p-2 bg-white/30 rounded-xl shadow-md">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl sm:text-2xl font-mono font-semibold text-white drop-shadow-md">
                  {timeString}
                </span>
              </div>
              
              <div className="flex items-center justify-center sm:justify-end space-x-3 backdrop-blur-xl bg-white/20 rounded-2xl p-4 border border-white/30 shadow-lg">
                <div className="p-2 bg-white/30 rounded-xl shadow-md">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <span className="text-sm sm:text-base text-white font-medium drop-shadow-md">
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
