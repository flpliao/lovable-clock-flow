import { CalendarList } from '@/pages/calendar/CalendarList';
import { Calendar } from 'lucide-react';

const HolidayManagement = () => {
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

      <div className="relative z-10 w-full">
        {/* 頁面標題區域 */}
        <div className="w-full px-4 lg:px-8 pt-32 md:pt-36 pb-8 py-[50px]">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-lg">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">假日行事曆</h1>
              <p className="text-white/80 text-lg font-medium drop-shadow-md">
                管理法定假日與工作日設定
              </p>
            </div>
          </div>
        </div>

        {/* 主要內容 */}
        <div className="w-full px-4 lg:px-8 pb-8">
          <CalendarList />
        </div>
      </div>
    </div>
  );
};
export default HolidayManagement;
