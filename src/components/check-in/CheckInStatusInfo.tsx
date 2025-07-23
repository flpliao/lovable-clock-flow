import { Badge } from '@/components/ui/badge';
import { CHECK_IN } from '@/constants/checkInTypes';
import { CheckInRecord } from '@/types';
import dayjs from 'dayjs';
import { CheckCircle2 } from 'lucide-react';
import React from 'react';

interface CheckInStatusInfoProps {
  checkIn?: CheckInRecord;
}

const CheckInStatusInfo: React.FC<CheckInStatusInfoProps> = ({ checkIn }) => {
  if (!checkIn || checkIn.type !== CHECK_IN) return null;

  return (
    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
      <div className="flex items-center justify-center space-x-2 text-blue-800">
        <CheckCircle2 className="h-4 w-4" />
        <span className="font-medium">已上班打卡</span>
        <Badge variant="secondary" className="text-xs">
          {dayjs(checkIn.created_at).format('YYYY-MM-DD HH:mm:ss')}
        </Badge>
      </div>
    </div>
  );
};

export default CheckInStatusInfo;
