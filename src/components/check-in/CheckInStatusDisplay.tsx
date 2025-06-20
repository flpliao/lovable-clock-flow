
import React from 'react';
import { MapPin, Wifi, AlertCircle } from 'lucide-react';

interface CheckInStatusDisplayProps {
  checkInMethod: 'location' | 'ip';
  distance: number | null;
  error: string | null;
  loading: boolean;
  locationName: string;
}

const CheckInStatusDisplay: React.FC<CheckInStatusDisplayProps> = ({
  checkInMethod,
  distance,
  error,
  loading,
  locationName
}) => {
  return (
    <>
      {/* 狀態資訊 */}
      {distance !== null && !error && checkInMethod === 'location' && (
        <div className="text-center text-sm text-white/80 drop-shadow-md">
          <MapPin className="inline h-4 w-4 mr-1" />
          距離{locationName}: <span className="font-medium">{Math.round(distance)} 公尺</span>
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
    </>
  );
};

export default CheckInStatusDisplay;
