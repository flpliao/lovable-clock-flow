
import React from 'react';
import { MapPin, Wifi, LogIn, LogOut } from 'lucide-react';
import { CheckInRecord } from '@/types';
import { formatTime, formatDate } from '@/utils/checkInUtils';

interface CheckInStatusDisplayProps {
  todayRecords: {
    checkIn?: CheckInRecord;
    checkOut?: CheckInRecord;
  }
}

const CheckInStatusDisplay: React.FC<CheckInStatusDisplayProps> = ({ todayRecords }) => {
  if (!todayRecords.checkIn && !todayRecords.checkOut) {
    return null;
  }

  return (
    <div className="w-full max-w-sm mx-auto mb-8 px-4">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-800">今日打卡紀錄</h2>
      
      <div className="space-y-4">
        {/* Check-in record */}
        <div className={`p-4 rounded-2xl ${todayRecords.checkIn ? 'bg-green-50' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${todayRecords.checkIn ? 'bg-green-100' : 'bg-gray-100'} mr-3`}>
                <LogIn className={`h-4 w-4 ${todayRecords.checkIn ? 'text-green-600' : 'text-gray-400'}`} />
              </div>
              <span className="font-medium text-gray-800">上班打卡</span>
            </div>
            {todayRecords.checkIn && (
              <div className="flex items-center text-xs text-gray-500">
                {todayRecords.checkIn.type === 'location' ? (
                  <MapPin className="h-3 w-3 mr-1" />
                ) : (
                  <Wifi className="h-3 w-3 mr-1" />
                )}
              </div>
            )}
          </div>
          
          {todayRecords.checkIn ? (
            <div>
              <p className="text-lg font-bold text-gray-900 mb-1">
                {formatTime(todayRecords.checkIn.timestamp)}
              </p>
              <p className="text-xs text-gray-500 mb-1">
                {formatDate(todayRecords.checkIn.timestamp)}
              </p>
              <p className="text-xs text-gray-600">
                {todayRecords.checkIn.details.locationName}
              </p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">尚未打卡</p>
          )}
        </div>
        
        {/* Check-out record */}
        <div className={`p-4 rounded-2xl ${todayRecords.checkOut ? 'bg-blue-50' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${todayRecords.checkOut ? 'bg-blue-100' : 'bg-gray-100'} mr-3`}>
                <LogOut className={`h-4 w-4 ${todayRecords.checkOut ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              <span className="font-medium text-gray-800">下班打卡</span>
            </div>
            {todayRecords.checkOut && (
              <div className="flex items-center text-xs text-gray-500">
                {todayRecords.checkOut.type === 'location' ? (
                  <MapPin className="h-3 w-3 mr-1" />
                ) : (
                  <Wifi className="h-3 w-3 mr-1" />
                )}
              </div>
            )}
          </div>
          
          {todayRecords.checkOut ? (
            <div>
              <p className="text-lg font-bold text-gray-900 mb-1">
                {formatTime(todayRecords.checkOut.timestamp)}
              </p>
              <p className="text-xs text-gray-500 mb-1">
                {formatDate(todayRecords.checkOut.timestamp)}
              </p>
              <p className="text-xs text-gray-600">
                {todayRecords.checkOut.details.locationName}
              </p>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">尚未打卡</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInStatusDisplay;
