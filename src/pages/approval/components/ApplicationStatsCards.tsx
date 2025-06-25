
import React from 'react';
import type { MyApplication } from '@/types/myApplication';

interface ApplicationStatsCardsProps {
  applications: MyApplication[];
}

const ApplicationStatsCards: React.FC<ApplicationStatsCardsProps> = ({ applications }) => {
  const stats = {
    overtime: applications.filter(a => a.type === 'overtime').length,
    overtimePending: applications.filter(a => a.type === 'overtime' && a.status === 'pending').length,
    missedCheckin: applications.filter(a => a.type === 'missed_checkin').length,
    leave: applications.filter(a => a.type === 'leave').length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  console.log('📊 申請統計:', stats);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3 backdrop-blur-xl">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-300">{stats.overtime}</div>
          <div className="text-blue-200 text-xs">加班申請</div>
        </div>
      </div>
      <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-3 backdrop-blur-xl">
        <div className="text-center">
          <div className="text-lg font-bold text-purple-300">{stats.missedCheckin}</div>
          <div className="text-purple-200 text-xs">忘記打卡</div>
        </div>
      </div>
      <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 backdrop-blur-xl">
        <div className="text-center">
          <div className="text-lg font-bold text-green-300">{stats.leave}</div>
          <div className="text-green-200 text-xs">請假申請</div>
        </div>
      </div>
      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3 backdrop-blur-xl">
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-300">{stats.pending}</div>
          <div className="text-yellow-200 text-xs">審核中</div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatsCards;
