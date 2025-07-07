import { useIsAdmin } from '@/hooks/useStores';
import { Calendar, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WelcomeSectionProps {
  userName: string;
}

const WelcomeSection = ({ userName }: WelcomeSectionProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const isAdmin = useIsAdmin();

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
    hour12: false,
  });

  const dateString = currentTime.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  // 確保顯示實際的用戶名稱，改善判斷邏輯
  const displayName =
    userName &&
    userName !== 'User' &&
    userName !== '訪客' &&
    !userName.includes('-') &&
    !userName.startsWith('User ') &&
    !userName.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
      ? userName
      : '訪客';

  // 獲取用戶角色顯示
  const getUserRoleDisplay = () => {
    if (isAdmin) {
      return '管理員';
    }
    return '員工';
  };

  return (
    <div className="px-[10px] py-[5px]">
      <div className="space-y-3">
        {/* 問候語 */}
        <div className="text-center px-[10px]">
          <h1 className="text-xl sm:text-3xl font-bold mb-2 text-white drop-shadow-lg py-[5px] my-[10px]">
            您好，{displayName}
          </h1>
          <div className="inline-block px-2 py-1 bg-white/20 rounded-full backdrop-blur-xl border border-white/30">
            <span className="text-white text-xs font-medium">{getUserRoleDisplay()}</span>
          </div>
        </div>

        {/* 時間資訊 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:gap-6 gap-2 mt-4">
          <div className="flex items-center justify-center sm:justify-start space-x-3 p-2">
            <div className="p-2 bg-blue-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50 text-white">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-xl sm:text-2xl font-mono font-bold text-white drop-shadow-lg">
              {timeString}
            </span>
          </div>

          <div className="flex items-center justify-center sm:justify-end space-x-3 p-2">
            <div className="p-2 bg-green-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50 text-white">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="text-sm sm:text-base font-semibold text-white drop-shadow-lg">
              {dateString}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
