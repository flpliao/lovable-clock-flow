
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const AttendancePageHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2 mb-4">
      <button 
        onClick={() => navigate('/')}
        className="text-gray-500 hover:text-gray-700"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      <h1 className="text-3xl font-bold text-gray-800">個人出勤</h1>
    </div>
  );
};

export default AttendancePageHeader;
