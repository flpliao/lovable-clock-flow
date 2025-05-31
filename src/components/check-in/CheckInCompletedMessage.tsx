
import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CheckInCompletedMessage: React.FC = () => {
  const navigate = useNavigate();

  const handleViewAttendance = () => {
    navigate('/personal-attendance');
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4">
      <div className="bg-green-50 rounded-3xl p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">打卡完成</h3>
          <p className="text-green-600 text-sm">您已完成今日的上班與下班打卡</p>
        </div>
        
        <button
          onClick={handleViewAttendance}
          className="w-full bg-white text-green-700 py-3 px-6 rounded-2xl font-medium shadow-sm hover:shadow-md transition-shadow flex items-center justify-center"
        >
          <Clock className="h-4 w-4 mr-2" />
          查看個人出勤
        </button>
      </div>
    </div>
  );
};

export default CheckInCompletedMessage;
