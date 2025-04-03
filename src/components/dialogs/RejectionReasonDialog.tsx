
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RejectionReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rejectionReason: string;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
}

const RejectionReasonDialog: React.FC<RejectionReasonDialogProps> = ({
  open,
  onOpenChange,
  rejectionReason,
  onReasonChange,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="請輸入拒絕原因..."
            className="resize-none"
            rows={4}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
          <Button variant="destructive" onClick={onConfirm}>
            <AlertTriangle className="mr-1 h-4 w-4" /> 確認拒絕
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectionReasonDialog;
