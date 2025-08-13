import { useEffect, useState } from 'react';

// Import the new smaller components
import CheckInButton from '@/components/check-in/CheckInButton';
import CheckInCompletedStatus from '@/components/check-in/CheckInCompletedStatus';
import CheckInMethodSelector from '@/components/check-in/CheckInMethodSelector';
import CheckInStatus from '@/components/check-in/CheckInStatus';
import MissedCheckInDialog from '@/components/check-in/MissedCheckInDialog';
import { RequestType } from '@/constants/checkInTypes';
import { useCheckInPoints } from '@/hooks/useCheckInPoints';
import { useMyMissedCheckInRequests } from '@/hooks/useMyMissedCheckInRequests';
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
  const { todayRequests, loadMyMissedCheckInRequests } = useMyMissedCheckInRequests();

  // 自動載入今日打卡紀錄和忘記打卡申請
  useEffect(() => {
    const fetchTodayData = async () => {
      // 載入今日打卡紀錄
      const records = await getTodayCheckInRecords();
      setTodayRecords(records);
    };

    fetchTodayData();
    loadCheckInPoints();
    loadMyMissedCheckInRequests(); // 載入忘記打卡申請
  }, []); // 只在組件掛載時執行一次

  useEffect(() => {
    determineCheckInType(todayRecords, todayRequests);
  }, [todayRecords, todayRequests]);

  // 決定打卡類型的邏輯
  const determineCheckInType = (
    records: {
      [RequestType.CHECK_IN]?: CheckInRecord;
      [RequestType.CHECK_OUT]?: CheckInRecord;
    },
    missedRequests: { request_type: string }[]
  ) => {
    const hasCheckIn = records?.[RequestType.CHECK_IN];

    // 檢查是否有對應的忘記打卡申請
    const hasMissedCheckIn = missedRequests.some(req => req.request_type === RequestType.CHECK_IN);

    // 簡化邏輯：有上班相關記錄就顯示下班打卡，否則顯示上班打卡
    if (hasCheckIn || hasMissedCheckIn) {
      setType(RequestType.CHECK_OUT);
    } else {
      setType(RequestType.CHECK_IN);
    }
  };

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

    toast({
      title: '打卡成功',
      description: `${type === RequestType.CHECK_IN ? '上班' : '下班'}打卡完成`,
    });
  };

  const noAvailableCheckInPoint =
    checkInMethod === 'location' && (!checkInPoints || checkInPoints.length === 0);

  // 檢查今日是否已完成打卡（包括實際打卡和忘記打卡申請）
  const hasCompletedToday =
    (todayRecords?.[RequestType.CHECK_IN] ||
      todayRequests.some(req => req.request_type === RequestType.CHECK_IN)) &&
    (todayRecords?.[RequestType.CHECK_OUT] ||
      todayRequests.some(req => req.request_type === RequestType.CHECK_OUT));

  // 如果已完成今日打卡，顯示完成狀態
  if (hasCompletedToday) {
    return (
      <div className="flex justify-center items-center w-full min-h-[180px]">
        <div className="max-w-md w-full mx-4">
          <CheckInCompletedStatus
            checkIn={todayRecords?.[RequestType.CHECK_IN]}
            checkOut={todayRecords?.[RequestType.CHECK_OUT]}
            hasMissedCheckIn={todayRequests.some(req => req.request_type === RequestType.CHECK_IN)}
            hasMissedCheckOut={todayRequests.some(
              req => req.request_type === RequestType.CHECK_OUT
            )}
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
        <CheckInStatus
          checkIn={todayRecords?.[RequestType.CHECK_IN]}
          hasMissedCheckIn={todayRequests.some(req => req.request_type === RequestType.CHECK_IN)}
        />
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
          <MissedCheckInDialog />
        </div>
      </div>
    </div>
  );
};

export default LocationCheckIn;
