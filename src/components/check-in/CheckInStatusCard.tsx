import { CheckInMethod } from '@/constants/checkInTypes';
import { CheckInRecord } from '@/types';
import { MissedCheckInRequest } from '@/types/missedCheckInRequest';
import dayjs from 'dayjs';
import { LogIn, LogOut, MapPin, Wifi } from 'lucide-react';
import React from 'react';
import MissedCheckInStatusCard from './MissedCheckInStatusCard';

interface CheckInStatusCardProps {
  record: CheckInRecord | MissedCheckInRequest | undefined;
  type: '上班' | '下班';
}

const CheckInStatusCard: React.FC<CheckInStatusCardProps> = ({ record, type }) => {
  if (!record) {
    return null;
  }

  // 使用類型守衛來判斷是打卡記錄還是忘記打卡申請
  if ('status' in record) {
    return <MissedCheckInStatusCard missedRequest={record as MissedCheckInRequest} type={type} />;
  }

  const renderCheckInMethod = (record: CheckInRecord) => {
    if (record.method === CheckInMethod.LOCATION) {
      return (
        <>
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate max-w-[120px]">{record.location_name || '位置打卡'}</span>
        </>
      );
    }
    return (
      <>
        <Wifi className="h-3 w-3 shrink-0" />
        <span>IP打卡</span>
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg p-3 border border-green-200">
      <div className="flex items-center justify-center mb-2">
        {type === '上班' ? (
          <LogIn className="h-4 w-4 text-green-600 mr-1" />
        ) : (
          <LogOut className="h-4 w-4 text-green-600 mr-1" />
        )}
        <span className="font-medium">{type}</span>
      </div>
      <div className="text-center space-y-1.5">
        <div className="font-mono text-lg text-green-800">
          {dayjs(record.created_at).format('HH:mm:ss')}
        </div>
        <div className="flex items-center justify-center gap-1 text-green-600 text-xs">
          {renderCheckInMethod(record)}
        </div>
      </div>
    </div>
  );
};

export default CheckInStatusCard;
