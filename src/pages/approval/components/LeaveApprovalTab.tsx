import ApprovalButtons from '@/components/common/buttons/ApprovalActionButtons';
import ApproveDialog from '@/components/common/dialogs/ApproveDialog';
import RejectDialog from '@/components/common/dialogs/RejectDialog';
import { useToast } from '@/hooks/useToast';
import { LeaveRequest } from '@/types';
import dayjs from 'dayjs';
import { CheckCircle, FileText, User } from 'lucide-react';
import React, { useState } from 'react';

interface LeaveApprovalTabProps {
  requests: LeaveRequest[];
  isLoading: boolean;
  onApprove: (request: LeaveRequest) => Promise<boolean>;
  onReject: (request: LeaveRequest) => Promise<boolean>;
}

const LeaveApprovalTab: React.FC<LeaveApprovalTabProps> = ({
  requests,
  isLoading,
  onApprove,
  onReject,
}) => {
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [approveComment, setApproveComment] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/80">載入中...</p>
      </div>
    );
  }

  if (requests.length === 0) {
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

  const handleApprove = async (request: LeaveRequest) => {
    request.approve_comment = approveComment;
    const result = await onApprove(request);
    if (result) {
      setShowApproveDialog(false);
      toast({
        title: '核准成功',
        description: '忘記打卡申請已核准',
      });

      setApproveComment('');
    }

    return result;
  };

  const handleReject = async (request: LeaveRequest) => {
    request.rejection_reason = rejectionReason;
    const result = await onReject(request);
    if (result) {
      setShowRejectDialog(false);
      toast({
        title: '拒絕成功',
        description: '忘記打卡申請已拒絕',
      });

      setRejectionReason('');
    }

    return result;
  };

  return (
    <div className="space-y-4">
      {requests.map(request => (
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
                  <span className="text-white/70">申請日期</span>
                  <div className="text-white font-medium">
                    {dayjs(request.created_at).format('YYYY/MM/DD')}
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
              onApprove={() => {
                setSelectedRequest(request);
                setShowApproveDialog(true);
              }}
              onReject={() => {
                setSelectedRequest(request);
                setShowRejectDialog(true);
              }}
              size="sm"
            />
          </div>
        </div>
      ))}

      <ApproveDialog
        open={showApproveDialog}
        onOpenChange={setShowApproveDialog}
        onConfirm={() => handleApprove(selectedRequest)}
        approveComment={approveComment}
        onApproveCommentChange={setApproveComment}
        title="確認核准"
        description="確定要核准此忘打卡申請嗎？"
      />

      <RejectDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        onConfirm={() => handleReject(selectedRequest)}
        rejectionReason={rejectionReason}
        onRejectionReasonChange={setRejectionReason}
        title="確認拒絕"
        description="確定要拒絕此忘打卡申請嗎？"
      />
    </div>
  );
};

export default LeaveApprovalTab;
