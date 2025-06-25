
import React from 'react';
import { Clock, FileText } from 'lucide-react';
import { format } from 'date-fns';
import type { MyApplication } from '@/types/myApplication';
import ApplicationTypeIcon from './ApplicationTypeIcon';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import ApplicationDetails from './ApplicationDetails';

interface ApplicationCardProps {
  application: MyApplication;
  isPending?: boolean;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, isPending = false }) => {
  const cardClass = isPending 
    ? "bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-xl"
    : "bg-white/10 rounded-2xl p-6 border border-white/20";

  return (
    <div key={`${isPending ? 'pending-' : ''}${application.type}-${application.id}`} className={cardClass}>
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <ApplicationTypeIcon type={application.type} />
            <ApplicationStatusBadge status={application.status} />
          </div>
          
          <ApplicationDetails application={application} />

          {application.details.reason && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-white/80" />
                <span className="text-white/70 text-sm">申請原因</span>
              </div>
              <p className="text-white text-sm">{application.details.reason}</p>
            </div>
          )}

          <div className="mt-3 text-xs text-white/60">
            申請時間: {format(new Date(application.created_at), 'yyyy/MM/dd HH:mm')}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ApplicationStatusBadge status={application.status} />
        </div>
      </div>
    </div>
  );
};

export default ApplicationCard;
