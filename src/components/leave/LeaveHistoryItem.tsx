
import React from 'react';
import { LeaveRequest } from '@/types';
import { Badge } from '@/components/ui/badge';
import { getStatusBadgeVariant, getStatusText, getLeaveTypeText } from '@/utils/leaveUtils';
import { Calendar, Clock, User, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface LeaveHistoryItemProps {
  leave: LeaveRequest;
  onClick?: (leave: LeaveRequest) => void;
}

export const LeaveHistoryItem: React.FC<LeaveHistoryItemProps> = ({ leave, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(leave);
    }
  };

  // 判斷核准人資訊
  const getApproverInfo = () => {
    if (leave.status === 'approved') {
      // 檢查是否為系統自動核准
      if (leave.approved_by === 'system' || leave.approved_by === '自動核准') {
        return '系統';
      }
      // 如果有審核記錄，顯示審核人員
      if (leave.approvals && leave.approvals.length > 0) {
        const approvedRecord = leave.approvals.find(approval => approval.status === 'approved');
        if (approvedRecord) {
          return approvedRecord.approver_name;
        }
      }
      return '未知';
    } else if (leave.status === 'rejected') {
      if (leave.approvals && leave.approvals.length > 0) {
        const rejectedRecord = leave.approvals.find(approval => approval.status === 'rejected');
        if (rejectedRecord) {
          return rejectedRecord.approver_name;
        }
      }
      return '未知';
    }
    return '';
  };

  return (
    <div 
      className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 hover:bg-white/30 transition-all duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-white/80" />
          <span className="font-medium text-white drop-shadow-sm">
            {getLeaveTypeText(leave.leave_type)}
          </span>
        </div>
        <Badge variant={getStatusBadgeVariant(leave.status)}>
          {getStatusText(leave.status)}
        </Badge>
      </div>
      
      <div className="space-y-2 text-sm text-white/90">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>
            {format(new Date(leave.start_date), 'yyyy/MM/dd')} - {format(new Date(leave.end_date), 'yyyy/MM/dd')}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>{leave.hours} 小時</span>
        </div>

        {(leave.status === 'approved' || leave.status === 'rejected') && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>
              {leave.status === 'approved' ? '核准人' : '拒絕人'}：{getApproverInfo()}
            </span>
          </div>
        )}
        
        {leave.reason && (
          <div className="mt-2 p-2 bg-white/10 rounded-lg">
            <p className="text-xs text-white/80">原因：{leave.reason}</p>
          </div>
        )}
      </div>
    </div>
  );
};
