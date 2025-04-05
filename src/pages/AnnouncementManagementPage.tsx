
import React from 'react';
import Header from '@/components/Header';
import AnnouncementManagement from '@/components/announcements/AnnouncementManagement';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';

const AnnouncementManagementPage: React.FC = () => {
  const { currentUser, isAdmin } = useUser();
  
  // Only allow admin users or HR department to access this page
  if (!currentUser || !(isAdmin() || currentUser.department === 'HR')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">公告管理系統</h1>
          <p className="text-gray-500">管理公司公告、上傳附件和追蹤閱讀狀態</p>
        </div>
        
        <AnnouncementManagement />
      </main>
    </div>
  );
};

export default AnnouncementManagementPage;
