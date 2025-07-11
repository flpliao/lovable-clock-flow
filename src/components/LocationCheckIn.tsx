import { useCurrentUser } from '@/hooks/useStores';
import { useEffect, useState } from 'react';

// Import the new smaller components
import CheckInButton from '@/components/check-in/CheckInButton';
import CheckInCompletedStatus from '@/components/check-in/CheckInCompletedStatus';
import CheckInMethodSelector from '@/components/check-in/CheckInMethodSelector';
import CheckInStatusInfo from '@/components/check-in/CheckInStatusInfo';
import CheckInWarning from '@/components/check-in/CheckInWarning';
import DepartmentLocationSelector from '@/components/check-in/DepartmentLocationSelector';
import LocationCheckInHeader from '@/components/check-in/LocationCheckInHeader';
import MissedCheckinDialog from '@/components/check-in/MissedCheckinDialog';
import { useCheckpoints } from '@/components/company/components/useCheckpoints';
import { useSupabaseCheckIn } from '@/hooks/useSupabaseCheckIn';
import { CheckInRecord } from '@/types';
import ActionTypeSelector from '@/components/check-in/ActionTypeSelector';

const LocationCheckIn = () => {
  const currentUser = useCurrentUser(); // 使用新的 Zustand hook
  const { data: checkpoints } = useCheckpoints();
  const [selectedCheckpointId, setSelectedCheckpointId] = useState<number | null>(null);
  const { createCheckInRecord, getTodayCheckInRecords } = useSupabaseCheckIn();

  // 自動載入今日打卡紀錄
  useEffect(() => {
    const fetchTodayRecords = async () => {
      if (currentUser?.id) {
        const records = await getTodayCheckInRecords(currentUser.id);
        setTodayRecords(records);
        if (actionType === 'check-in' && records?.checkIn && !records?.checkOut) {
          setActionType('check-out');
        }
      }
    };
    fetchTodayRecords();
  }, [currentUser?.id, getTodayCheckInRecords]);

  // 打卡邏輯
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [checkInMethod, setCheckInMethod] = useState<'location' | 'ip'>('location');
  const [actionType, setActionType] = useState<'check-in' | 'check-out'>('check-in');
  const [todayRecords, setTodayRecords] = useState<{
    checkIn?: CheckInRecord;
    checkOut?: CheckInRecord;
  }>({});

  // 取得目前選擇的 checkpoint
  const selectedCheckpoint =
    selectedCheckpointId !== null ? checkpoints.find(cp => cp.id === selectedCheckpointId) : null;

  // 位置打卡
  const onLocationCheckIn = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!currentUser) throw new Error('請先登入');
      // 取得目前位置
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;
      // 取得比對目標
      let targetLat = null,
        targetLng = null,
        locationName = '總公司';
      if (selectedCheckpoint) {
        targetLat = selectedCheckpoint.latitude;
        targetLng = selectedCheckpoint.longitude;
        locationName = selectedCheckpoint.name;
      }
      // 計算距離
      const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const toRad = (v: number) => (v * Math.PI) / 180;
        const R = 6371000;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c);
      };
      const dist = getDistance(latitude, longitude, targetLat, targetLng);
      setDistance(dist);
      // 距離限制（可自訂）
      const allowedDistance = 500;
      if (dist > allowedDistance) throw new Error(`距離${locationName}過遠 (${dist}公尺)`);
      // 儲存打卡記錄
      const checkInData = {
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        type: 'location' as const,
        status: 'success' as const,
        action: actionType as 'check-in' | 'check-out',
        details: {
          latitude,
          longitude,
          distance: dist,
          locationName,
        },
      };
      const success = await createCheckInRecord(checkInData);
      if (success) {
        // 重新載入今日記錄
        if (currentUser?.id) {
          const records = await getTodayCheckInRecords(currentUser.id);
          setTodayRecords(records);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '位置打卡失敗');
    } finally {
      setLoading(false);
    }
  };

  // UI
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center w-full min-h-[180px]">
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
      <div className="flex justify-center items-center w-full min-h-[180px]">
        <div className="max-w-md w-full mx-4">
          <CheckInCompletedStatus checkIn={safeCheckIn} checkOut={safeCheckOut} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full min-h-[180px]">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 shadow-lg space-y-3 max-w-md w-full mx-4 py-[20px]">
        <LocationCheckInHeader />
        <CheckInStatusInfo checkIn={todayRecords?.checkIn} checkOut={todayRecords?.checkOut} />
        <DepartmentLocationSelector
          selectedCheckpointId={selectedCheckpointId}
          onCheckpointChange={setSelectedCheckpointId}
        />
        <CheckInMethodSelector
          checkInMethod={checkInMethod}
          setCheckInMethod={setCheckInMethod}
          canUseLocationCheckIn={true}
        />
        <CheckInWarning
          checkInMethod={checkInMethod}
          canUseLocationCheckIn={true}
          employeeDepartment={null}
        />
        <CheckInButton
          actionType={actionType}
          loading={loading}
          onCheckIn={checkInMethod === 'location' ? onLocationCheckIn : undefined}
          disabled={loading}
        />
        <div className="flex justify-center">
          <MissedCheckinDialog onSuccess={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default LocationCheckIn;
