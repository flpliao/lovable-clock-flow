
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Wifi, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { useCheckIn } from '@/hooks/useCheckIn';
import { useUser } from '@/contexts/UserContext';
import CheckInCompletedStatus from '@/components/check-in/CheckInCompletedStatus';
import CheckInStatusInfo from '@/components/check-in/CheckInStatusInfo';
import CheckInButton from '@/components/check-in/CheckInButton';

const LocationCheckIn = () => {
  const { currentUser } = useUser();
  
  const {
    loading,
    error,
    distance,
    checkInMethod,
    setCheckInMethod,
    actionType,
    todayRecords,
    onLocationCheckIn,
    onIpCheckIn
  } = useCheckIn(currentUser?.id || '');

  // Early return if no user
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center w-full">
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 shadow-lg max-w-md w-full mx-auto">
          <div className="text-center text-white/80">
            請先登入以使用打卡功能
          </div>
        </div>
      </div>
    );
  }

  const safeCheckIn = todayRecords?.checkIn;
  const safeCheckOut = todayRecords?.checkOut;

  // 如果已完成今日打卡，顯示完成狀態
  if (safeCheckIn && safeCheckOut) {
    return (
      <div className="flex justify-center items-center w-full">
        <div className="max-w-md w-full mx-auto">
          <CheckInCompletedStatus checkIn={safeCheckIn} checkOut={safeCheckOut} />
        </div>
      </div>
    );
  }

  const handleCheckIn = checkInMethod === 'location' ? onLocationCheckIn : onIpCheckIn;

  return (
    <div className="flex justify-center items-center w-full">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 shadow-lg space-y-4 max-w-md w-full mx-auto">
        {/* 標題 */}
        <div className="flex items-center justify-center space-x-2 text-white mb-4">
          <div className="p-2 bg-blue-500/80 rounded-lg shadow-md backdrop-blur-xl border border-blue-400/50">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold drop-shadow-md">員工打卡</span>
        </div>

        <CheckInStatusInfo checkIn={safeCheckIn} checkOut={safeCheckOut} />

        {/* 打卡方式選擇 */}
        <div className="grid grid-cols-2 gap-2 bg-white/20 backdrop-blur-xl rounded-xl p-1 border border-white/20">
          <Button
            variant={checkInMethod === 'location' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCheckInMethod('location')}
            className={`flex items-center justify-center space-x-1 text-sm transition-all duration-200 ${
              checkInMethod === 'location' 
                ? 'bg-white/40 text-gray-800 hover:bg-white/50' 
                : 'bg-transparent text-white/80 hover:bg-white/20'
            }`}
          >
            <MapPin className="h-4 w-4" />
            <span>位置打卡</span>
          </Button>
          <Button
            variant={checkInMethod === 'ip' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCheckInMethod('ip')}
            className={`flex items-center justify-center space-x-1 text-sm transition-all duration-200 ${
              checkInMethod === 'ip' 
                ? 'bg-white/40 text-gray-800 hover:bg-white/50' 
                : 'bg-transparent text-white/80 hover:bg-white/20'
            }`}
          >
            <Wifi className="h-4 w-4" />
            <span>IP打卡</span>
          </Button>
        </div>

        <CheckInButton
          actionType={actionType}
          loading={loading}
          onCheckIn={handleCheckIn}
        />

        {/* 狀態資訊 */}
        {distance !== null && !error && checkInMethod === 'location' && (
          <div className="text-center text-sm text-white/80 drop-shadow-md">
            <MapPin className="inline h-4 w-4 mr-1" />
            距離公司: <span className="font-medium">{Math.round(distance)} 公尺</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center space-x-2 text-red-200 text-sm bg-red-500/20 backdrop-blur-xl rounded-lg p-3 border border-red-400/30">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {!loading && checkInMethod === 'ip' && (
          <div className="text-center text-sm text-white/80 drop-shadow-md">
            <Wifi className="inline h-4 w-4 mr-1" />
            使用公司網路自動打卡
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationCheckIn;
