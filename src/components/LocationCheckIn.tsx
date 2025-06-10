
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { createLiquidGlassEffect } from '@/utils/visionProStyles';

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
      <div className={`${createLiquidGlassEffect(true, true)} p-6`}>
        <div className="text-center text-white/80">
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
    <div className={`${createLiquidGlassEffect(true, true)} overflow-hidden relative`}>
      {/* 極淡藍色背景效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/15 via-slate-50/10 to-white/5"></div>
      
      <div className="relative z-10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-center space-x-2 text-lg text-white drop-shadow-lg">
            <Clock className="h-5 w-5" />
            <span>員工打卡</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <CheckInStatusInfo checkIn={safeCheckIn} checkOut={safeCheckOut} />

          {/* 打卡方式選擇 */}
          <div className="grid grid-cols-2 gap-2 bg-blue-50/20 backdrop-blur-xl rounded-lg p-1 border border-blue-50/30">
            <Button
              variant={checkInMethod === 'location' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCheckInMethod('location')}
              className="flex items-center justify-center space-x-1 text-sm bg-white/20 hover:bg-white/30 text-white border-blue-50/20"
            >
              <MapPin className="h-4 w-4" />
              <span>位置打卡</span>
            </Button>
            <Button
              variant={checkInMethod === 'ip' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCheckInMethod('ip')}
              className="flex items-center justify-center space-x-1 text-sm bg-white/20 hover:bg-white/30 text-white border-blue-50/20"
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
            <div className="text-center text-sm text-white/90 drop-shadow-md">
              <MapPin className="inline h-4 w-4 mr-1" />
              距離公司: <span className="font-medium">{Math.round(distance)} 公尺</span>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center space-x-2 text-red-200 text-sm bg-red-400/20 backdrop-blur-xl rounded-lg p-3 border border-red-300/30">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {!loading && checkInMethod === 'ip' && (
            <div className="text-center text-sm text-white/90 drop-shadow-md">
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
