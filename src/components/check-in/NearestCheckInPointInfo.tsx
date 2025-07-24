import { useCheckInPointStore } from '@/stores/checkInPointStore';
import { Info } from 'lucide-react';
import React from 'react';

interface NearestCheckInPointInfoProps {
  currentPos: { latitude: number; longitude: number } | null;
  checkInPoints?: Array<{
    name: string;
    distance?: number;
    check_in_radius?: number;
  }>;
}

const NearestCheckInPointInfo: React.FC<NearestCheckInPointInfoProps> = ({
  currentPos,
  checkInPoints: propsCheckInPoints,
}) => {
  const storeCheckInPoints = useCheckInPointStore(state => state.checkInPoints);
  const checkInPoints = propsCheckInPoints ?? storeCheckInPoints;

  if (!currentPos)
    return (
      <div className="flex items-center text-blue-700 bg-blue-100 rounded-lg px-3 py-2 mb-2">
        <Info className="w-4 h-4 mr-2 text-blue-500" />
        <span>正在取得最近的打卡點...</span>
      </div>
    );
  if (!checkInPoints || checkInPoints.length === 0)
    return (
      <div className="flex items-center text-blue-700 bg-blue-100 rounded-lg px-3 py-2 mb-2">
        <Info className="w-4 h-4 mr-2 text-blue-500" />
        <span>無可用打卡點</span>
      </div>
    );

  // 直接取 distance 最小的點
  const nearestPoint = checkInPoints.reduce((prev, curr) =>
    (prev.distance ?? Infinity) < (curr.distance ?? Infinity) ? prev : curr
  );
  const inRange = (nearestPoint.distance ?? Infinity) <= (nearestPoint.check_in_radius ?? 0);

  return (
    <div className="text-sm text-blue-700 bg-blue-50 rounded-lg px-3 py-2 mb-2">
      {inRange ? (
        <>
          目前在打卡點：<b>{nearestPoint.name}</b>
        </>
      ) : (
        <>
          距離最近的打卡點：<b>{nearestPoint.name}</b>，距離約{' '}
          <b>{Math.round(nearestPoint.distance ?? 0)}</b> 公尺
        </>
      )}
    </div>
  );
};

export default NearestCheckInPointInfo;
