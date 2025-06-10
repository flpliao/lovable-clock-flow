
import React from 'react';
import { ArrowLeft, Megaphone, Bell, FileText, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AnnouncementList from '@/components/announcements/AnnouncementList';

const CompanyAnnouncements: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen pt-20 md:pt-24">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header with glass effect - 與其他頁面一致 */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl mx-4 mt-4 mb-8 sticky top-24 z-20 shadow-xl">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="p-3 md:hidden backdrop-blur-xl bg-white/30 border-white/40 text-gray-800 hover:bg-white/50 shadow-lg rounded-xl"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50 text-white">
                  <Megaphone className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">公司公告</h1>
                  <p className="text-sm text-white/80 font-medium drop-shadow-sm hidden sm:block">查看公司最新公告與通知</p>
                </div>
              </div>
            </div>
            
            {/* 統計卡片區域 */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-4 min-w-[120px]">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-500/80 rounded-lg shadow-lg backdrop-blur-xl border border-green-400/50 text-white">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70 font-medium">最新公告</p>
                    <p className="text-lg font-bold text-white">5</p>
                  </div>
                </div>
              </div>
              
              <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-4 min-w-[120px]">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-500/80 rounded-lg shadow-lg backdrop-blur-xl border border-purple-400/50 text-white">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70 font-medium">總公告數</p>
                    <p className="text-lg font-bold text-white">24</p>
                  </div>
                </div>
              </div>
              
              <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-4 min-w-[120px]">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-orange-500/80 rounded-lg shadow-lg backdrop-blur-xl border border-orange-400/50 text-white">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-white/70 font-medium">閱讀率</p>
                    <p className="text-lg font-bold text-white">85%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8">
          <AnnouncementList />
        </main>
      </div>
    </div>
  );
};

export default CompanyAnnouncements;
