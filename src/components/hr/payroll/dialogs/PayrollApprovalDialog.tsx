
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import { formatCurrency } from '@/utils/payrollUtils';

interface PayrollApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payroll: any;
  onApprove: (comment?: string) => void;
  onReject: (comment: string) => void;
}

const PayrollApprovalDialog: React.FC<PayrollApprovalDialogProps> = ({
  open,
  onOpenChange,
  payroll,
  onApprove,
  onReject
}) => {
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await onApprove(comment);
      setComment('');
      onOpenChange(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      alert('拒絕時必須填寫原因');
      return;
    }
    
    setIsProcessing(true);
    try {
      await onReject(comment);
      setComment('');
      onOpenChange(false);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!payroll) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>薪資核准</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="font-medium text-sm mb-2">薪資資訊</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>員工:</span>
                <span>{payroll.staff?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>薪資期間:</span>
                <span>{payroll.pay_period_start} ~ {payroll.pay_period_end}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>實發薪資:</span>
                <span className="text-green-600">{formatCurrency(payroll.net_salary)}</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="comment">核准意見</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="可選填核准意見或必填拒絕原因..."
              className="mt-1"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 text-red-600 border-red-200"
              onClick={handleReject}
              disabled={isProcessing}
            >
              <X className="h-4 w-4 mr-1" />
              拒絕
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
              disabled={isProcessing}
            >
              <Check className="h-4 w-4 mr-1" />
              核准
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayrollApprovalDialog;
