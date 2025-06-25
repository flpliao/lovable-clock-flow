
import React from 'react';
import { Clock, FileText } from 'lucide-react';
import type { MyApplication } from '@/types/myApplication';
import ApplicationStatsCards from './ApplicationStatsCards';
import ApplicationCard from './ApplicationCard';

interface MyApplicationsTabProps {
  applications: MyApplication[];
  isLoading: boolean;
}

const MyApplicationsTab: React.FC<MyApplicationsTabProps> = ({
  applications,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-white">載入中...</div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-white/60" />
        </div>
        <p className="text-white font-medium drop-shadow-sm">目前沒有申請記錄</p>
        <p className="text-white/80 mt-1 font-medium drop-shadow-sm">您還沒有提交任何申請</p>
      </div>
    );
  }

  // 分離待審核和其他申請
  const pendingApplications = applications.filter(a => a.status === 'pending');
  const otherApplications = applications.filter(a => a.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* 統計卡片 */}
      <ApplicationStatsCards applications={applications} />

      {/* 待審核申請區塊 */}
      {pendingApplications.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="h-5 w-5 text-yellow-300" />
            <h3 className="text-lg font-semibold text-white">待審核申請 ({pendingApplications.length})</h3>
          </div>
          
          {pendingApplications.map(application => (
            <ApplicationCard 
              key={`pending-${application.type}-${application.id}`}
              application={application} 
              isPending={true}
            />
          ))}
        </div>
      )}

      {/* 其他申請記錄 */}
      {otherApplications.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">申請記錄歷史</h3>
            <div className="text-sm text-white/60">
              共 {otherApplications.length} 筆記錄
            </div>
          </div>
          
          {otherApplications.map(application => (
            <ApplicationCard 
              key={`${application.type}-${application.id}`}
              application={application} 
              isPending={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplicationsTab;
