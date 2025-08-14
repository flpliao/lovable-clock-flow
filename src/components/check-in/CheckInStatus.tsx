import { ApprovalStatus } from '@/constants/approvalStatus';
import { CheckInMethod, CheckInSource } from '@/constants/checkInTypes';
import { CheckInRecord } from '@/types';
import { getStatusConfig } from '@/utils/statusConfig';
import dayjs from 'dayjs';
import { AlertCircle, CheckCircle2, Clock, MapPin, Wifi } from 'lucide-react';
import React from 'react';

interface CheckInStatusProps {
  checkIn?: CheckInRecord;
}

const CheckInStatus: React.FC<CheckInStatusProps> = ({ checkIn }) => {
  // 如果沒有打卡記錄且沒有忘記打卡申請，不顯示任何內容
  if (!checkIn) return null;

  // 如果有實際打卡記錄，顯示打卡狀態
  if (checkIn.source === CheckInSource.NORMAL) {
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
  } else {
    // 如果有忘記打卡申請，根據狀態顯示不同內容
    const status = (checkIn?.approval_status as ApprovalStatus) || ApprovalStatus.PENDING;
    const statusConfig = getStatusConfig(status);

    return (
      <div
        className={`bg-gradient-to-br ${statusConfig.bgGradient} rounded-lg p-3 border ${statusConfig.borderColor} shadow-sm`}
      >
        <div className="flex items-center justify-between w-full gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`${statusConfig.iconBg} p-1.5 rounded-full shrink-0`}>
              {status === ApprovalStatus.PENDING ? (
                <AlertCircle className={`h-5 w-5 ${statusConfig.iconColor}`} />
              ) : (
                <CheckCircle2 className={`h-5 w-5 ${statusConfig.iconColor}`} />
              )}
            </div>
            <div className="flex items-center gap-2 truncate text-sm">
              <span className={`font-medium ${statusConfig.textColor}`}>忘打卡申請</span>
              <div className={`flex items-center gap-1 text-sm ${statusConfig.secondaryTextColor}`}>
                <span className="font-medium">{statusConfig.statusText}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/80 px-2.5 py-1 rounded-full shrink-0">
            <Clock className={`h-3.5 w-3.5 ${statusConfig.iconColor}`} />
            <span className={`text-xs ${statusConfig.secondaryTextColor} font-medium`}>
              {dayjs(checkIn.created_at).format('HH:mm:ss')}
            </span>
          </div>
        </div>
      </div>
    );
  }
};

export default CheckInStatus;
