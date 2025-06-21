
import React from 'react';
import { useCheckIn } from '@/hooks/useCheckIn';
import { useUser } from '@/contexts/UserContext';
import { useDepartmentManagementContext } from '@/components/departments/DepartmentManagementContext';
import { isDepartmentReadyForCheckIn } from '@/utils/departmentCheckInUtils';

// Import the new smaller components
import CheckInCompletedStatus from '@/components/check-in/CheckInCompletedStatus';
import CheckInStatusInfo from '@/components/check-in/CheckInStatusInfo';
import CheckInButton from '@/components/check-in/CheckInButton';
import LocationCheckInHeader from '@/components/check-in/LocationCheckInHeader';
import LocationInfo from '@/components/check-in/LocationInfo';
import CheckInMethodSelector from '@/components/check-in/CheckInMethodSelector';
import CheckInWarning from '@/components/check-in/CheckInWarning';
import CheckInStatusDisplay from '@/components/check-in/CheckInStatusDisplay';
import MissedCheckinDialog from '@/components/check-in/MissedCheckinDialog';

const LocationCheckIn = () => {
  const {
    currentUser
  } = useUser();
  
  // Use defensive context access with fallback
  let departments = [];
  try {
    const context = useDepartmentManagementContext();
    departments = context.departments || [];
  } catch (error) {
    console.warn('DepartmentManagementContext not available, using empty departments array');
    departments = [];
  }

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
    return <div className="flex justify-center items-center w-full min-h-[250px]">
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 shadow-lg max-w-md w-full mx-4">
          <div className="text-center text-white/80">
            請先登入以使用打卡功能
          </div>
        </div>
      </div>;
  }
  
  const safeCheckIn = todayRecords?.checkIn;
  const safeCheckOut = todayRecords?.checkOut;

  // 如果已完成今日打卡，顯示完成狀態
  if (safeCheckIn && safeCheckOut) {
    return <div className="flex justify-center items-center w-full min-h-[250px]">
        <div className="max-w-md w-full mx-4">
          <CheckInCompletedStatus checkIn={safeCheckIn} checkOut={safeCheckOut} />
        </div>
      </div>;
  }

  // 找出員工所屬部門
  const employeeDepartment = departments?.find(dept => dept.name === currentUser.department);
  const isDepartmentGPSReady = employeeDepartment ? isDepartmentReadyForCheckIn(employeeDepartment) : false;

  // 判斷是否可以進行位置打卡
  const canUseLocationCheckIn = currentUser.department ? isDepartmentGPSReady : true; // 無部門則可使用總公司

  const handleCheckIn = checkInMethod === 'location' ? onLocationCheckIn : onIpCheckIn;

  // 取得比對位置資訊
  const getLocationName = () => {
    if (!currentUser.department) {
      return '總公司';
    }
    return employeeDepartment?.name || currentUser.department;
  };
  const locationName = getLocationName();

  const handleMissedCheckinSuccess = () => {
    // 可以在這裡添加重新載入邏輯或顯示成功訊息
    console.log('忘記打卡申請已提交');
  };
  
  return <div className="flex justify-center items-center w-full min-h-[250px]">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 shadow-lg space-y-4 max-w-md w-full mx-4 py-[30px]">
        <LocationCheckInHeader />

        <CheckInStatusInfo checkIn={safeCheckIn} checkOut={safeCheckOut} />

        <LocationInfo currentUser={currentUser} employeeDepartment={employeeDepartment} />

        <CheckInMethodSelector checkInMethod={checkInMethod} setCheckInMethod={setCheckInMethod} canUseLocationCheckIn={canUseLocationCheckIn} />

        <CheckInWarning checkInMethod={checkInMethod} canUseLocationCheckIn={canUseLocationCheckIn} employeeDepartment={employeeDepartment} />

        <CheckInButton actionType={actionType} loading={loading} onCheckIn={handleCheckIn} disabled={checkInMethod === 'location' && !canUseLocationCheckIn} />

        {/* 忘記打卡按鈕區域 */}
        <div className="flex justify-center">
          <MissedCheckinDialog onSuccess={handleMissedCheckinSuccess} />
        </div>

        <CheckInStatusDisplay checkInMethod={checkInMethod} distance={distance} error={error} loading={loading} locationName={locationName} />
      </div>
    </div>;
};

export default LocationCheckIn;
