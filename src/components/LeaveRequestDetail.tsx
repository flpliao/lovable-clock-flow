
import React from 'react';
import { LeaveRequest } from '@/types';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import LeaveApprovalFlow from './LeaveApprovalFlow';
import LeaveApprovalActions from './LeaveApprovalActions';
import LeaveStatusBadge from './LeaveStatusBadge';
import LeaveRequestInfo from './LeaveRequestInfo';
import { useLeaveApproval } from '@/hooks/useLeaveApproval';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

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
  
  // 獲取詳細的審核狀態資訊
  const getDetailedApprovalStatus = () => {
    if (leaveRequest.status === 'approved') {
      // 檢查是否為系統自動核准
      if (leaveRequest.approved_by === 'system') {
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-400" />,
          title: '無需核准（系統自動核准）',
          description: '因員工無設定直屬主管，系統已自動核准此請假申請',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-400/30'
        };
      }
      
      const approvedRecords = leaveRequest.approvals?.filter(a => a.status === 'approved') || [];
      if (approvedRecords.length === 1) {
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-400" />,
          title: '已核准',
          description: `已由直屬主管 ${approvedRecords[0].approver_name} 核准`,
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-400/30'
        };
      } else if (approvedRecords.length > 1) {
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-400" />,
          title: '已核准',
          description: `已通過 ${approvedRecords.length} 層主管審核`,
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-400/30'
        };
      }
    } else if (leaveRequest.status === 'rejected') {
      const rejectedRecord = leaveRequest.approvals?.find(a => a.status === 'rejected');
      return {
        icon: <XCircle className="h-5 w-5 text-red-400" />,
        title: '已退回',
        description: rejectedRecord 
          ? `已由 ${rejectedRecord.approver_name} 退回，原因：${rejectedRecord.comment || '未提供原因'}`
          : '請假申請已被退回',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-400/30'
      };
    } else if (leaveRequest.status === 'pending') {
      if (leaveRequest.approval_level === 1) {
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
          title: '直屬主管審核中',
          description: '請假申請已送交直屬主管，等待第一層審核',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-400/30'
        };
      } else if (leaveRequest.approval_level && leaveRequest.approval_level > 1) {
        const approvedCount = leaveRequest.approvals?.filter(a => a.status === 'approved').length || 0;
        return {
          icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
          title: `第 ${approvedCount} 層已通過，等待第 ${leaveRequest.approval_level} 層核准`,
          description: '多層主管審核進行中，請耐心等候',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-400/30'
        };
      }
    }

    return {
      icon: <AlertCircle className="h-5 w-5 text-gray-400" />,
      title: '審核中',
      description: '請假申請審核中',
      bgColor: 'bg-gray-500/20',
      borderColor: 'border-gray-400/30'
    };
  };

  const statusInfo = getDetailedApprovalStatus();
  
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
      
      {/* 審核狀態詳細資訊 */}
      <div className={`backdrop-blur-xl ${statusInfo.bgColor} border ${statusInfo.borderColor} rounded-3xl shadow-xl p-6`}>
        <div className="flex items-start gap-4">
          {statusInfo.icon}
          <div>
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-2">
              {statusInfo.title}
            </h3>
            <p className="text-white/90 drop-shadow-sm">
              {statusInfo.description}
            </p>
          </div>
        </div>
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
