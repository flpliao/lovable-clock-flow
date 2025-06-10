
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';

const AttendanceLoginPrompt: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-8 text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/30 shadow-lg">
          <User className="h-8 w-8 text-white" />
        </div>
        <p className="text-lg font-medium text-white drop-shadow-lg mb-4">請先登入</p>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-white/30 backdrop-blur-xl text-white rounded-2xl border border-white/40 hover:bg-white/40 transition-all duration-300 shadow-lg font-medium"
        >
          前往登入
        </button>
      </div>
    </div>
  );
};

export default AttendanceLoginPrompt;
