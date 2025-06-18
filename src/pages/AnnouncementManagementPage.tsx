
import React from 'react';
import AnnouncementManagement from '@/components/announcements/AnnouncementManagement';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AnnouncementManagementPage: React.FC = () => {
  const { currentUser, isAdmin } = useUser();
  const navigate = useNavigate();
  
  // Only allow admin users or HR department to access this page
  if (!currentUser || !(isAdmin() || currentUser.department === 'HR')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>

      <div className="relative z-10 flex flex-col min-h-screen pt-32 md:pt-36">
        {/* Header with glass effect */}
        <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl mx-4 mt-4 mb-8 shadow-xl">
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
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">公告管理</h1>
                <p className="text-sm text-white/80 font-medium drop-shadow-sm hidden sm:block">管理公司公告、上傳附件和追蹤閱讀狀態</p>
              </div>
            </div>
          </div>
        </div>

        {/* 主要內容區域 */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <AnnouncementManagement />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnnouncementManagementPage;
