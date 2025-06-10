
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AnnouncementList from '@/components/announcements/AnnouncementList';
import { createDashboardBackground, visionProStyles } from '@/utils/visionProStyles';

const CompanyAnnouncements: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={`${createDashboardBackground()} min-h-screen pb-safe`}>
      {/* 柔和的藍色背景效果 - 與首頁一致 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300/20 via-blue-200/10 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-blue-400/15 via-blue-300/8 to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-200/8 via-transparent to-transparent"></div>
      
      {/* 整體藍色調背景 */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-300/12 via-blue-200/8 to-blue-100/5"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-float shadow-sm"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-300/30 rounded-full animate-float shadow-sm" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/20 rounded-full animate-float shadow-sm" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10">
        {/* Mobile-optimized header with glass effect */}
        <div className={`${visionProStyles.topControlBar} mx-4 mt-4 mb-6 sticky top-4 z-20`}>
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className={`p-2 md:hidden ${visionProStyles.glassButton} border-white/40 text-gray-800 hover:bg-white/30`}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className={`text-lg sm:text-xl font-bold ${visionProStyles.primaryText}`}>公司公告</h1>
              <p className={`text-xs sm:text-sm ${visionProStyles.secondaryText} hidden sm:block`}>查看公司最新公告與通知</p>
            </div>
          </div>
        </div>

        {/* Main content without white container - directly on background */}
        <main className="px-4 sm:px-6 lg:px-8 pb-8">
          <AnnouncementList />
        </main>
      </div>
    </div>
  );
};

export default CompanyAnnouncements;
