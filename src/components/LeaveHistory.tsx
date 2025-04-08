import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeaveRequest } from '@/types';
import { getLeaveTypeText, getStatusBadgeVariant, getStatusText } from '@/utils/leaveUtils';

// Mock data for leave history
const mockLeaveHistory: LeaveRequest[] = [
  {
    id: '1',
    user_id: '1',
    start_date: '2023-10-15',
    end_date: '2023-10-16',
    leave_type: 'annual',
    status: 'approved',
    hours: 16,
    reason: '個人休假',
    approval_level: 3,
    created_at: '2023-10-10T08:00:00Z',
    updated_at: '2023-10-12T14:30:00Z',
    approvals: [
      {
        id: 'a1',
        leave_request_id: '1',
        approver_id: '2',
        approver_name: '王小明',
        status: 'approved',
        level: 1,
        approval_date: '2023-10-11T09:15:00Z'
      },
      {
        id: 'a2',
        leave_request_id: '1',
        approver_id: '3',
        approver_name: '李經理',
        status: 'approved',
        level: 2,
        approval_date: '2023-10-12T11:00:00Z'
      },
      {
        id: 'a3',
        leave_request_id: '1',
        approver_id: '4',
        approver_name: '人事部 張小姐',
        status: 'approved',
        level: 3,
        approval_date: '2023-10-12T14:30:00Z'
      }
    ]
  },
  {
    id: '2',
    user_id: '1',
    start_date: '2023-11-05',
    end_date: '2023-11-05',
    leave_type: 'sick',
    status: 'approved',
    hours: 8,
    reason: '感冒就醫',
    approval_level: 2,
    created_at: '2023-11-03T10:20:00Z',
    updated_at: '2023-11-04T15:45:00Z',
    approvals: [
      {
        id: 'b1',
        leave_request_id: '2',
        approver_id: '2',
        approver_name: '王小明',
        status: 'approved',
        level: 1,
        approval_date: '2023-11-03T14:00:00Z'
      },
      {
        id: 'b2',
        leave_request_id: '2',
        approver_id: '3',
        approver_name: '李經理',
        status: 'approved',
        level: 2,
        approval_date: '2023-11-04T15:45:00Z'
      }
    ]
  },
  {
    id: '3',
    user_id: '1',
    start_date: '2023-12-25',
    end_date: '2023-12-27',
    leave_type: 'annual',
    status: 'rejected',
    hours: 24,
    reason: '聖誕假期',
    approval_level: 1,
    rejection_reason: '因年底專案繁忙，請調整假期時間',
    created_at: '2023-12-15T09:30:00Z',
    updated_at: '2023-12-16T11:20:00Z',
    approvals: [
      {
        id: 'c1',
        leave_request_id: '3',
        approver_id: '2',
        approver_name: '王小明',
        status: 'rejected',
        level: 1,
        comment: '因年底專案繁忙，請調整假期時間',
        approval_date: '2023-12-16T11:20:00Z'
      }
    ]
  }
];

// Helper function to format dates
const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const formatDate = (date: Date) => {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  
  if (startDate === endDate) {
    return formatDate(start);
  }
  
  return `${formatDate(start)} - ${formatDate(end)}`;
};

// Helper to get the latest approval status
const getApprovalStatus = (leave: LeaveRequest): string => {
  if (leave.status === 'rejected') {
    return `被 ${leave.approvals?.find(a => a.status === 'rejected')?.approver_name || '主管'} 拒絕`;
  } else if (leave.status === 'approved') {
    return '全部審核完成';
  } else {
    // Find the current approver
    const currentApproval = leave.approvals?.find(a => a.level === leave.approval_level);
    return `等待 ${currentApproval?.approver_name || '主管'} 審核`;
  }
};

interface LeaveHistoryProps {
  onClick?: (leave: LeaveRequest) => void;
}

const LeaveHistory: React.FC<LeaveHistoryProps> = ({ onClick }) => {
  const handleClick = (leave: LeaveRequest) => {
    if (onClick) {
      onClick(leave);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">請假記錄</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockLeaveHistory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">尚無請假記錄</p>
          ) : (
            mockLeaveHistory.map((leave) => (
              <div 
                key={leave.id} 
                className="flex items-start justify-between border-b pb-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                onClick={() => handleClick(leave)}
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveHistory;
