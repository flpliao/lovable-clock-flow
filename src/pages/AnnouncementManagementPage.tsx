
import React from 'react';
import AnnouncementManagement from '@/components/announcements/AnnouncementManagement';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { visionProStyles } from '@/utils/visionProStyles';

const AnnouncementManagementPage: React.FC = () => {
  const { currentUser, isAdmin } = useUser();
  const navigate = useNavigate();
  
  // Only allow admin users or HR department to access this page
  if (!currentUser || !(isAdmin() || currentUser.department === 'HR')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Vision Pro 風格背景效果 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-400/15 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-float"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/30 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Vision Pro 風格的標題列 */}
        <div className={`${visionProStyles.glassBackground} border-b border-white/20 px-3 sm:px-4 py-3 sticky top-0 z-20 shadow-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className={`p-2 md:hidden ${visionProStyles.glassButton} border-white/40`}
              >
                <ArrowLeft className="h-5 w-5 text-white drop-shadow-lg" />
              </Button>
              <div>
                <h1 className={`text-lg sm:text-xl font-bold mb-2 ${visionProStyles.primaryText} text-white`}>
                  公告管理
                </h1>
                <p className={`text-xs sm:text-sm text-white/80 hidden sm:block font-medium drop-shadow-md`}>
                  管理公司公告、上傳附件和追蹤閱讀狀態
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 主要內容區域 */}
        <main className="flex-1 px-3 sm:px-4 py-3 sm:py-6">
          <AnnouncementManagement />
        </main>
      </div>
    </div>
  );
};

export default AnnouncementManagementPage;
