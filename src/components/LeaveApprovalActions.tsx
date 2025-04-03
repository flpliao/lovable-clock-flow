
import React from 'react';
import { Button } from '@/components/ui/button';
import { LeaveRequest } from '@/types';
import { Check, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import RejectionReasonDialog from '@/components/dialogs/RejectionReasonDialog';
import { useLeaveApprovalForm } from '@/hooks/useLeaveApprovalForm';

interface LeaveApprovalActionsProps {
  leaveRequest: LeaveRequest;
  onApprove: (comment: string) => void;
  onReject: (reason: string) => void;
}

const LeaveApprovalActions: React.FC<LeaveApprovalActionsProps> = ({
  leaveRequest,
  onApprove,
  onReject
}) => {
  const {
    comment,
    setComment,
    rejectionReason,
    setRejectionReason,
    showRejectDialog,
    setShowRejectDialog,
    handleApprove,
    handleReject
  } = useLeaveApprovalForm({
    leaveType: leaveRequest.leave_type,
    onApprove,
    onReject
  });
  
  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="text-sm font-medium mb-3">審核操作</h3>
      
      <div className="mb-4">
        <label className="block text-sm text-gray-600 mb-1">審核意見</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="請輸入審核意見（選填，特休假必填）"
          className="resize-none"
          rows={3}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={handleApprove}
          className="flex-1"
        >
          <Check className="mr-1" /> 核准請假
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => setShowRejectDialog(true)}
          className="flex-1"
        >
          <X className="mr-1" /> 拒絕請假
        </Button>
      </div>
      
      <RejectionReasonDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onConfirm={handleReject}
      />
    </div>
  );
};

export default LeaveApprovalActions;
