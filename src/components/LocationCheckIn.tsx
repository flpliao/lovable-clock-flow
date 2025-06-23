
import React, { useState } from 'react';
import { useCheckIn } from '@/hooks/useCheckIn';
import { useUser } from '@/contexts/UserContext';
import { useDepartmentManagementContext } from '@/components/departments/DepartmentManagementContext';
import { isDepartmentReadyForCheckIn } from '@/utils/departmentCheckInUtils';

// Import the new smaller components
import CheckInCompletedStatus from '@/components/check-in/CheckInCompletedStatus';
import CheckInStatusInfo from '@/components/check-in/CheckInStatusInfo';
import CheckInButton from '@/components/check-in/CheckInButton';
import LocationCheckInHeader from '@/components/check-in/LocationCheckInHeader';
import DepartmentLocationSelector from '@/components/check-in/DepartmentLocationSelector';
import CheckInMethodSelector from '@/components/check-in/CheckInMethodSelector';
import CheckInWarning from '@/components/check-in/CheckInWarning';
import CheckInStatusDisplay from '@/components/check-in/CheckInStatusDisplay';
import MissedCheckinDialog from '@/components/check-in/MissedCheckinDialog';

const LocationCheckIn = () => {
  const { currentUser } = useUser();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);
  
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
  } = useCheckIn(currentUser?.id || '', selectedDepartmentId);

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

  console.log('🔍 LocationCheckIn - 選擇的部門ID:', selectedDepartmentId);

  // 根據選擇的部門ID找到對應的部門資料
  const selectedDepartment = selectedDepartmentId ? 
    departments?.find(dept => dept.id === selectedDepartmentId) : null;

  const isDepartmentGPSReady = selectedDepartment ? isDepartmentReadyForCheckIn(selectedDepartment) : true;

  // 判斷是否可以進行位置打卡
  const canUseLocationCheckIn = selectedDepartmentId ? isDepartmentGPSReady : true;

  const handleCheckIn = checkInMethod === 'location' ? onLocationCheckIn : onIpCheckIn;

  // 取得比對位置資訊
  const getLocationName = () => {
    if (!selectedDepartmentId) {
      return '總公司';
    }
    return selectedDepartment?.name || '未知部門';
  };
  const locationName = getLocationName();

  const handleMissedCheckinSuccess = () => {
    console.log('忘記打卡申請已提交');
  };
  
  return (
    <div className="flex justify-center items-center w-full min-h-[250px]">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 shadow-lg space-y-4 max-w-md w-full mx-4 py-[30px]">
        <LocationCheckInHeader />

        <CheckInStatusInfo checkIn={safeCheckIn} checkOut={safeCheckOut} />

        <DepartmentLocationSelector 
          departments={departments}
          selectedDepartmentId={selectedDepartmentId}
          onDepartmentChange={setSelectedDepartmentId}
        />

        <CheckInMethodSelector 
          checkInMethod={checkInMethod} 
          setCheckInMethod={setCheckInMethod} 
          canUseLocationCheckIn={canUseLocationCheckIn} 
        />

        <CheckInWarning 
          checkInMethod={checkInMethod} 
          canUseLocationCheckIn={canUseLocationCheckIn} 
          employeeDepartment={selectedDepartment} 
        />

        <CheckInButton 
          actionType={actionType} 
          loading={loading} 
          onCheckIn={handleCheckIn} 
          disabled={checkInMethod === 'location' && !canUseLocationCheckIn} 
        />

        <div className="flex justify-center">
          <MissedCheckinDialog onSuccess={handleMissedCheckinSuccess} />
        </div>

        <CheckInStatusDisplay 
          checkInMethod={checkInMethod} 
          distance={distance} 
          error={error} 
          loading={loading} 
          locationName={locationName} 
        />
      </div>
    </div>
  );
};

export default LocationCheckIn;
