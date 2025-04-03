
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface UseLeaveApprovalFormProps {
  leaveType: string;
  onApprove: (comment: string) => void;
  onReject: (reason: string) => void;
}

export const useLeaveApprovalForm = ({
  leaveType,
  onApprove,
  onReject
}: UseLeaveApprovalFormProps) => {
  const [comment, setComment] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [showRejectDialog, setShowRejectDialog] = useState<boolean>(false);
  
  const handleApprove = () => {
    if (leaveType === 'annual' && !comment) {
      toast({
        title: "請輸入審核意見",
        description: "特休假審核需要添加審核意見",
        variant: "destructive"
      });
      return;
    }
    
    onApprove(comment);
    setComment('');
  };
  
  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "請輸入拒絕原因",
        description: "拒絕請假申請需要提供原因",
        variant: "destructive"
      });
      return;
    }
    
    onReject(rejectionReason);
    setRejectionReason('');
    setShowRejectDialog(false);
  };
  
  return {
    comment,
    setComment,
    rejectionReason,
    setRejectionReason,
    showRejectDialog,
    setShowRejectDialog,
    handleApprove,
    handleReject
  };
};
