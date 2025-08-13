import { Card, CardContent } from '@/components/ui/card';
import { CheckInMethod } from '@/constants/checkInTypes';
import { CheckInRecord } from '@/types';
import dayjs from 'dayjs';
import { CheckCircle2, LogIn, LogOut, MapPin, Wifi } from 'lucide-react';
import React from 'react';

interface CheckInCompletedStatusProps {
  checkIn: CheckInRecord;
  checkOut: CheckInRecord;
}

const CheckInCompletedStatus: React.FC<CheckInCompletedStatusProps> = ({ checkIn, checkOut }) => {
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
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600 mr-2" />
            <span className="text-lg font-semibold text-green-800">今日打卡已完成</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <div className="flex items-center justify-center mb-2">
                <LogIn className="h-4 w-4 text-green-600 mr-1" />
                <span className="font-medium">上班</span>
              </div>
              <div className="text-center space-y-1.5">
                <div className="font-mono text-lg text-green-800">
                  {dayjs(checkIn.created_at).format('HH:mm:ss')}
                </div>
                <div className="flex items-center justify-center gap-1 text-green-600 text-xs">
                  {renderCheckInMethod(checkIn)}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 border border-green-200">
              <div className="flex items-center justify-center mb-2">
                <LogOut className="h-4 w-4 text-green-600 mr-1" />
                <span className="font-medium">下班</span>
              </div>
              <div className="text-center space-y-1.5">
                <div className="font-mono text-lg text-green-800">
                  {dayjs(checkOut.created_at).format('HH:mm:ss')}
                </div>
                <div className="flex items-center justify-center gap-1 text-green-600 text-xs">
                  {renderCheckInMethod(checkOut)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckInCompletedStatus;
