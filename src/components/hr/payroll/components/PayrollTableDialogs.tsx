
import React from 'react';
import PayrollApprovalDialog from '../dialogs/PayrollApprovalDialog';
import PayrollPaymentDialog from '../dialogs/PayrollPaymentDialog';

interface PayrollTableDialogsProps {
  approvalDialog: { open: boolean; payroll: any };
  paymentDialog: { open: boolean; payroll: any };
  onApprovalDialogChange: (open: boolean) => void;
  onPaymentDialogChange: (open: boolean) => void;
  onApprove: (payrollId: string, comment?: string) => void;
  onReject: (payrollId: string, comment: string) => void;
  onMarkAsPaid: (payrollId: string, paymentData: any) => void;
}

const PayrollTableDialogs: React.FC<PayrollTableDialogsProps> = ({
  approvalDialog,
  paymentDialog,
  onApprovalDialogChange,
  onPaymentDialogChange,
  onApprove,
  onReject,
  onMarkAsPaid
}) => {
  return (
    <>
      <PayrollApprovalDialog
        open={approvalDialog.open}
        onOpenChange={onApprovalDialogChange}
        payroll={approvalDialog.payroll}
        onApprove={(comment) => onApprove(approvalDialog.payroll?.id, comment)}
        onReject={(comment) => onReject(approvalDialog.payroll?.id, comment)}
      />

      <PayrollPaymentDialog
        open={paymentDialog.open}
        onOpenChange={onPaymentDialogChange}
        payroll={paymentDialog.payroll}
        onConfirmPayment={(paymentData) => onMarkAsPaid(paymentDialog.payroll?.id, paymentData)}
      />
    </>
  );
};

export default PayrollTableDialogs;
