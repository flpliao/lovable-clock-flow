import ApprovalButtons from '@/components/common/buttons/ApprovalActionButtons';
import ApproveDialog from '@/components/common/dialogs/ApproveDialog';
import RejectDialog from '@/components/common/dialogs/RejectDialog';
import { RequestType } from '@/constants/checkInTypes';
import { RequestStatus } from '@/constants/requestStatus';
import { useToast } from '@/hooks/useToast';
import { MissedCheckInRequest } from '@/types/missedCheckInRequest';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { CheckCircle, FileText, User } from 'lucide-react';
import React, { useState } from 'react';

interface MissedCheckinApprovalTabProps {
  requests: MissedCheckInRequest[];
  isLoading: boolean;
  onApprove: (request: MissedCheckInRequest) => Promise<boolean>;
  onReject: (request: MissedCheckInRequest) => Promise<boolean>;
}

const MissedCheckinApprovalTab: React.FC<MissedCheckinApprovalTabProps> = ({
  requests,
  isLoading,
  onApprove,
  onReject,
}) => {
  const [selectedRequest, setSelectedRequest] = useState<MissedCheckInRequest | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approveComment, setApproveComment] = useState('');
  const { toast } = useToast();

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
        <p className="text-white font-medium drop-shadow-sm">目前沒有待審核的忘記打卡申請</p>
        <p className="text-white/80 mt-1 font-medium drop-shadow-sm">
          所有忘記打卡申請都已處理完畢
        </p>
      </div>
    );
  }

  const handleApprove = async (request: MissedCheckInRequest) => {
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

  const handleReject = async (request: MissedCheckInRequest) => {
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
        <div
          key={request.id || request.slug}
          className="bg-white/10 rounded-2xl p-6 border border-white/20"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <User className="h-5 w-5 text-white/80" />
                <h3 className="text-lg font-semibold text-white">
                  申請人員：{request.employee.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <span className="text-white/70">申請類型</span>
                  <div className="text-white font-medium">
                    {request.request_type === RequestType.CHECK_IN ? '上班打卡' : '下班打卡'}
                  </div>
                </div>
                <div>
                  <span className="text-white/70">打卡時間</span>
                  <div className="text-white font-medium">
                    {dayjs(request.checked_at).format('HH:mm')}
                  </div>
                </div>
                <div>
                  <span className="text-white/70">申請日期</span>
                  <div className="text-white font-medium">
                    {format(new Date(request.request_date), 'yyyy/MM/dd')}
                  </div>
                </div>
              </div>

              {request.reason && (
                <div className="mb-4 p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-white/80" />
                    <span className="text-white/70 text-sm">申請原因</span>
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
              disabled={request.status !== RequestStatus.PENDING}
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

export default MissedCheckinApprovalTab;
