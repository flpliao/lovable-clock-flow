import { useDepartmentManagementContext } from '@/components/departments/DepartmentManagementContext';
import { useCheckIn } from '@/hooks/useCheckIn';
import { useCurrentUser } from '@/hooks/useStores';
import { isDepartmentReadyForCheckIn } from '@/utils/departmentCheckInUtils';
import { useEffect, useState, useMemo, useCallback } from 'react';

// Import the new smaller components
import CheckInButton from '@/components/check-in/CheckInButton';
import CheckInCompletedStatus from '@/components/check-in/CheckInCompletedStatus';
import CheckInMethodSelector from '@/components/check-in/CheckInMethodSelector';
import CheckInStatusDisplay from '@/components/check-in/CheckInStatusDisplay';
import CheckInStatusInfo from '@/components/check-in/CheckInStatusInfo';
import CheckInWarning from '@/components/check-in/CheckInWarning';
import DepartmentLocationSelector from '@/components/check-in/DepartmentLocationSelector';
import LocationCheckInHeader from '@/components/check-in/LocationCheckInHeader';
import MissedCheckinDialog from '@/components/check-in/MissedCheckinDialog';

const LocationCheckIn = () => {
  const currentUser = useCurrentUser(); // 使用新的 Zustand hook
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);

  // Use defensive context access with fallback
  let departments = [];
  try {
    const context = useDepartmentManagementContext();
    departments = context.departments || [];
  } catch {
    console.warn('DepartmentManagementContext not available, using empty departments array');
    departments = [];
  }

  // 根據當前用戶的部門設定預設打卡位置
  useEffect(() => {
    if (currentUser && departments.length > 0) {
      console.log('🔍 設定預設打卡位置 - 用戶部門:', currentUser.department);

      if (currentUser.department) {
        // 查找用戶部門對應的部門ID
        const userDepartment = departments.find(dept => dept.name === currentUser.department);
        if (userDepartment && isDepartmentReadyForCheckIn(userDepartment)) {
          console.log('✅ 找到用戶部門，設定為預設打卡位置:', userDepartment.name);
          setSelectedDepartmentId(prevId =>
            prevId !== userDepartment.id ? userDepartment.id : prevId
          );
        } else {
          console.log('⚠️ 用戶部門GPS未設定完成，預設為總公司');
          setSelectedDepartmentId(prevId => (prevId !== null ? null : prevId)); // 總公司
        }
      } else {
        console.log('📍 用戶沒有部門，預設為總公司');
        setSelectedDepartmentId(prevId => (prevId !== null ? null : prevId)); // 總公司
      }
    }
  }, [currentUser, departments]);

  const {
    loading,
    error,
    distance,
    checkInMethod,
    setCheckInMethod,
    actionType,
    todayRecords,
    onLocationCheckIn,
    onIpCheckIn,
  } = useCheckIn(currentUser?.id || '', selectedDepartmentId);

  // Memoize computations before early returns
  // 根據選擇的部門ID找到對應的部門資料 (memoized)
  const selectedDepartment = useMemo(() => {
    return selectedDepartmentId
      ? departments?.find(dept => dept.id === selectedDepartmentId)
      : null;
  }, [selectedDepartmentId, departments]);

  // 檢查部門GPS是否準備好 (memoized)
  const isDepartmentGPSReady = useMemo(() => {
    return selectedDepartment ? isDepartmentReadyForCheckIn(selectedDepartment) : true;
  }, [selectedDepartment]);

  // 判斷是否可以進行位置打卡 (memoized)
  const canUseLocationCheckIn = useMemo(() => {
    return selectedDepartmentId ? isDepartmentGPSReady : true;
  }, [selectedDepartmentId, isDepartmentGPSReady]);

  // 取得比對位置資訊 (memoized)
  const locationName = useMemo(() => {
    if (!selectedDepartmentId) {
      return '總公司';
    }
    return selectedDepartment?.name || '未知部門';
  }, [selectedDepartmentId, selectedDepartment]);

  const handleMissedCheckinSuccess = useCallback(() => {
    console.log('忘記打卡申請已提交');
  }, []);

  const handleDepartmentChange = useCallback((departmentId: string | null) => {
    setSelectedDepartmentId(departmentId);
  }, []);

  // Early return if no user
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center w-full min-h-[250px]">
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 shadow-lg max-w-md w-full mx-4">
          <div className="text-center text-white/80">請先登入以使用打卡功能</div>
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

  const handleCheckIn = checkInMethod === 'location' ? onLocationCheckIn : onIpCheckIn;

  return (
    <div className="flex justify-center items-center w-full min-h-[250px]">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 shadow-lg space-y-4 max-w-md w-full mx-4 py-[30px]">
        <LocationCheckInHeader />

        <CheckInStatusInfo checkIn={safeCheckIn} checkOut={safeCheckOut} />

        <DepartmentLocationSelector
          departments={departments}
          selectedDepartmentId={selectedDepartmentId}
          onDepartmentChange={handleDepartmentChange}
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
