
import React from 'react';
import { Clock, AlertCircle, User } from 'lucide-react';
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

  if (pendingOvertimes.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
          <h3 className="text-lg font-medium text-white">正在審核的加班申請</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-white/70">目前沒有正在審核的加班申請</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle className="h-5 w-5 text-yellow-400" />
        <h3 className="text-lg font-medium text-white">正在審核的加班申請</h3>
        <div className="bg-yellow-500/80 text-white text-xs px-2 py-1 rounded-full">
          {pendingOvertimes.length} 筆
        </div>
      </div>
      
      <div className="space-y-4">
        {pendingOvertimes.map((overtime) => (
          <div key={overtime.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium">{getOvertimeTypeText(overtime.overtime_type)}</h4>
                    <ApprovalStatusBadge status={overtime.status} />
                  </div>
                  <div className="text-white/70 text-sm">
                    {formatDate(overtime.overtime_date)} | {overtime.hours} 小時
                  </div>
                </div>
              </div>
              <div className="text-right text-xs text-white/60">
                申請時間: {formatDate(overtime.created_at)}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
              <div>
                <span className="text-white/70 text-sm">時間範圍:</span>
                <div className="text-white text-sm font-medium">
                  {formatTime(overtime.start_time)} - {formatTime(overtime.end_time)}
                </div>
              </div>
              <div>
                <span className="text-white/70 text-sm">補償方式:</span>
                <div className="text-white text-sm font-medium">
                  {getCompensationTypeText(overtime.compensation_type)}
                </div>
              </div>
              <div>
                <span className="text-white/70 text-sm">總時數:</span>
                <div className="text-white text-sm font-bold text-yellow-300">
                  {overtime.hours} 小時
                </div>
              </div>
            </div>
            
            <div className="mb-3">
              <span className="text-white/70 text-sm">申請原因:</span>
              <div className="text-white text-sm mt-1">{overtime.reason}</div>
            </div>

            {/* 審核狀態資訊 */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm font-medium">審核狀態</span>
              </div>
              
              {overtime.overtime_approval_records && overtime.overtime_approval_records.length > 0 ? (
                <div className="space-y-2">
                  {overtime.overtime_approval_records.map((record) => (
                    <div key={record.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-white text-sm">
                          第 {record.level} 級審核 - {record.approver_name}
                        </span>
                        <ApprovalStatusBadge status={record.status} />
                      </div>
                      {record.approval_date && (
                        <span className="text-white/60 text-xs">
                          {formatDate(record.approval_date)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white/70 text-sm">
                  等待審核中...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OvertimePendingSection;
