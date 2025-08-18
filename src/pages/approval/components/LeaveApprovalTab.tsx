import ApprovalButtons from '@/components/common/buttons/ApprovalActionButtons';
import { LeaveRequest } from '@/types';
import dayjs from 'dayjs';
import { CheckCircle, FileText, User } from 'lucide-react';
import React from 'react';

interface LeaveRequestWithApplicant extends LeaveRequest {
  applicant_name?: string;
  approvals?: unknown[];
}

interface LeaveApprovalTabProps {
  pendingRequests: LeaveRequestWithApplicant[];
  isLoading: boolean;
  onViewDetail: (request: LeaveRequestWithApplicant) => void;
  onApprove: (request: LeaveRequestWithApplicant) => Promise<void>;
  onReject: (request: LeaveRequestWithApplicant) => Promise<void>;
}

const LeaveApprovalTab: React.FC<LeaveApprovalTabProps> = ({
  pendingRequests,
  isLoading,
  onViewDetail,
  onApprove,
  onReject,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/80">載入中...</p>
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white/60" />
        </div>
        <p className="text-white font-medium drop-shadow-sm">目前沒有待審核的請假申請</p>
        <p className="text-white/80 mt-1 font-medium drop-shadow-sm">所有請假申請都已處理完畢</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingRequests.map(request => (
        <div key={request.slug} className="bg-white/5 rounded-2xl p-6 border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <User className="h-5 w-5 text-white/80" />
                <h3 className="text-lg font-semibold text-white">
                  申請人員：{request.employee.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-white/70">請假類型</span>
                  <div className="text-white font-medium">{request.leave_type.name}</div>
                </div>
                <div>
                  <span className="text-white/70">請假期間</span>
                  <div className="text-white font-medium">
                    {dayjs(request.start_date).format('MM/DD')} ~{' '}
                    {dayjs(request.end_date).format('MM/DD')}
                  </div>
                </div>
                <div>
                  <span className="text-white/70">請假時數</span>
                  <div className="text-white font-medium">{request.duration_hours} 小時</div>
                </div>
                <div>
                  <span className="text-white/70">申請時間</span>
                  <div className="text-white font-medium">
                    {dayjs(request.created_at).format('MM/DD HH:mm')}
                  </div>
                </div>
              </div>

              {request.reason && (
                <div className="mt-3 p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-white/80" />
                    <span className="text-white/70 text-sm">請假原因</span>
                  </div>
                  <p className="text-white text-sm">{request.reason}</p>
                </div>
              )}
            </div>

            <ApprovalButtons
              className="lg:ml-6"
              onViewDetail={() => onViewDetail(request)}
              onApprove={() => onApprove(request)}
              onReject={() => onReject(request)}
              size="sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaveApprovalTab;
