
import React from 'react';
import { ArrowLeft, Megaphone, Bell, FileText, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AnnouncementList from '@/components/announcements/AnnouncementList';
import { visionProStyles, createDashboardBackground } from '@/utils/visionProStyles';

const CompanyAnnouncements: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={`${createDashboardBackground()} min-h-screen pb-safe relative overflow-hidden`}>
      {/* 多層漸變背景效果 - 基於參考圖片的淡藍色調 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/40 via-blue-300/30 to-blue-200/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-300/25 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_center,_var(--tw-gradient-stops))] from-blue-200/15 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 - 增加層次感 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-300/40 rounded-full animate-float shadow-lg"></div>
      <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-blue-400/30 rounded-full animate-float shadow-md" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/30 rounded-full animate-float shadow-sm" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/35 rounded-full animate-float shadow-md" style={{ animationDelay: '6s' }}></div>

      <div className="relative z-10">
        {/* Header with glass effect - 類似參考圖片的頂部控制欄 */}
        <div className={`${visionProStyles.topControlBar} mx-4 mt-4 mb-8 sticky top-4 z-20 shadow-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className={`p-3 md:hidden ${visionProStyles.glassButton} border-white/50 text-gray-800 hover:bg-white/40 shadow-lg`}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className={visionProStyles.coloredIconContainer.blue}>
                  <Megaphone className="h-6 w-6" />
                </div>
                <div>
                  <h1 className={`text-xl sm:text-2xl font-bold ${visionProStyles.primaryText}`}>公司公告</h1>
                  <p className={`text-sm ${visionProStyles.secondaryText} hidden sm:block`}>查看公司最新公告與通知</p>
                </div>
              </div>
            </div>
            
            {/* 統計卡片區域 - 類似參考圖片的數據卡片 */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className={`${visionProStyles.statsCard} px-4 py-3 min-w-[120px]`}>
                <div className="flex items-center space-x-2">
                  <div className={visionProStyles.coloredIconContainer.green}>
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">最新公告</p>
                    <p className="text-lg font-bold text-gray-800">5</p>
                  </div>
                </div>
              </div>
              
              <div className={`${visionProStyles.statsCard} px-4 py-3 min-w-[120px]`}>
                <div className="flex items-center space-x-2">
                  <div className={visionProStyles.coloredIconContainer.purple}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">總公告數</p>
                    <p className="text-lg font-bold text-gray-800">24</p>
                  </div>
                </div>
              </div>
              
              <div className={`${visionProStyles.statsCard} px-4 py-3 min-w-[120px]`}>
                <div className="flex items-center space-x-2">
                  <div className={visionProStyles.coloredIconContainer.orange}>
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">閱讀率</p>
                    <p className="text-lg font-bold text-gray-800">85%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content container with glass effect */}
        <main className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className={`${visionProStyles.liquidGlassCardWithGlow} p-6 sm:p-8 shadow-2xl border border-white/50`}>
            <AnnouncementList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyAnnouncements;
