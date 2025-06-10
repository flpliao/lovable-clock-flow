
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
      <div className={`${createLiquidGlassEffect(true, true)} overflow-hidden relative group`}>
        {/* 極淡藍色漸變光效 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/15 to-slate-50/10 group-hover:from-blue-50/20 group-hover:to-slate-50/15 transition-all duration-500"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/5 via-transparent to-slate-50/5 group-hover:from-blue-50/10 group-hover:to-slate-50/10 transition-all duration-500"></div>
        
        <CardContent className="p-6 sm:p-8 relative z-10">
          <div className="space-y-6">
            {/* 問候語 */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 text-white drop-shadow-2xl">
                您好，{userName}
              </h1>
              <p className="text-white/90 text-base sm:text-lg font-medium drop-shadow-lg">
                歡迎使用員工考勤系統
              </p>
            </div>
            
            {/* 時間資訊 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mt-8">
              <div className={`flex items-center justify-center sm:justify-start space-x-4 ${createLiquidGlassEffect(false, true)} p-5 group-hover:scale-105 transition-all duration-300`}>
                <div className="p-3 bg-blue-100/40 rounded-2xl shadow-xl backdrop-blur-xl border border-blue-50/30">
                  <Clock className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
                <span className="text-2xl sm:text-3xl font-mono font-bold text-white drop-shadow-xl">
                  {timeString}
                </span>
              </div>
              
              <div className={`flex items-center justify-center sm:justify-end space-x-4 ${createLiquidGlassEffect(false, true)} p-5 group-hover:scale-105 transition-all duration-300`}>
                <div className="p-3 bg-blue-100/40 rounded-2xl shadow-xl backdrop-blur-xl border border-blue-50/30">
                  <Calendar className="h-6 w-6 text-white drop-shadow-lg" />
                </div>
                <span className="text-base sm:text-lg font-semibold text-white drop-shadow-lg">
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
