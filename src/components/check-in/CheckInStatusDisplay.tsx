
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
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto z-10 mb-6 w-full">
      <h2 className="text-xl font-bold text-center mb-4">今日打卡紀錄</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {/* Check-in record display */}
        <div className={`p-4 rounded-lg ${todayRecords.checkIn ? 'bg-green-50' : 'bg-gray-100'}`}>
          <div className="flex items-center mb-2">
            <LogIn className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-medium">上班打卡</h3>
          </div>
          
          {todayRecords.checkIn ? (
            <>
              <p className="text-lg font-medium">
                {formatTime(todayRecords.checkIn.timestamp)}
              </p>
              <p className="text-sm text-gray-500">
                {formatDate(todayRecords.checkIn.timestamp)}
              </p>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                {todayRecords.checkIn.type === 'location' ? (
                  <>
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{todayRecords.checkIn.details.locationName}</span>
                  </>
                ) : (
                  <>
                    <Wifi className="h-4 w-4 mr-1" />
                    <span>{todayRecords.checkIn.details.locationName}</span>
                  </>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">尚未打卡</p>
          )}
        </div>
        
        {/* Check-out record display */}
        <div className={`p-4 rounded-lg ${todayRecords.checkOut ? 'bg-blue-50' : 'bg-gray-100'}`}>
          <div className="flex items-center mb-2">
            <LogOut className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium">下班打卡</h3>
          </div>
          
          {todayRecords.checkOut ? (
            <>
              <p className="text-lg font-medium">
                {formatTime(todayRecords.checkOut.timestamp)}
              </p>
              <p className="text-sm text-gray-500">
                {formatDate(todayRecords.checkOut.timestamp)}
              </p>
              <div className="flex items-center mt-2 text-sm text-gray-600">
                {todayRecords.checkOut.type === 'location' ? (
                  <>
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{todayRecords.checkOut.details.locationName}</span>
                  </>
                ) : (
                  <>
                    <Wifi className="h-4 w-4 mr-1" />
                    <span>{todayRecords.checkOut.details.locationName}</span>
                  </>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">尚未打卡</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckInStatusDisplay;
