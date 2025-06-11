
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const AttendancePageHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl mx-4 shadow-xl mb-6">
      <div className="flex items-center gap-2 p-6">
        <button 
          onClick={() => navigate('/')}
          className="text-white hover:text-white/80 backdrop-blur-xl bg-white/30 border-white/40 hover:bg-white/50 p-2 rounded-xl shadow-lg transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-white drop-shadow-md">個人出勤</h1>
      </div>
    </div>
  );
};

export default AttendancePageHeader;
