import SalaryTableDesktop from '@/components/salary/components/SalaryTableDesktop';
import SalaryTableLoading from '@/components/salary/components/SalaryTableLoading';
import SalaryTableMobile from '@/components/salary/components/SalaryTableMobile';
import SalaryPaymentDialog from '@/components/salary/dialogs/SalaryPaymentDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Salary } from '@/types/salary';
import React, { useState } from 'react';

interface SalaryTableProps {
  salaries: Salary[];
  isLoading: boolean;
  onEdit: (salary: Salary) => void;
  onDelete: (slug: string) => void;
}

const SalaryTable: React.FC<SalaryTableProps> = ({ salaries, isLoading, onEdit, onDelete }) => {
  const isMobile = useIsMobile();
  const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; salary: Salary | null }>({
    open: false,
    salary: null,
  });

  const handlePaymentDialogChange = (open: boolean) => {
    setPaymentDialog({ open, salary: null });
  };

  const handleConfirmPayment = (paymentData: {
    paymentMethod: string;
    paymentReference?: string;
    comment?: string;
  }) => {
    console.log('Payment confirmed:', paymentData);
    setPaymentDialog({ open: false, salary: null });
  };

  if (isLoading) {
    return <SalaryTableLoading />;
  }

  return (
    <>
      {isMobile ? (
        <SalaryTableMobile salaries={salaries} onEdit={onEdit} onDelete={onDelete} />
      ) : (
        <SalaryTableDesktop salaries={salaries} onEdit={onEdit} onDelete={onDelete} />
      )}

      <SalaryPaymentDialog
        open={paymentDialog.open}
        onOpenChange={handlePaymentDialogChange}
        salary={paymentDialog.salary}
        onConfirmPayment={handleConfirmPayment}
      />
    </>
  );
};

export default SalaryTable;
