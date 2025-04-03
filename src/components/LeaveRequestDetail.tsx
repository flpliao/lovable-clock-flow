
import React from 'react';
import { LeaveRequest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LeaveApprovalFlow from './LeaveApprovalFlow';
import LeaveApprovalActions from './LeaveApprovalActions';
import LeaveStatusBadge from './LeaveStatusBadge';
import LeaveRequestInfo from './LeaveRequestInfo';
import { useLeaveApproval } from '@/hooks/useLeaveApproval';

interface LeaveRequestDetailProps {
  leaveRequest: LeaveRequest;
  onRequestChange: (updatedRequest: LeaveRequest) => void;
  isApprover?: boolean;
}

const LeaveRequestDetail: React.FC<LeaveRequestDetailProps> = ({
  leaveRequest,
  onRequestChange,
  isApprover = false
}) => {
  const { handleApprove, handleReject } = useLeaveApproval();
  
  // Wrapped approval handler
  const onApprove = (comment: string) => {
    handleApprove(leaveRequest, comment, onRequestChange);
  };
  
  // Wrapped reject handler
  const onReject = (reason: string) => {
    handleReject(leaveRequest, reason, onRequestChange);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">請假詳情</CardTitle>
          <LeaveStatusBadge status={leaveRequest.status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <LeaveRequestInfo leaveRequest={leaveRequest} />
          
          {leaveRequest.approvals && leaveRequest.approvals.length > 0 && (
            <LeaveApprovalFlow 
              approvals={leaveRequest.approvals} 
              currentLevel={leaveRequest.approval_level || 0}
            />
          )}
          
          {isApprover && leaveRequest.status === 'pending' && (
            <LeaveApprovalActions
              leaveRequest={leaveRequest}
              onApprove={onApprove}
              onReject={onReject}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestDetail;
