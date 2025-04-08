
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { LeaveRequest } from '@/types';
import { getLeaveTypeText, getStatusBadgeVariant, getStatusText } from '@/utils/leaveUtils';
import { formatDateRange } from '@/utils/dateFormatUtils';
import { getApprovalStatus } from '@/utils/leaveApprovalUtils';

interface LeaveHistoryItemProps {
  leave: LeaveRequest;
  onClick: (leave: LeaveRequest) => void;
}

export const LeaveHistoryItem: React.FC<LeaveHistoryItemProps> = ({ leave, onClick }) => {
  return (
    <div 
      className="flex items-start justify-between border-b pb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
      onClick={() => onClick(leave)}
    >
      <div className="space-y-1">
        <div className="flex items-center">
          <span className="font-medium mr-2">{getLeaveTypeText(leave.leave_type)}</span>
          <Badge variant={getStatusBadgeVariant(leave.status)}>
            {getStatusText(leave.status)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{formatDateRange(leave.start_date, leave.end_date)}</p>
        <p className="text-sm">{leave.reason}</p>
        
        <p className="text-xs text-muted-foreground mt-1">
          {getApprovalStatus(leave)}
        </p>
      </div>
      <div className="text-right">
        <p className="font-medium">{leave.hours / 8} 天</p>
        <p className="text-xs text-muted-foreground">
          {leave.hours} 小時
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(leave.created_at || '').toLocaleDateString('zh-TW')}
        </p>
      </div>
    </div>
  );
};
