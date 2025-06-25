
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock } from 'lucide-react';

const OvertimeManagement: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToOvertimeRequest = () => {
    navigate('/overtime-request');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
        </div>
        
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-8 text-center">
          <Clock className="h-16 w-16 mx-auto mb-4 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            加班管理
          </h2>
          <p className="text-gray-600 mb-6">
            加班管理功能已重新啟用。請點擊下方按鈕進入加班申請頁面。
          </p>
          <div className="space-y-3">
            <Button onClick={handleGoToOvertimeRequest} className="bg-blue-500 hover:bg-blue-600 w-full">
              <Clock className="h-4 w-4 mr-2" />
              進入加班申請
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              返回首頁
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OvertimeManagement;
