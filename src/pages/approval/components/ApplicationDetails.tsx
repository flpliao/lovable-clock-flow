import React from 'react';
import { Calendar, Clock, FileText, AlertCircle } from 'lucide-react';
import type { MyApplication } from '@/types/myApplication';

interface ApplicationDetailsProps {
  application: MyApplication;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ application }) => {
  const renderOvertimeDetails = () => {
    const details = application.details;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white/80 text-xs">
          <Calendar className="h-3 w-3" />
          <span>加班日期：{new Date(details.overtime_date).toLocaleDateString('zh-TW')}</span>
        </div>
        <div className="flex items-center gap-2 text-white/80 text-xs">
          <Clock className="h-3 w-3" />
          <span>
            時間：{details.start_time} - {details.end_time} ({details.hours}小時)
          </span>
        </div>
        <div className="flex items-center gap-2 text-white/80 text-xs">
          <FileText className="h-3 w-3" />
          <span>類型：{details.overtime_type}</span>
        </div>
        {details.reason && (
          <div className="flex items-start gap-2 text-white/80 text-xs">
            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>原因：{details.reason}</span>
          </div>
        )}
      </div>
    );
  };

  const renderMissedCheckinDetails = () => {
    const details = application.details;
    const typeText = details.missed_type === 'check_in' ? '上班打卡' : '下班打卡';

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white/80 text-xs">
          <Calendar className="h-3 w-3" />
          <span>申請日期：{new Date(details.request_date).toLocaleDateString('zh-TW')}</span>
        </div>
        <div className="flex items-center gap-2 text-white/80 text-xs">
          <Clock className="h-3 w-3" />
          <span>類型：忘記{typeText}</span>
        </div>
        {details.requested_check_in_time && (
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <Clock className="h-3 w-3" />
            <span>
              補登上班：{new Date(details.requested_check_in_time).toLocaleTimeString('zh-TW')}
            </span>
          </div>
        )}
        {details.requested_check_out_time && (
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <Clock className="h-3 w-3" />
            <span>
              補登下班：{new Date(details.requested_check_out_time).toLocaleTimeString('zh-TW')}
            </span>
          </div>
        )}
        {details.reason && (
          <div className="flex items-start gap-2 text-white/80 text-xs">
            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>原因：{details.reason}</span>
          </div>
        )}
      </div>
    );
  };

  const renderLeaveDetails = () => {
    const details = application.details;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-white/80 text-xs">
          <Calendar className="h-3 w-3" />
          <span>
            請假期間：{new Date(details.start_date).toLocaleDateString('zh-TW')} -{' '}
            {new Date(details.end_date).toLocaleDateString('zh-TW')}
          </span>
        </div>
        <div className="flex items-center gap-2 text-white/80 text-xs">
          <Clock className="h-3 w-3" />
          <span>請假時數：{details.hours}小時</span>
        </div>
        <div className="flex items-center gap-2 text-white/80 text-xs">
          <FileText className="h-3 w-3" />
          <span>假別：{details.leave_type}</span>
        </div>
        {details.reason && (
          <div className="flex items-start gap-2 text-white/80 text-xs">
            <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span>原因：{details.reason}</span>
          </div>
        )}
      </div>
    );
  };

  switch (application.type) {
    case 'overtime':
      return renderOvertimeDetails();
    case 'missed_checkin':
      return renderMissedCheckinDetails();
    case 'leave':
      return renderLeaveDetails();
    default:
      return (
        <div className="text-white/60 text-xs">
          <span>詳細資訊不可用</span>
        </div>
      );
  }
};

export default ApplicationDetails;
