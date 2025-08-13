import { CheckInMethod } from '@/constants/checkInTypes';
import { CheckInRecord } from '@/types';
import dayjs from 'dayjs';
import { CheckCircle2, Clock, MapPin, Wifi } from 'lucide-react';
import React from 'react';

interface CheckInStatusProps {
  checkIn?: CheckInRecord;
  hasMissedCheckIn?: boolean;
}

const CheckInStatus: React.FC<CheckInStatusProps> = ({ checkIn, hasMissedCheckIn }) => {
  if (!checkIn && !hasMissedCheckIn) return null;

  // 如果有實際打卡記錄，顯示打卡狀態
  if (checkIn) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200 shadow-sm">
        <div className="flex items-center justify-between w-full gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="bg-blue-100 p-1.5 rounded-full shrink-0">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex items-center gap-2 truncate text-sm">
              <span className="font-medium text-blue-900">已打上班卡</span>
              {checkIn.method === CheckInMethod.LOCATION && checkIn.location_name ? (
                <>
                  <div className="flex items-center gap-1 text-sm text-blue-600 truncate">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-medium truncate">{checkIn.location_name}</span>
                  </div>
                </>
              ) : (
                checkIn.method === CheckInMethod.IP && (
                  <>
                    <div className="flex items-center gap-1 text-sm text-blue-600">
                      <Wifi className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-medium">IP打卡</span>
                    </div>
                  </>
                )
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-full shrink-0">
            <Clock className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-xs text-blue-600 font-medium">
              {dayjs(checkIn.created_at).format('HH:mm:ss')}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 如果有忘記打卡申請，顯示申請狀態
  if (hasMissedCheckIn) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200 shadow-sm">
        <div className="flex items-center justify-between w-full gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="bg-orange-100 p-1.5 rounded-full shrink-0">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex items-center gap-2 truncate text-sm">
              <span className="font-medium text-orange-900">上班打卡申請中</span>
              <div className="flex items-center gap-1 text-sm text-orange-600">
                <span className="font-medium">等待審核</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-full shrink-0">
            <Clock className="h-3.5 w-3.5 text-orange-500" />
            <span className="text-xs text-orange-600 font-medium">申請中</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CheckInStatus;
