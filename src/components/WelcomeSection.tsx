
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import { visionProStyles, createLiquidGlassEffect } from '@/utils/visionProStyles';

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
      <div className={`${createLiquidGlassEffect(true, 'default')} overflow-hidden relative group`}>
        {/* 柔和的背景光效 */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/2 group-hover:from-white/8 group-hover:to-white/4 transition-all duration-500"></div>
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60"></div>
        
        <CardContent className="p-6 sm:p-8 relative z-10">
          <div className="space-y-6">
            {/* 問候語 */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-gray-800 drop-shadow-sm">
                您好，{userName}
              </h1>
              <p className="text-gray-700 text-base sm:text-lg font-medium drop-shadow-sm">
                歡迎使用員工考勤系統
              </p>
            </div>
            
            {/* 時間資訊 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mt-8">
              <div className={`flex items-center justify-center sm:justify-start space-x-4 ${visionProStyles.statsCard} group-hover:scale-105 transition-all duration-300`}>
                <div className={visionProStyles.coloredIconContainer.blue}>
                  <Clock className="h-6 w-6" />
                </div>
                <span className="text-2xl sm:text-3xl font-mono font-bold text-gray-800 drop-shadow-sm">
                  {timeString}
                </span>
              </div>
              
              <div className={`flex items-center justify-center sm:justify-end space-x-4 ${visionProStyles.statsCard} group-hover:scale-105 transition-all duration-300`}>
                <div className={visionProStyles.coloredIconContainer.green}>
                  <Calendar className="h-6 w-6" />
                </div>
                <span className="text-base sm:text-lg font-semibold text-gray-800 drop-shadow-sm">
                  {dateString}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
};

export default WelcomeSection;
