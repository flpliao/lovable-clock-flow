import { Card, CardContent } from '@/components/ui/card';
import { CheckInRecord } from '@/types';
import React from 'react';
import CheckInStatusCard from './CheckInStatusCard';

interface CheckInCompletedStatusProps {
  checkIn?: CheckInRecord;
  checkOut?: CheckInRecord;
}

const CheckInCompletedStatus: React.FC<CheckInCompletedStatusProps> = ({ checkIn, checkOut }) => {
  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center">
            <span className="text-lg font-semibold text-green-800">今日打卡已完成</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <CheckInStatusCard record={checkIn} type="上班" />
            <CheckInStatusCard record={checkOut} type="下班" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CheckInCompletedStatus;
