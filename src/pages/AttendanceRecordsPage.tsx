import AttendanceRecordManagement from '@/components/AttendanceRecordManagement';
import { Clock } from 'lucide-react';
import React from 'react';

const AttendanceRecordsPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>

      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div
        className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse"
        style={{ animationDelay: '2s' }}
      ></div>
      <div
        className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse"
        style={{ animationDelay: '4s' }}
      ></div>
      <div
        className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse"
        style={{ animationDelay: '6s' }}
      ></div>

      {/* 內容容器 */}
      <div className="relative z-10 container mx-auto px-4 py-8 space-y-6">
        {/* 頁面標題 */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/70 rounded-xl shadow-lg backdrop-blur-xl">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-md">打卡紀錄</h1>
            <p className="text-white/80 drop-shadow-md">查看和管理員工打卡記錄，分析出勤異常</p>
          </div>
        </div>

        {/* 打卡紀錄管理組件 */}
        <AttendanceRecordManagement />
      </div>
    </div>
  );
};

export default AttendanceRecordsPage;
