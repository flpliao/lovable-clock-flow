import { Salary } from '@/types/salary';
import React from 'react';
import SalaryPaymentDialog from '../dialogs/SalaryPaymentDialog';

interface SalaryTableDialogsProps {
  paymentDialog: { open: boolean; salary: Salary | null };
  onPaymentDialogChange: (open: boolean) => void;
  onMarkAsPaid: (
    salarySlug: string,
    paymentData: {
      paymentMethod: string;
      paymentReference?: string;
      comment?: string;
    }
  ) => void;
}

const SalaryTableDialogs: React.FC<SalaryTableDialogsProps> = ({
  paymentDialog,
  onPaymentDialogChange,
  onMarkAsPaid,
}) => {
  return (
    <>
      <SalaryPaymentDialog
        open={paymentDialog.open}
        onOpenChange={onPaymentDialogChange}
        salary={paymentDialog.salary}
        onConfirmPayment={paymentData =>
          onMarkAsPaid(paymentDialog.salary?.slug || '', paymentData)
        }
      />
    </>
  );
};

export default SalaryTableDialogs;
