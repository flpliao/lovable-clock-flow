
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, LogIn, LogOut } from 'lucide-react';
import { CheckInRecord } from '@/types';
import { formatTime } from '@/utils/checkInUtils';

interface CheckInCompletedStatusProps {
  checkIn: CheckInRecord;
  checkOut: CheckInRecord;
}

const CheckInCompletedStatus: React.FC<CheckInCompletedStatusProps> = ({
  checkIn,
  checkOut
}) => {
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
              <div className="flex items-center justify-center mb-1">
                <LogIn className="h-4 w-4 text-green-600 mr-1" />
                <span className="font-medium">上班</span>
              </div>
              <div className="text-center">
                <div className="font-mono text-lg text-green-800">
                  {formatTime(checkIn.timestamp)}
                </div>
                <div className="text-green-600 text-xs mt-1">
                  {checkIn.type === 'location' ? '位置打卡' : 'IP打卡'}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <div className="flex items-center justify-center mb-1">
                <LogOut className="h-4 w-4 text-green-600 mr-1" />
                <span className="font-medium">下班</span>
              </div>
              <div className="text-center">
                <div className="font-mono text-lg text-green-800">
                  {formatTime(checkOut.timestamp)}
                </div>
                <div className="text-green-600 text-xs mt-1">
                  {checkOut.type === 'location' ? '位置打卡' : 'IP打卡'}
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
