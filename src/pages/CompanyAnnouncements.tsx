
import React from 'react';
import AnnouncementList from '@/components/announcements/AnnouncementList';

const CompanyAnnouncements: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">公司公告</h1>
          <p className="text-gray-500">查看公司最新公告與通知</p>
        </div>
        
        <AnnouncementList />
      </main>
    </div>
  );
};

export default CompanyAnnouncements;
