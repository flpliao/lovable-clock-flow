
import React from 'react';
import { format } from 'date-fns';
import { LeaveRequest } from '@/types';
import { getLeaveTypeText } from '@/utils/leaveUtils';

interface LeaveRequestInfoProps {
  leaveRequest: LeaveRequest;
}

const LeaveRequestInfo: React.FC<LeaveRequestInfoProps> = ({ leaveRequest }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">請假類型</p>
          <p className="font-medium">{getLeaveTypeText(leaveRequest.leave_type)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">請假時數</p>
          <p className="font-medium">{leaveRequest.hours} 小時 ({leaveRequest.hours / 8} 天)</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">開始日期</p>
          <p className="font-medium">{format(new Date(leaveRequest.start_date), 'yyyy/MM/dd')}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">結束日期</p>
          <p className="font-medium">{format(new Date(leaveRequest.end_date), 'yyyy/MM/dd')}</p>
        </div>
      </div>
      
      <div>
        <p className="text-sm text-muted-foreground">請假事由</p>
        <p className="bg-gray-50 p-3 rounded mt-1">{leaveRequest.reason}</p>
      </div>
      
      {leaveRequest.rejection_reason && (
        <div>
          <p className="text-sm text-muted-foreground text-red-500">拒絕原因</p>
          <p className="bg-red-50 p-3 rounded mt-1 text-red-800">{leaveRequest.rejection_reason}</p>
        </div>
      )}
    </div>
  );
};

export default LeaveRequestInfo;
