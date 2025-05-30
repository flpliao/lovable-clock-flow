
import React from 'react';
import { format } from 'date-fns';
import { CheckInRecord } from '@/types';
import { formatTime } from '@/utils/checkInUtils';

interface DateRecordDetailsProps {
  date: Date;
  selectedDateRecords: {
    checkIn?: CheckInRecord;
    checkOut?: CheckInRecord;
  };
  recordsCount: number;
}

const DateRecordDetails: React.FC<DateRecordDetailsProps> = ({
  date,
  selectedDateRecords,
  recordsCount
}) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-medium text-lg mb-4">
        {format(date, 'yyyy年MM月dd日')} 出勤記錄
      </h3>
      
      <div className="mb-2 text-sm text-gray-500">
        打卡記錄總數: {recordsCount}
      </div>
      
      {selectedDateRecords.checkIn || selectedDateRecords.checkOut ? (
        <div className="space-y-3">
          {selectedDateRecords.checkIn && (
            <div className="text-gray-700">
              <p className="flex justify-between">
                <span>上班時間:</span>
                <span className="font-medium text-green-600">
                  {formatTime(selectedDateRecords.checkIn.timestamp)}
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {selectedDateRecords.checkIn.type === 'location' 
                  ? `位置打卡 - ${selectedDateRecords.checkIn.details.locationName}` 
                  : `IP打卡 - ${selectedDateRecords.checkIn.details.ip}`
                }
              </p>
            </div>
          )}
          
          {selectedDateRecords.checkOut && (
            <div className="text-gray-700">
              <p className="flex justify-between">
                <span>下班時間:</span>
                <span className="font-medium text-blue-600">
                  {formatTime(selectedDateRecords.checkOut.timestamp)}
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {selectedDateRecords.checkOut.type === 'location' 
                  ? `位置打卡 - ${selectedDateRecords.checkOut.details.locationName}` 
                  : `IP打卡 - ${selectedDateRecords.checkOut.details.ip}`
                }
              </p>
            </div>
          )}
          
          <div className="pt-2 border-t">
            <p className="flex justify-between">
              <span>狀態:</span>
              <span className="font-medium text-green-600">
                {selectedDateRecords.checkIn && selectedDateRecords.checkOut 
                  ? '正常' 
                  : selectedDateRecords.checkIn 
                    ? '未打下班卡' 
                    : '僅下班打卡'
                }
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 text-center py-8">
          <p>此日期無打卡記錄</p>
          <p className="text-sm mt-1">選擇的日期: {format(date, 'yyyy-MM-dd')}</p>
        </div>
      )}
    </div>
  );
};

export default DateRecordDetails;
