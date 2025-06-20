import React from 'react';
import { Clock, Calendar, User } from 'lucide-react';
const AttendanceWelcomeHeader: React.FC = () => {
  return <div className="space-y-6">
      {/* 主標題 */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-lg">
            <User className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
          個人考勤管理
        </h1>
        <p className="text-white/80 text-lg font-medium drop-shadow-md">
          查看您的打卡記錄和考勤統計
        </p>
      </div>
      
      {/* 時間和日期卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        
        
      </div>
    </div>;
};
export default AttendanceWelcomeHeader;