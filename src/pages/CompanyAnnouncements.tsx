
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import AnnouncementList from '@/components/announcements/AnnouncementList';

const CompanyAnnouncements: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Mobile-optimized header */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2 md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">公司公告</h1>
            <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">查看公司最新公告與通知</p>
          </div>
        </div>
      </div>

      {/* Main content with mobile-optimized padding */}
      <main className="flex-1 px-3 sm:px-4 py-3 sm:py-6">
        <AnnouncementList />
      </main>
    </div>
  );
};

export default CompanyAnnouncements;
