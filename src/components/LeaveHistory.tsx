
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeaveRequest } from '@/types';

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
    reason: '個人休假'
  },
  {
    id: '2',
    user_id: '1',
    start_date: '2023-11-05',
    end_date: '2023-11-05',
    leave_type: 'sick',
    status: 'approved',
    hours: 8,
    reason: '感冒就醫'
  },
  {
    id: '3',
    user_id: '1',
    start_date: '2023-12-25',
    end_date: '2023-12-27',
    leave_type: 'annual',
    status: 'pending',
    hours: 24,
    reason: '聖誕假期'
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

// Helper to get leave type in Chinese
const getLeaveTypeText = (type: string): string => {
  switch (type) {
    case 'annual': return '特休';
    case 'sick': return '病假';
    case 'personal': return '事假';
    default: return '其他';
  }
};

// Helper to get status badge color
const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" => {
  switch (status) {
    case 'approved': return 'default';
    case 'pending': return 'secondary';
    case 'rejected': return 'destructive';
    default: return 'secondary';
  }
};

// Helper to get status text in Chinese
const getStatusText = (status: string): string => {
  switch (status) {
    case 'approved': return '已核准';
    case 'pending': return '審核中';
    case 'rejected': return '已拒絕';
    default: return '未知';
  }
};

const LeaveHistory: React.FC = () => {
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
              <div key={leave.id} className="flex items-start justify-between border-b pb-3">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">{getLeaveTypeText(leave.leave_type)}</span>
                    <Badge variant={getStatusBadgeVariant(leave.status)}>
                      {getStatusText(leave.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{formatDateRange(leave.start_date, leave.end_date)}</p>
                  <p className="text-sm">{leave.reason}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{leave.hours / 8} 天</p>
                  <p className="text-xs text-muted-foreground">
                    {leave.hours} 小時
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
