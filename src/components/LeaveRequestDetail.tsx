
import React from 'react';
import { LeaveRequest } from '@/types';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import LeaveApprovalFlow from './LeaveApprovalFlow';
import LeaveApprovalActions from './LeaveApprovalActions';
import LeaveStatusBadge from './LeaveStatusBadge';
import LeaveRequestInfo from './LeaveRequestInfo';
import { useLeaveApproval } from '@/hooks/useLeaveApproval';

interface LeaveRequestDetailProps {
  leaveRequest: LeaveRequest;
  isApprover?: boolean;
}

const LeaveRequestDetail: React.FC<LeaveRequestDetailProps> = ({
  leaveRequest,
  isApprover = false
}) => {
  const { updateLeaveRequest } = useLeaveManagementContext();
  const { handleApprove, handleReject } = useLeaveApproval();
  
  // Wrapped approval handler
  const onApprove = (comment: string) => {
    handleApprove(leaveRequest, comment, updateLeaveRequest);
  };
  
  // Wrapped reject handler
  const onReject = (reason: string) => {
    handleReject(leaveRequest, reason, updateLeaveRequest);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white drop-shadow-md">請假詳情</h2>
        <LeaveStatusBadge status={leaveRequest.status} />
      </div>
      
      <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/30 shadow-xl p-6">
        <LeaveRequestInfo leaveRequest={leaveRequest} />
      </div>
      
      {leaveRequest.approvals && leaveRequest.approvals.length > 0 && (
        <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/30 shadow-xl p-6">
          <LeaveApprovalFlow 
            approvals={leaveRequest.approvals} 
            currentLevel={leaveRequest.approval_level || 0}
          />
        </div>
      )}
      
      {isApprover && leaveRequest.status === 'pending' && (
        <div className="backdrop-blur-xl bg-white/20 rounded-3xl border border-white/30 shadow-xl p-6">
          <LeaveApprovalActions
            leaveRequest={leaveRequest}
            onApprove={onApprove}
            onReject={onReject}
          />
        </div>
      )}
    </div>
  );
};

export default LeaveRequestDetail;
