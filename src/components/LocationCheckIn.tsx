
import React from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { createLiquidGlassEffect, visionProStyles } from '@/utils/visionProStyles';

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
      <div className={`${createLiquidGlassEffect(true, 'default')} p-6`}>
        <div className="text-center text-gray-600">
          請先登入以使用打卡功能
        </div>
      </div>
    );
  }

  const safeCheckIn = todayRecords?.checkIn;
  const safeCheckOut = todayRecords?.checkOut;

  // 如果已完成今日打卡，顯示完成狀態
  if (safeCheckIn && safeCheckOut) {
    return <CheckInCompletedStatus checkIn={safeCheckIn} checkOut={safeCheckOut} />;
  }

  const handleCheckIn = checkInMethod === 'location' ? onLocationCheckIn : onIpCheckIn;

  return (
    <div className={`${createLiquidGlassEffect(true, 'default')} overflow-hidden relative`}>
      {/* 柔和的背景效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/3 to-white/1"></div>
      
      <div className="relative z-10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-center space-x-2 text-lg text-gray-800 drop-shadow-sm">
            <div className={visionProStyles.coloredIconContainer.blue}>
              <Clock className="h-5 w-5" />
            </div>
            <span>員工打卡</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <CheckInStatusInfo checkIn={safeCheckIn} checkOut={safeCheckOut} />

          {/* 打卡方式選擇 */}
          <div className="grid grid-cols-2 gap-2 bg-white/40 backdrop-blur-xl rounded-lg p-1 border border-white/30">
            <Button
              variant={checkInMethod === 'location' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCheckInMethod('location')}
              className="flex items-center justify-center space-x-1 text-sm bg-white/30 hover:bg-white/50 text-gray-800 border-white/20"
            >
              <MapPin className="h-4 w-4" />
              <span>位置打卡</span>
            </Button>
            <Button
              variant={checkInMethod === 'ip' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCheckInMethod('ip')}
              className="flex items-center justify-center space-x-1 text-sm bg-white/30 hover:bg-white/50 text-gray-800 border-white/20"
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
            <div className="text-center text-sm text-gray-700 drop-shadow-sm">
              <MapPin className="inline h-4 w-4 mr-1" />
              距離公司: <span className="font-medium">{Math.round(distance)} 公尺</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center space-x-2 text-red-600 text-sm bg-red-100/60 backdrop-blur-xl rounded-lg p-3 border border-red-200/40">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {!loading && checkInMethod === 'ip' && (
            <div className="text-center text-sm text-gray-700 drop-shadow-sm">
              <Wifi className="inline h-4 w-4 mr-1" />
              使用公司網路自動打卡
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
};

export default LocationCheckIn;
