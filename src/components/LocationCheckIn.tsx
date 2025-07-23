import { useEffect, useState } from 'react';

// Import the new smaller components
import CheckInButton from '@/components/check-in/CheckInButton';
import CheckInCompletedStatus from '@/components/check-in/CheckInCompletedStatus';
import CheckInMethodSelector from '@/components/check-in/CheckInMethodSelector';
import CheckInStatusInfo from '@/components/check-in/CheckInStatusInfo';
import CheckInWarning from '@/components/check-in/CheckInWarning';
import CheckpointSelector from '@/components/check-in/CheckpointSelector';
import LocationCheckInHeader from '@/components/check-in/LocationCheckInHeader';
import MissedCheckinDialog from '@/components/check-in/MissedCheckinDialog';
import { CHECK_IN, CHECK_OUT, CheckInType } from '@/constants/checkInTypes';
import { useCheckpoints } from '@/hooks/useCheckpoints';
import { useToast } from '@/hooks/useToast';
import {
  createIpCheckInRecord,
  createLocationCheckInRecord,
  getTodayCheckInRecords,
} from '@/services/checkInService';
import { CheckInRecord } from '@/types';

const LocationCheckIn = () => {
  const { data: checkpoints } = useCheckpoints();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedCheckpointId, setSelectedCheckpointId] = useState<number | null>(null);
  const [checkInMethod, setCheckInMethod] = useState<'location' | 'ip'>('location');
  const [type, setType] = useState<CheckInType>(CHECK_IN);
  const [todayRecords, setTodayRecords] = useState<{
    checkIn?: CheckInRecord;
    checkOut?: CheckInRecord;
  }>({});

  // 自動載入今日打卡紀錄
  useEffect(() => {
    const fetchTodayRecords = async () => {
      const records = await getTodayCheckInRecords();
      setTodayRecords(records);
      if (type === CHECK_IN && records?.checkIn && !records?.checkOut) {
        setType(CHECK_OUT);
      }
    };
    fetchTodayRecords();
  }, [getTodayCheckInRecords]);

  // 打卡邏輯
  // 取得目前選擇的 checkpoint
  const selectedCheckpoint =
    selectedCheckpointId !== null ? checkpoints.find(cp => cp.id === selectedCheckpointId) : null;

  // 位置打卡
  const handleLocationCheckIn = async () => {
    if (loading) return; // 防止重複觸發
    setLoading(true);
    try {
      if (!selectedCheckpoint) {
        throw new Error('請先選擇打卡地點');
      }

      const result = await createLocationCheckInRecord({
        type,
        selectedCheckpoint,
      });

      handleCheckIn(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '位置打卡失敗';
      toast({
        title: '打卡失敗',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // 包裝 onIpCheckIn，防止重複觸發
  const handleIpCheckIn = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const result = await createIpCheckInRecord(type);
      handleCheckIn(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'IP打卡失敗';
      toast({
        title: '打卡失敗',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = (result: CheckInRecord) => {
    setTodayRecords({ ...todayRecords, [type]: result });
    if (result.type === CHECK_IN) {
      setType(CHECK_OUT);
    }
  };

  // 如果已完成今日打卡，顯示完成狀態
  if (todayRecords?.checkIn && todayRecords?.checkOut) {
    return (
      <div className="flex justify-center items-center w-full min-h-[180px]">
        <div className="max-w-md w-full mx-4">
          <CheckInCompletedStatus
            checkIn={todayRecords?.checkIn}
            checkOut={todayRecords?.checkOut}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full min-h-[180px]">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 shadow-lg space-y-3 max-w-md w-full mx-4 py-[20px]">
        <LocationCheckInHeader />
        <CheckInStatusInfo checkIn={todayRecords?.checkIn} checkOut={todayRecords?.checkOut} />
        <CheckInMethodSelector
          checkInMethod={checkInMethod}
          setCheckInMethod={setCheckInMethod}
          canUseLocationCheckIn={true}
        />
        {checkInMethod === 'location' && (
          <CheckpointSelector
            selectedCheckpointId={selectedCheckpointId}
            onCheckpointChange={setSelectedCheckpointId}
          />
        )}
        <CheckInWarning
          checkInMethod={checkInMethod}
          canUseLocationCheckIn={true}
          employeeDepartment={null}
        />
        <CheckInButton
          type={type}
          loading={loading}
          onCheckIn={checkInMethod === 'location' ? handleLocationCheckIn : handleIpCheckIn}
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
