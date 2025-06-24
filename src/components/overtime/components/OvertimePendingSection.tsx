
import React from 'react';
import { Clock, AlertCircle, User, CheckCircle, XCircle, Hourglass, Eye } from 'lucide-react';
import ApprovalStatusBadge from './ApprovalStatusBadge';

interface OvertimeApprovalRecord {
  id: string;
  approver_id: string | null;
  approver_name: string;
  level: number;
  status: string;
  approval_date: string | null;
  comment: string | null;
  created_at: string;
}

interface PendingOvertimeRecord {
  id: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  overtime_type: string;
  compensation_type: string;
  reason: string;
  status: string;
  created_at: string;
  staff_id: string;
  approved_by: string | null;
  approved_by_name?: string;
  approval_date: string | null;
  approval_comment: string | null;
  rejection_reason?: string;
  compensation_hours: number | null;
  updated_at: string;
  staff?: {
    name: string;
  };
  overtime_approval_records?: OvertimeApprovalRecord[];
}

interface OvertimePendingSectionProps {
  pendingOvertimes: PendingOvertimeRecord[];
}

const OvertimePendingSection: React.FC<OvertimePendingSectionProps> = ({ pendingOvertimes }) => {
  const getOvertimeTypeText = (type: string) => {
    switch (type) {
      case 'weekday':
        return '平日加班';
      case 'weekend':
        return '假日加班';
      case 'holiday':
        return '國定假日加班';
      default:
        return type;
    }
  };

  const getCompensationTypeText = (type: string) => {
    switch (type) {
      case 'pay':
        return '加班費';
      case 'time_off':
        return '補休';
      case 'both':
        return '加班費+補休';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW');
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('zh-TW', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getApprovalStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'pending':
        return <Hourglass className="h-4 w-4 text-yellow-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  if (pendingOvertimes.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-yellow-500/80 rounded-xl flex items-center justify-center shadow-lg">
          <Eye className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white">我的待審核加班申請</h2>
          <p className="text-yellow-200 text-sm">以下是您提交後正在等待主管審核的加班申請</p>
        </div>
        <div className="bg-yellow-500/80 text-white text-sm px-4 py-2 rounded-full font-medium shadow-sm">
          {pendingOvertimes.length} 筆待審核
        </div>
      </div>
      
      <div className="space-y-5">
        {pendingOvertimes.map((overtime) => (
          <div key={overtime.id} className="bg-white/10 rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-yellow-500/30 rounded-lg flex items-center justify-center">
                  <Clock className="h-7 w-7 text-yellow-300" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-semibold text-lg">{getOvertimeTypeText(overtime.overtime_type)}</h4>
                    <ApprovalStatusBadge status={overtime.status} />
                  </div>
                  <div className="text-white/80 text-sm">
                    {formatDate(overtime.overtime_date)} | {overtime.hours} 小時 | {getCompensationTypeText(overtime.compensation_type)}
                  </div>
                </div>
              </div>
              <div className="text-right text-xs text-white/60">
                <div>申請時間</div>
                <div className="font-medium">{formatDate(overtime.created_at)}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="bg-white/5 rounded-lg p-3">
                <span className="text-white/70 text-sm block mb-1">時間範圍</span>
                <div className="text-white text-sm font-medium">
                  {formatTime(overtime.start_time)} - {formatTime(overtime.end_time)}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <span className="text-white/70 text-sm block mb-1">總時數</span>
                <div className="text-yellow-300 text-sm font-bold">
                  {overtime.hours} 小時
                </div>
              </div>
            </div>
            
            <div className="mb-5">
              <span className="text-white/70 text-sm block mb-2">申請原因</span>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-white text-sm">{overtime.reason}</div>
              </div>
            </div>

            {/* 審核狀態詳細資訊 */}
            <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm font-medium">目前審核狀態</span>
              </div>
              
              {overtime.overtime_approval_records && overtime.overtime_approval_records.length > 0 ? (
                <div className="space-y-3">
                  {overtime.overtime_approval_records.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getApprovalStatusIcon(record.status)}
                        <div>
                          <div className="text-white text-sm font-medium">
                            第 {record.level} 級審核 - {record.approver_name}
                          </div>
                          {record.comment && (
                            <div className="text-white/70 text-xs mt-1">
                              備註: {record.comment}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <ApprovalStatusBadge status={record.status} />
                        {record.approval_date && (
                          <div className="text-white/60 text-xs mt-1">
                            {formatDate(record.approval_date)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
                  <Hourglass className="h-5 w-5 text-yellow-400" />
                  <div className="text-white/80 text-sm">
                    您的加班申請已提交，正在等待主管審核中...
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* 提示訊息 */}
      <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-blue-300" />
          <span className="text-blue-200 text-xs">
            審核完成後，您將收到通知。請耐心等候主管審核。
          </span>
        </div>
      </div>
    </div>
  );
};

export default OvertimePendingSection;
