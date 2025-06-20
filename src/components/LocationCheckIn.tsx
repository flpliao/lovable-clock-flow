
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Wifi, 
  AlertCircle,
  Clock,
  Building2
} from 'lucide-react';
import { useCheckIn } from '@/hooks/useCheckIn';
import { useUser } from '@/contexts/UserContext';
import { useDepartmentManagementContext } from '@/components/departments/DepartmentManagementContext';
import CheckInCompletedStatus from '@/components/check-in/CheckInCompletedStatus';
import CheckInStatusInfo from '@/components/check-in/CheckInStatusInfo';
import CheckInButton from '@/components/check-in/CheckInButton';

const LocationCheckIn = () => {
  const { currentUser } = useUser();
  const { departments } = useDepartmentManagementContext();
  
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
      <div className="flex justify-center items-center w-full min-h-[250px]">
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 shadow-lg max-w-md w-full mx-4">
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
      <div className="flex justify-center items-center w-full min-h-[250px]">
        <div className="max-w-md w-full mx-4">
          <CheckInCompletedStatus checkIn={safeCheckIn} checkOut={safeCheckOut} />
        </div>
      </div>
    );
  }

  // 找出員工所屬部門
  const employeeDepartment = departments?.find(dept => dept.name === currentUser.department);
  const hasValidDepartmentGPS = employeeDepartment?.latitude && employeeDepartment?.longitude && employeeDepartment?.address_verified;

  const handleCheckIn = checkInMethod === 'location' ? onLocationCheckIn : onIpCheckIn;

  return (
    <div className="flex justify-center items-center w-full min-h-[250px]">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 shadow-lg space-y-4 max-w-md w-full mx-4">
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

        {/* 部門GPS狀態顯示 */}
        {checkInMethod === 'location' && currentUser.department && (
          <div className="bg-white/10 backdrop-blur-xl rounded-lg p-3 border border-white/20">
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Building2 className="h-4 w-4" />
              <span className="font-medium">打卡對比位置：</span>
            </div>
            <div className="text-white/80 text-sm mt-1">
              {hasValidDepartmentGPS ? (
                <span className="text-green-200">
                  {currentUser.department} (部門GPS)
                </span>
              ) : (
                <span className="text-yellow-200">
                  總公司 (部門GPS未設定)
                </span>
              )}
            </div>
          </div>
        )}

        <CheckInButton
          actionType={actionType}
          loading={loading}
          onCheckIn={handleCheckIn}
        />

        {/* 狀態資訊 */}
        {distance !== null && !error && checkInMethod === 'location' && (
          <div className="text-center text-sm text-white/80 drop-shadow-md">
            <MapPin className="inline h-4 w-4 mr-1" />
            距離{hasValidDepartmentGPS ? currentUser.department : '總公司'}: <span className="font-medium">{Math.round(distance)} 公尺</span>
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
