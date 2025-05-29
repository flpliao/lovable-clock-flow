
import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CheckInCompletedMessage: React.FC = () => {
  const navigate = useNavigate();

  const handleViewAttendance = () => {
    navigate('/personal-attendance');
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center mt-6 relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleViewAttendance}
        className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-green-100"
        title="查看個人出勤"
      >
        <Clock className="h-4 w-4 text-green-600" />
      </Button>
      
      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-green-800 mb-2">今日打卡完成</h3>
      <p className="text-green-600">您已完成今日的上班與下班打卡</p>
    </div>
  );
};

export default CheckInCompletedMessage;
