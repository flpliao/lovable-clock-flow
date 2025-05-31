
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile-optimized header */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="p-2 md:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">公告管理</h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">管理公司公告、上傳附件和追蹤閱讀狀態</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content with mobile-optimized padding */}
      <main className="flex-1 px-3 sm:px-4 py-3 sm:py-6">
        <AnnouncementManagement />
      </main>
    </div>
  );
};

export default AnnouncementManagementPage;
