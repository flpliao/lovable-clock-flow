import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Salary } from '@/types/salary';
import { formatCurrency } from '@/utils/payrollUtils';
import { DollarSign } from 'lucide-react';
import React, { useState } from 'react';

interface SalaryPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salary: Salary | null;
  onConfirmPayment: (paymentData: {
    paymentMethod: string;
    paymentReference?: string;
    comment?: string;
  }) => void;
}

const SalaryPaymentDialog: React.FC<SalaryPaymentDialogProps> = ({
  open,
  onOpenChange,
  salary,
  onConfirmPayment,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [paymentReference, setPaymentReference] = useState('');
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirmPayment({
        paymentMethod,
        paymentReference: paymentReference || undefined,
        comment: comment || undefined,
      });

      // 重置表單
      setPaymentMethod('bank_transfer');
      setPaymentReference('');
      setComment('');
      onOpenChange(false);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!salary) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>確認發放薪資</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded">
            <h3 className="font-medium text-sm mb-2">發放資訊</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>員工:</span>
                <span>{salary.employee_name}</span>
              </div>
              <div className="flex justify-between">
                <span>薪資月份:</span>
                <span>{salary.salary_month}</span>
              </div>
              <div className="flex justify-between">
                <span>薪資類型:</span>
                <span>{salary.salary_type}</span>
              </div>
              <div className="flex justify-between font-medium text-lg">
                <span>發放金額:</span>
                <span className="text-green-600">{formatCurrency(salary.basic_salary)}</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="paymentMethod">發放方式 *</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">銀行轉帳</SelectItem>
                <SelectItem value="cash">現金</SelectItem>
                <SelectItem value="check">支票</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="paymentReference">交易憑證號</Label>
            <Input
              id="paymentReference"
              value={paymentReference}
              onChange={e => setPaymentReference(e.target.value)}
              placeholder="轉帳序號或憑證編號..."
            />
          </div>

          <div>
            <Label htmlFor="comment">發放備註</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="可選填發放相關備註..."
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isProcessing}
            >
              取消
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={handleConfirm}
              disabled={isProcessing}
            >
              <DollarSign className="h-4 w-4 mr-1" />
              確認發放
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SalaryPaymentDialog;
