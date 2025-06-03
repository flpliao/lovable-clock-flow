
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { CheckInRecord } from '@/types';
import { formatTime } from '@/utils/checkInUtils';

interface CheckInStatusInfoProps {
  checkIn?: CheckInRecord;
  checkOut?: CheckInRecord;
}

const CheckInStatusInfo: React.FC<CheckInStatusInfoProps> = ({
  checkIn,
  checkOut
}) => {
  if (!checkIn || checkOut) return null;

  return (
    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
      <div className="flex items-center justify-center space-x-2 text-blue-800">
        <CheckCircle2 className="h-4 w-4" />
        <span className="font-medium">已上班打卡</span>
        <Badge variant="secondary" className="text-xs">
          {formatTime(checkIn.timestamp)}
        </Badge>
      </div>
    </div>
  );
};

export default CheckInStatusInfo;
