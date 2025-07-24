import { METHOD_IP, METHOD_LOCATION } from '@/constants/checkInTypes';
import { CheckInRecord } from '@/types';
import dayjs from 'dayjs';
import { CheckCircle2, Clock, MapPin, Wifi } from 'lucide-react';
import React from 'react';

interface CheckInStatusProps {
  checkIn?: CheckInRecord;
}

const CheckInStatus: React.FC<CheckInStatusProps> = ({ checkIn }) => {
  if (!checkIn) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200 shadow-sm">
      <div className="flex items-center justify-between w-full gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="bg-blue-100 p-1.5 rounded-full shrink-0">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex items-center gap-2 truncate">
            <span className="font-medium text-blue-900">已打上班卡</span>
            {checkIn.method === METHOD_LOCATION && checkIn.location_name ? (
              <>
                <div className="flex items-center gap-1 text-sm text-blue-600 truncate">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="font-medium truncate">{checkIn.location_name}</span>
                </div>
              </>
            ) : (
              checkIn.method === METHOD_IP && (
                <>
                  <span className="text-blue-400">·</span>
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
};

export default CheckInStatus;
