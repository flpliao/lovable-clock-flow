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
    <div className="px-[10px] py-[8px]">
      <div className="space-y-2">
        {/* 第一行：問候語 + 角色標籤 */}
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">
            您好，{displayName}
          </h1>
        </div>

        {/* 第二行：時間 + 日期 */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-green-500/80 rounded-lg shadow-lg backdrop-blur-xl border border-green-400/50 text-white">
              <Calendar className="h-3 w-3" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-white drop-shadow-lg">
              {dateString}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-500/80 rounded-lg shadow-lg backdrop-blur-xl border border-blue-400/50 text-white">
              <Clock className="h-3 w-3" />
            </div>
            <span className="text-base sm:text-lg font-mono font-bold text-white drop-shadow-lg">
              {timeString}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
