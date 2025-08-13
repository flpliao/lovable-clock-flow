import { Card, CardContent } from '@/components/ui/card';
import { CheckInMethod } from '@/constants/checkInTypes';
import { CheckInRecord } from '@/types';
import dayjs from 'dayjs';
import { CheckCircle2, LogIn, LogOut, MapPin, Wifi } from 'lucide-react';
import React from 'react';

interface CheckInCompletedStatusProps {
  checkIn?: CheckInRecord;
  checkOut?: CheckInRecord;
  hasMissedCheckIn?: boolean;
  hasMissedCheckOut?: boolean;
}

const CheckInCompletedStatus: React.FC<CheckInCompletedStatusProps> = ({
  checkIn,
  checkOut,
  hasMissedCheckIn,
  hasMissedCheckOut,
}) => {
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

  const renderCheckInStatus = (
    record: CheckInRecord | undefined,
    hasMissed: boolean,
    type: '上班' | '下班'
  ) => {
    if (record) {
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
    } else if (hasMissed) {
      return (
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
          <div className="flex items-center justify-center mb-2">
            {type === '上班' ? (
              <LogIn className="h-4 w-4 text-orange-600 mr-1" />
            ) : (
              <LogOut className="h-4 w-4 text-orange-600 mr-1" />
            )}
            <span className="font-medium">{type}</span>
          </div>
          <div className="text-center space-y-1.5">
            <div className="font-mono text-lg text-orange-800">申請中</div>
            <div className="flex items-center justify-center gap-1 text-orange-600 text-xs">
              <span>等待審核</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600 mr-2" />
            <span className="text-lg font-semibold text-green-800">今日打卡已完成</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {renderCheckInStatus(checkIn, hasMissedCheckIn || false, '上班')}
            {renderCheckInStatus(checkOut, hasMissedCheckOut || false, '下班')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckInCompletedStatus;
