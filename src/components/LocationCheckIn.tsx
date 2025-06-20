
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Wifi, 
  AlertCircle,
  Clock,
  Building2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useCheckIn } from '@/hooks/useCheckIn';
import { useUser } from '@/contexts/UserContext';
import { useDepartmentManagementContext } from '@/components/departments/DepartmentManagementContext';
import CheckInCompletedStatus from '@/components/check-in/CheckInCompletedStatus';
import CheckInStatusInfo from '@/components/check-in/CheckInStatusInfo';
import CheckInButton from '@/components/check-in/CheckInButton';
import { isDepartmentReadyForCheckIn, getDepartmentGPSStatusMessage } from '@/utils/departmentCheckInUtils';

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
  const isDepartmentGPSReady = employeeDepartment ? isDepartmentReadyForCheckIn(employeeDepartment) : false;

  // 判斷是否可以進行位置打卡
  const canUseLocationCheckIn = currentUser.department ? isDepartmentGPSReady : true; // 無部門則可使用總公司
  
  const handleCheckIn = checkInMethod === 'location' ? onLocationCheckIn : onIpCheckIn;

  // 取得比對位置資訊
  const getComparisonLocationInfo = () => {
    if (!currentUser.department) {
      return {
        name: '總公司',
        status: 'available',
        statusColor: 'text-green-200',
        icon: <CheckCircle2 className="h-4 w-4" />
      };
    }

    if (!employeeDepartment) {
      return {
        name: currentUser.department,
        status: 'not_found',
        statusColor: 'text-red-200',
        icon: <XCircle className="h-4 w-4" />
      };
    }

    const isReady = isDepartmentReadyForCheckIn(employeeDepartment);
    return {
      name: employeeDepartment.name,
      status: isReady ? 'ready' : 'not_ready',
      statusColor: isReady ? 'text-green-200' : 'text-yellow-200',
      icon: isReady ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />
    };
  };

  const locationInfo = getComparisonLocationInfo();

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

        {/* 比對位置資訊 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-lg p-3 border border-white/20">
          <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
            <Building2 className="h-4 w-4" />
            <span className="font-medium">本次比對位置：</span>
          </div>
          <div className="flex items-center gap-2">
            {locationInfo.icon}
            <span className={`font-medium ${locationInfo.statusColor}`}>
              {locationInfo.name}
            </span>
            <span className="text-xs text-white/60">
              ({locationInfo.status === 'ready' ? 'GPS已設定' : 
                locationInfo.status === 'available' ? '總公司GPS' :
                locationInfo.status === 'not_found' ? '部門不存在' : 'GPS未設定'})
            </span>
          </div>
          
          {/* GPS狀態詳細說明 */}
          {employeeDepartment && (
            <div className="mt-2 text-xs text-white/70">
              {getDepartmentGPSStatusMessage(employeeDepartment)}
            </div>
          )}
        </div>

        {/* 打卡方式選擇 */}
        <div className="grid grid-cols-2 gap-2 bg-white/20 backdrop-blur-xl rounded-xl p-1 border border-white/20">
          <Button
            variant={checkInMethod === 'location' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCheckInMethod('location')}
            disabled={!canUseLocationCheckIn}
            className={`flex items-center justify-center space-x-1 text-sm transition-all duration-200 ${
              checkInMethod === 'location' 
                ? 'bg-white/40 text-gray-800 hover:bg-white/50' 
                : 'bg-transparent text-white/80 hover:bg-white/20'
            } ${!canUseLocationCheckIn ? 'opacity-50 cursor-not-allowed' : ''}`}
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

        {/* GPS 不可用警告 */}
        {checkInMethod === 'location' && !canUseLocationCheckIn && (
          <div className="bg-yellow-500/20 backdrop-blur-xl rounded-lg p-3 border border-yellow-400/30">
            <div className="flex items-center gap-2 text-yellow-200 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">位置打卡暫不可用</span>
            </div>
            <div className="text-yellow-200/80 text-xs mt-1">
              {employeeDepartment 
                ? `部門「${employeeDepartment.name}」的GPS座標尚未設定，請聯繫管理者進行設定後再使用位置打卡功能。`
                : '無法取得部門資訊，請聯繫管理者。'
              }
            </div>
          </div>
        )}

        <CheckInButton
          actionType={actionType}
          loading={loading}
          onCheckIn={handleCheckIn}
          disabled={checkInMethod === 'location' && !canUseLocationCheckIn}
        />

        {/* 狀態資訊 */}
        {distance !== null && !error && checkInMethod === 'location' && (
          <div className="text-center text-sm text-white/80 drop-shadow-md">
            <MapPin className="inline h-4 w-4 mr-1" />
            距離{locationInfo.name}: <span className="font-medium">{Math.round(distance)} 公尺</span>
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
