
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
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-gray-500">
            請先登入以使用打卡功能
          </div>
        </CardContent>
      </Card>
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-center space-x-2 text-lg">
          <Clock className="h-5 w-5" />
          <span>員工打卡</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CheckInStatusInfo checkIn={safeCheckIn} checkOut={safeCheckOut} />

        {/* 打卡方式選擇 */}
        <div className="grid grid-cols-2 gap-2 bg-gray-100 rounded-lg p-1">
          <Button
            variant={checkInMethod === 'location' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCheckInMethod('location')}
            className="flex items-center justify-center space-x-1 text-sm"
          >
            <MapPin className="h-4 w-4" />
            <span>位置打卡</span>
          </Button>
          <Button
            variant={checkInMethod === 'ip' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCheckInMethod('ip')}
            className="flex items-center justify-center space-x-1 text-sm"
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
          <div className="text-center text-sm text-gray-600">
            <MapPin className="inline h-4 w-4 mr-1" />
            距離公司: <span className="font-medium">{Math.round(distance)} 公尺</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center space-x-2 text-red-600 text-sm bg-red-50 rounded-lg p-3">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        {!loading && checkInMethod === 'ip' && (
          <div className="text-center text-sm text-gray-600">
            <Wifi className="inline h-4 w-4 mr-1" />
            使用公司網路自動打卡
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationCheckIn;
