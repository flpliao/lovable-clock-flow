import { CheckInRecord } from '@/types';
import { formatTime } from '@/utils/checkInUtils';
import { format, isFuture, isWeekend } from 'date-fns';
import React from 'react';

interface DateRecordDetailsProps {
  date: Date;
  selectedDateRecords: {
    checkIn?: CheckInRecord;
    checkOut?: CheckInRecord;
  };
  recordsCount: number;
  isInDialog?: boolean;
}

const DateRecordDetails: React.FC<DateRecordDetailsProps> = ({
  date,
  selectedDateRecords,
  recordsCount,
  isInDialog = false,
}) => {
  const textClass = isInDialog ? 'text-gray-900' : 'text-white';
  const subTextClass = isInDialog ? 'text-gray-600' : 'text-white/70';
  const borderClass = isInDialog ? 'border-gray-200' : 'border-white/20';

  // 判斷日期狀態
  const isWeekendDay = isWeekend(date);
  const isFutureDay = isFuture(date);
  const hasCheckIn = !!selectedDateRecords.checkIn;
  const hasCheckOut = !!selectedDateRecords.checkOut;

  // 獲取未打卡原因
  const getAttendanceStatus = () => {
    if (isFutureDay) {
      return { status: '未來日期', reason: '此日期尚未到來' };
    }

    if (isWeekendDay) {
      return { status: '週末', reason: '非工作日' };
    }

    if (hasCheckIn && hasCheckOut) {
      return { status: '正常', reason: '打卡完整' };
    }

    if (hasCheckIn && !hasCheckOut) {
      return { status: '未打下班卡', reason: '缺少下班打卡記錄' };
    }

    if (!hasCheckIn && hasCheckOut) {
      return { status: '未打上班卡', reason: '缺少上班打卡記錄' };
    }

    // 工作日但沒有任何打卡記錄
    return { status: '未打卡', reason: '此工作日沒有任何打卡記錄' };
  };

  const attendanceStatus = getAttendanceStatus();

  return (
    <div>
      <h3 className={`font-medium text-lg mb-4 ${textClass}`}>
        {format(date, 'yyyy年MM月dd日')} 出勤記錄
      </h3>

      <div className={`mb-4 text-sm ${subTextClass}`}>打卡記錄總數: {recordsCount}</div>

      {selectedDateRecords.checkIn || selectedDateRecords.checkOut ? (
        <div className="space-y-4">
          {selectedDateRecords.checkIn && (
            <div className={textClass}>
              <p className="flex justify-between">
                <span>上班時間:</span>
                <span className="font-medium text-green-600">
                  {formatTime(selectedDateRecords.checkIn.timestamp)}
                </span>
              </p>
              <p className={`text-sm ${subTextClass} mt-1`}>
                {selectedDateRecords.checkIn.type === 'location'
                  ? `位置打卡 - ${selectedDateRecords.checkIn.details.locationName}`
                  : `IP打卡 - ${selectedDateRecords.checkIn.details.ip}`}
              </p>
            </div>
          )}

          {selectedDateRecords.checkOut && (
            <div className={textClass}>
              <p className="flex justify-between">
                <span>下班時間:</span>
                <span className="font-medium text-blue-600">
                  {formatTime(selectedDateRecords.checkOut.timestamp)}
                </span>
              </p>
              <p className={`text-sm ${subTextClass} mt-1`}>
                {selectedDateRecords.checkOut.type === 'location'
                  ? `位置打卡 - ${selectedDateRecords.checkOut.details.locationName}`
                  : `IP打卡 - ${selectedDateRecords.checkOut.details.ip}`}
              </p>
            </div>
          )}

          <div className={`pt-3 border-t ${borderClass}`}>
            <p className={`flex justify-between ${textClass}`}>
              <span>狀態:</span>
              <span className={`font-medium ${textClass}`}>{attendanceStatus.status}</span>
            </p>
            <p className={`text-sm ${subTextClass} mt-1`}>{attendanceStatus.reason}</p>
          </div>
        </div>
      ) : (
        <div className={`text-center py-8`}>
          <div className={`mb-4 ${textClass}`}>
            <p className={`font-medium ${textClass}`}>{attendanceStatus.status}</p>
            <p className={`text-sm ${subTextClass} mt-2`}>{attendanceStatus.reason}</p>
          </div>
          <p className={`text-sm ${subTextClass}`}>選擇的日期: {format(date, 'yyyy-MM-dd')}</p>
        </div>
      )}
    </div>
  );
};

export default DateRecordDetails;
