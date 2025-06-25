
import React from 'react';
import { Clock, Calendar, User, FileText } from 'lucide-react';
import type { MyApplication } from '@/types/myApplication';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import ApplicationDetails from './ApplicationDetails';

interface ApplicationCardProps {
  application: MyApplication;
  isPending: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, isPending }) => {
  const getApplicationIcon = (type: string) => {
    switch (type) {
      case 'overtime':
        return <Clock className="h-5 w-5 text-orange-400" />;
      case 'missed_checkin':
        return <Calendar className="h-5 w-5 text-blue-400" />;
      case 'leave':
        return <User className="h-5 w-5 text-green-400" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'overtime':
        return '加班申請';
      case 'missed_checkin':
        return '忘記打卡申請';
      case 'leave':
        return '請假申請';
      default:
        return '其他申請';
    }
  };

  return (
    <div className={`backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-xl p-4 transition-all duration-300 hover:shadow-2xl ${
      isPending ? 'ring-2 ring-yellow-300/50' : ''
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {getApplicationIcon(application.type)}
          <div>
            <h3 className="font-medium text-white text-sm">
              {getTypeDisplayName(application.type)}
            </h3>
            <p className="text-white/80 text-xs mt-1">
              {new Date(application.created_at).toLocaleString('zh-TW')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ApplicationStatusBadge status={application.status} />
        </div>
      </div>

      {/* 標題顯示 */}
      <div className="mb-3">
        <p className="text-white/90 text-sm font-medium">
          {application.title}
        </p>
      </div>

      {/* 詳細信息 */}
      <ApplicationDetails application={application} />

      {/* 拒絕原因 */}
      {application.status === 'rejected' && application.details?.rejection_reason && (
        <div className="mt-3 p-2 bg-red-500/20 border border-red-300/30 rounded-lg">
          <p className="text-red-200 text-xs">
            <span className="font-medium">拒絕原因：</span>
            {application.details.rejection_reason}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard;
