import { Badge } from '@/components/ui/badge';
import { CheckInRecord } from '@/types';
import dayjs from 'dayjs';
import { CheckCircle2 } from 'lucide-react';
import React from 'react';

interface CheckInStatusProps {
  checkIn?: CheckInRecord;
}

const CheckInStatus: React.FC<CheckInStatusProps> = ({ checkIn }) => {
  if (!checkIn) return null;

  return (
    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
      <div className="flex items-center justify-center space-x-2 text-blue-800">
        <CheckCircle2 className="h-4 w-4" />
        <span className="font-medium">已上班打卡</span>
        <Badge variant="secondary" className="text-xs">
          {dayjs(checkIn.created_at).format('HH:mm:ss')}
        </Badge>
      </div>
    </div>
  );
};

export default CheckInStatus;
