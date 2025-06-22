
import React from 'react';
import { LeaveRequest } from '@/types';
import { Badge } from '@/components/ui/badge';
import { getStatusBadgeVariant, getStatusText, getLeaveTypeText } from '@/utils/leaveUtils';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
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

  // 獲取審核狀態詳細資訊
  const getApprovalStatusInfo = () => {
    if (leave.status === 'approved') {
      // 檢查是否為系統自動核准
      if (leave.approved_by === 'system') {
        return {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
          text: '✅ 無需核准（系統自動核准）',
          description: '因無直屬主管，系統自動核准'
        };
      }
      
      // 一般核准情況
      if (leave.approvals && leave.approvals.length > 0) {
        const approvedRecords = leave.approvals.filter(approval => approval.status === 'approved');
        if (approvedRecords.length === 1) {
          return {
            icon: <CheckCircle className="h-4 w-4 text-green-500" />,
            text: '✅ 已核准',
            description: `由 ${approvedRecords[0].approver_name} 核准`
          };
        } else if (approvedRecords.length > 1) {
          return {
            icon: <CheckCircle className="h-4 w-4 text-green-500" />,
            text: '✅ 已核准',
            description: `經 ${approvedRecords.length} 層主管核准`
          };
        }
      }
      
      return {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        text: '✅ 已核准',
        description: '已通過審核'
      };
    } else if (leave.status === 'rejected') {
      const rejectedRecord = leave.approvals?.find(approval => approval.status === 'rejected');
      return {
        icon: <XCircle className="h-4 w-4 text-red-500" />,
        text: '❌ 已退回',
        description: rejectedRecord ? `由 ${rejectedRecord.approver_name} 退回` : '已被退回'
      };
    } else if (leave.status === 'pending') {
      // 判斷審核進度
      if (leave.approval_level === 1) {
        return {
          icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
          text: '⏳ 直屬主管審核中',
          description: '等待第一層主管審核'
        };
      } else if (leave.approval_level && leave.approval_level > 1) {
        const approvedCount = leave.approvals?.filter(a => a.status === 'approved').length || 0;
        return {
          icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
          text: `⏳ 第${approvedCount}層已通過，等待第${leave.approval_level}層核准`,
          description: '多層主管審核進行中'
        };
      } else {
        return {
          icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
          text: '⏳ 審核中',
          description: '等待主管審核'
        };
      }
    }

    return {
      icon: <AlertCircle className="h-4 w-4 text-gray-500" />,
      text: '狀態未知',
      description: ''
    };
  };

  const statusInfo = getApprovalStatusInfo();

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

        {/* 審核狀態詳細資訊 */}
        <div className="flex items-center gap-2 mt-3 p-2 bg-white/10 rounded-lg">
          {statusInfo.icon}
          <div>
            <div className="text-white font-medium text-xs">{statusInfo.text}</div>
            {statusInfo.description && (
              <div className="text-white/70 text-xs mt-1">{statusInfo.description}</div>
            )}
          </div>
        </div>
        
        {leave.reason && (
          <div className="mt-2 p-2 bg-white/10 rounded-lg">
            <p className="text-xs text-white/80">原因：{leave.reason}</p>
          </div>
        )}
      </div>
    </div>
  );
};
