
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const OvertimeHistoryPage: React.FC = () => {
  const navigate = useNavigate();

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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            加班功能已移除
          </h2>
          <p className="text-gray-600 mb-6">
            加班記錄查詢功能已從系統中移除。如需其他功能，請返回主頁面。
          </p>
          <Button onClick={() => navigate('/')} className="bg-blue-500 hover:bg-blue-600">
            返回首頁
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OvertimeHistoryPage;
