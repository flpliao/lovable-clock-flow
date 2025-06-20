
import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface WelcomeSectionProps {
  userName: string;
}

const WelcomeSection = ({
  userName
}: WelcomeSectionProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // 每秒更新時間
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  // 確保顯示實際的用戶名稱，改善判斷邏輯
  const displayName = userName && userName !== 'User' && userName !== '訪客' && !userName.includes('-') && !userName.startsWith('User ') && !userName.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ? userName : '訪客';
  
  return <div className="py-6 sm:py-[20px] px-[10px]">
      <div className="space-y-6">
        {/* 問候語 */}
        <div className="text-center px-[10px]">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-white drop-shadow-lg lg:text-4xl py-[30px]">
            您好，{displayName}
          </h1>
          
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
    </div>;
};

export default WelcomeSection;
