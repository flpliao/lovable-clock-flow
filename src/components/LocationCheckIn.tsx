import { useEffect, useState } from 'react';

// Import the new smaller components
import CheckInButton from '@/components/check-in/CheckInButton';
import CheckInCompletedStatus from '@/components/check-in/CheckInCompletedStatus';
import CheckInMethodSelector from '@/components/check-in/CheckInMethodSelector';
import CheckInStatus from '@/components/check-in/CheckInStatus';
import CheckInWarning from '@/components/check-in/CheckInWarning';
import LocationCheckInHeader from '@/components/check-in/LocationCheckInHeader';
import MissedCheckinDialog from '@/components/check-in/MissedCheckinDialog';
import { CHECK_IN, CHECK_OUT, CheckInType } from '@/constants/checkInTypes';
import { useCheckInPoints } from '@/hooks/useCheckInPoints';
import { useToast } from '@/hooks/useToast';
import {
  createIpCheckInRecord,
  createLocationCheckInRecord,
  getTodayCheckInRecords,
} from '@/services/checkInService';
import { CheckInRecord } from '@/types/checkIn';
import NearestCheckInPointInfo from './check-in/NearestCheckInPointInfo';

const LocationCheckIn = () => {
  const { data: checkInPoints, loadCheckInPoints, currentPos } = useCheckInPoints();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkInMethod, setCheckInMethod] = useState<'location' | 'ip'>('location');
  const [type, setType] = useState<CheckInType>(CHECK_IN);
  const [todayRecords, setTodayRecords] = useState<{
    [CHECK_IN]?: CheckInRecord;
    [CHECK_OUT]?: CheckInRecord;
  }>({});

  // 自動載入今日打卡紀錄
  useEffect(() => {
    const fetchTodayRecords = async () => {
      const records = await getTodayCheckInRecords();
      setTodayRecords(records);
      if (type === CHECK_IN && records?.[CHECK_IN] && !records?.[CHECK_OUT]) {
        setType(CHECK_OUT);
      }
    };

    fetchTodayRecords();
    loadCheckInPoints();
  }, []); // 移除不必要的依賴

  // 位置打卡
  const handleLocationCheckIn = async () => {
    if (loading) return; // 防止重複觸發
    setLoading(true);

    if (!checkInPoints || checkInPoints.length === 0) {
      toast({
        title: '打卡失敗',
        description: '無可用打卡點',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const result = await createLocationCheckInRecord({
      type,
      selectedCheckpoint: checkInPoints[0],
    });

    if (result) {
      handleCheckIn(result);
    }

    setLoading(false);
  };

  // 包裝 onIpCheckIn，防止重複觸發
  const handleIpCheckIn = async () => {
    if (loading) return;
    setLoading(true);

    const result = await createIpCheckInRecord(type);
    if (result) {
      handleCheckIn(result);
    }

    setLoading(false);
  };

  const handleCheckIn = (result: CheckInRecord) => {
    // 更新 todayRecords
    const newRecords = { ...todayRecords, [result.type]: result };
    setTodayRecords(newRecords);

    if (result.type === CHECK_IN) {
      setType(CHECK_OUT);
    }

    toast({
      title: '打卡成功',
      description: `${type === CHECK_IN ? '上班' : '下班'}打卡完成`,
    });

    // 使用最新的值來記錄
    console.log('新紀錄：', result);
    console.log('更新後的打卡記錄：', newRecords);
  };

  const noAvailableCheckInPoint =
    checkInMethod === 'location' && (!checkInPoints || checkInPoints.length === 0);

  // 如果已完成今日打卡，顯示完成狀態
  if (todayRecords?.[CHECK_IN] && todayRecords?.[CHECK_OUT]) {
    return (
      <div className="flex justify-center items-center w-full min-h-[180px]">
        <div className="max-w-md w-full mx-4">
          <CheckInCompletedStatus
            checkIn={todayRecords?.[CHECK_IN]}
            checkOut={todayRecords?.[CHECK_OUT]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full min-h-[180px]">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 shadow-lg space-y-3 max-w-md w-full mx-4 py-[20px]">
        <LocationCheckInHeader />
        <CheckInStatus checkIn={todayRecords?.[CHECK_IN]} />
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
        {checkInMethod === 'location' && (
          <NearestCheckInPointInfo currentPos={currentPos} checkInPoints={checkInPoints} />
        )}
        <CheckInButton
          type={type}
          loading={loading}
          onCheckIn={checkInMethod === 'location' ? handleLocationCheckIn : handleIpCheckIn}
          disabled={loading || noAvailableCheckInPoint}
        />
        <div className="flex justify-center">
          <MissedCheckinDialog onSuccess={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default LocationCheckIn;
