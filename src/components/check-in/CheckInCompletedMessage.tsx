
import React from 'react';
import { Clock } from 'lucide-react';

const CheckInCompletedMessage: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto z-10 text-center">
      <Clock className="h-12 w-12 text-green-500 mx-auto mb-2" />
      <h2 className="text-xl font-bold">今日打卡完成</h2>
      <p className="text-gray-600 mt-2">您已完成今日的上班與下班打卡</p>
    </div>
  );
};

export default CheckInCompletedMessage;
