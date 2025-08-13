import { useEffect, useState } from 'react';

// Import the new smaller components
import CheckInButton from '@/components/check-in/CheckInButton';
import CheckInCompletedStatus from '@/components/check-in/CheckInCompletedStatus';
import CheckInMethodSelector from '@/components/check-in/CheckInMethodSelector';
import CheckInStatus from '@/components/check-in/CheckInStatus';
import MissedCheckinDialog from '@/components/check-in/MissedCheckinDialog';
import { RequestType } from '@/constants/checkInTypes';
import { useCheckInPoints } from '@/hooks/useCheckInPoints';
import { useToast } from '@/hooks/useToast';
import {
  createIpCheckInRecord,
  createLocationCheckInRecord,
  getTodayCheckInRecords,
} from '@/services/checkInService';
import { CheckInRecord } from '@/types';
import { Clock } from 'lucide-react';
import NearestCheckInPointInfo from './check-in/NearestCheckInPointInfo';

const LocationCheckIn = () => {
  const { data: checkInPoints, loadCheckInPoints, currentPos } = useCheckInPoints();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkInMethod, setCheckInMethod] = useState<'location' | 'ip'>('location');
  const [type, setType] = useState<RequestType.CHECK_IN | RequestType.CHECK_OUT>(
    RequestType.CHECK_IN
  );
  const [todayRecords, setTodayRecords] = useState<{
    [RequestType.CHECK_IN]?: CheckInRecord;
    [RequestType.CHECK_OUT]?: CheckInRecord;
  }>({});

  // 自動載入今日打卡紀錄
  useEffect(() => {
    const fetchTodayRecords = async () => {
      const records = await getTodayCheckInRecords();
      setTodayRecords(records);
      if (
        type === RequestType.CHECK_IN &&
        records?.[RequestType.CHECK_IN] &&
        !records?.[RequestType.CHECK_OUT]
      ) {
        setType(RequestType.CHECK_OUT);
      }
    };

    fetchTodayRecords();
    loadCheckInPoints();
  }, []); // 移除不必要的依賴

  // 位置打卡
  const handleLocationCheckIn = async () => {
    if (isSubmitting) return; // 防止重複觸發
    setIsSubmitting(true);

    if (!checkInPoints || checkInPoints.length === 0) {
      toast({
        title: '打卡失敗',
        description: '無可用打卡點',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    const result = await createLocationCheckInRecord({
      type,
      selectedCheckpoint: checkInPoints[0],
    });

    if (result) {
      handleCheckIn(result);
    }

    setIsSubmitting(false);
  };

  // 包裝 onIpCheckIn，防止重複觸發
  const handleIpCheckIn = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const result = await createIpCheckInRecord(type);
    if (result) {
      handleCheckIn(result);
    }

    setIsSubmitting(false);
  };

  const handleCheckIn = (result: CheckInRecord) => {
    // 更新 todayRecords
    const newRecords = { ...todayRecords, [result.type]: result };
    setTodayRecords(newRecords);

    if (result.type === RequestType.CHECK_IN) {
      setType(RequestType.CHECK_OUT);
    }

    toast({
      title: '打卡成功',
      description: `${type === RequestType.CHECK_IN ? '上班' : '下班'}打卡完成`,
    });
  };

  const noAvailableCheckInPoint =
    checkInMethod === 'location' && (!checkInPoints || checkInPoints.length === 0);

  // 如果已完成今日打卡，顯示完成狀態
  if (todayRecords?.[RequestType.CHECK_IN] && todayRecords?.[RequestType.CHECK_OUT]) {
    return (
      <div className="flex justify-center items-center w-full min-h-[180px]">
        <div className="max-w-md w-full mx-4">
          <CheckInCompletedStatus
            checkIn={todayRecords?.[RequestType.CHECK_IN]}
            checkOut={todayRecords?.[RequestType.CHECK_OUT]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full min-h-[180px]">
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 shadow-lg space-y-3 max-w-md w-full mx-4 py-[20px]">
        <div className="flex items-center justify-center space-x-2 text-white mb-4">
          <div className="p-2 bg-blue-500/80 rounded-lg shadow-md backdrop-blur-xl border border-blue-400/50">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold drop-shadow-md">打卡</span>
        </div>
        <CheckInStatus checkIn={todayRecords?.[RequestType.CHECK_IN]} />
        <CheckInMethodSelector
          checkInMethod={checkInMethod}
          setCheckInMethod={setCheckInMethod}
          disabled={isSubmitting}
        />
        {checkInMethod === 'location' && (
          <NearestCheckInPointInfo currentPos={currentPos} checkInPoints={checkInPoints} />
        )}
        <CheckInButton
          type={type}
          isLoading={isSubmitting}
          onCheckIn={checkInMethod === 'location' ? handleLocationCheckIn : handleIpCheckIn}
          disabled={noAvailableCheckInPoint}
        />
        <div className="flex justify-center">
          <MissedCheckinDialog onSuccess={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default LocationCheckIn;
