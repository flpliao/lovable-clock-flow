
import React from 'react';
import { Clock, CheckCircle, XCircle, Calendar, User, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface MyApplication {
  id: string;
  type: 'overtime' | 'missed_checkin' | 'leave';
  title: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  details: any;
}

interface MyApplicationsTabProps {
  applications: MyApplication[];
  isLoading: boolean;
}

const MyApplicationsTab: React.FC<MyApplicationsTabProps> = ({
  applications,
  isLoading
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return '已核准';
      case 'rejected':
        return '已拒絕';
      default:
        return '審核中';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'overtime':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'missed_checkin':
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case 'leave':
        return <User className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'overtime':
        return '加班申請';
      case 'missed_checkin':
        return '忘記打卡';
      case 'leave':
        return '請假申請';
      default:
        return '申請';
    }
  };

  const renderApplicationDetails = (application: MyApplication) => {
    const { type, details } = application;
    
    switch (type) {
      case 'overtime':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-white/70">加班日期</span>
              <div className="text-white font-medium">{details.overtime_date}</div>
            </div>
            <div>
              <span className="text-white/70">加班時數</span>
              <div className="text-white font-medium">{details.hours} 小時</div>
            </div>
            <div>
              <span className="text-white/70">補償方式</span>
              <div className="text-white font-medium">
                {details.compensation_type === 'overtime_pay' ? '加班費' : '補休'}
              </div>
            </div>
          </div>
        );
      
      case 'missed_checkin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/70">申請日期</span>
              <div className="text-white font-medium">{details.request_date}</div>
            </div>
            <div>
              <span className="text-white/70">申請類型</span>
              <div className="text-white font-medium">
                {details.missed_type === 'check_in' ? '忘記上班打卡' :
                 details.missed_type === 'check_out' ? '忘記下班打卡' : '忘記上下班打卡'}
              </div>
            </div>
          </div>
        );
      
      case 'leave':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-white/70">請假類型</span>
              <div className="text-white font-medium">{details.leave_type}</div>
            </div>
            <div>
              <span className="text-white/70">請假期間</span>
              <div className="text-white font-medium">
                {details.start_date} ~ {details.end_date}
              </div>
            </div>
            <div>
              <span className="text-white/70">請假時數</span>
              <div className="text-white font-medium">{details.hours} 小時</div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

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

  return (
    <div className="space-y-4">
      {applications.map(application => (
        <div key={`${application.type}-${application.id}`} className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                {getTypeIcon(application.type)}
                <h3 className="text-lg font-semibold text-white">{application.title}</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(application.status)}`}>
                  {getStatusText(application.status)}
                </div>
              </div>
              
              {renderApplicationDetails(application)}

              {application.details.reason && (
                <div className="mt-3 p-3 bg-white/10 rounded-lg">
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
              {getStatusIcon(application.status)}
              <span className="text-white font-medium">{getStatusText(application.status)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyApplicationsTab;
