
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
  
  // 只顯示待審核的申請
  if (leaveRequest.status !== 'pending') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-white font-medium drop-shadow-sm">尚無待審核的請假申請</p>
        <p className="text-white/80 mt-1 font-medium drop-shadow-sm">您可以在申請請假頁面提交新的請假申請</p>
      </div>
    );
  }
  
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
