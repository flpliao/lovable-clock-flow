
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ApprovalRecord, LeaveRequest } from '@/types';
import { Check, X, AlertTriangle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [comment, setComment] = useState<string>('');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [showRejectDialog, setShowRejectDialog] = useState<boolean>(false);
  
  const handleApprove = () => {
    if (leaveRequest.leave_type === 'annual' && !comment) {
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
      
      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>拒絕請假申請</DialogTitle>
            <DialogDescription>
              請提供拒絕此請假申請的原因，該原因將通知給申請人。
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="請輸入拒絕原因..."
              className="resize-none"
              rows={4}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>取消</Button>
            <Button variant="destructive" onClick={handleReject}>
              <AlertTriangle className="mr-1 h-4 w-4" /> 確認拒絕
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveApprovalActions;
