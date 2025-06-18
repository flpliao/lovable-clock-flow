
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import PayrollTableLoading from './components/PayrollTableLoading';
import PayrollTableMobile from './components/PayrollTableMobile';
import PayrollTableDesktop from './components/PayrollTableDesktop';
import PayrollTableDialogs from './components/PayrollTableDialogs';

interface PayrollTableProps {
  payrolls: any[];
  isLoading: boolean;
  onEdit: (payroll: any) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, updates: any) => void;
  onApprove: (payrollId: string, comment?: string) => void;
  onReject: (payrollId: string, comment: string) => void;
  onMarkAsPaid: (payrollId: string, paymentData: any) => void;
}

const PayrollTable: React.FC<PayrollTableProps> = ({ 
  payrolls, 
  isLoading, 
  onEdit, 
  onDelete, 
  onUpdateStatus,
  onApprove,
  onReject,
  onMarkAsPaid
}) => {
  const isMobile = useIsMobile();
  const [approvalDialog, setApprovalDialog] = useState<{ open: boolean; payroll: any }>({ open: false, payroll: null });
  const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; payroll: any }>({ open: false, payroll: null });

  const handleOpenApprovalDialog = (payroll: any) => {
    setApprovalDialog({ open: true, payroll });
  };

  const handleOpenPaymentDialog = (payroll: any) => {
    setPaymentDialog({ open: true, payroll });
  };

  const handleApprovalDialogChange = (open: boolean) => {
    setApprovalDialog({ open, payroll: null });
  };

  const handlePaymentDialogChange = (open: boolean) => {
    setPaymentDialog({ open, payroll: null });
  };

  if (isLoading) {
    return <PayrollTableLoading />;
  }

  return (
    <>
      {isMobile ? (
        <PayrollTableMobile
          payrolls={payrolls}
          onEdit={onEdit}
          onDelete={onDelete}
          onOpenApprovalDialog={handleOpenApprovalDialog}
          onOpenPaymentDialog={handleOpenPaymentDialog}
        />
      ) : (
        <PayrollTableDesktop
          payrolls={payrolls}
          onEdit={onEdit}
          onDelete={onDelete}
          onOpenApprovalDialog={handleOpenApprovalDialog}
          onOpenPaymentDialog={handleOpenPaymentDialog}
        />
      )}
      
      <PayrollTableDialogs
        approvalDialog={approvalDialog}
        paymentDialog={paymentDialog}
        onApprovalDialogChange={handleApprovalDialogChange}
        onPaymentDialogChange={handlePaymentDialogChange}
        onApprove={onApprove}
        onReject={onReject}
        onMarkAsPaid={onMarkAsPaid}
      />
    </>
  );
};

export default PayrollTable;
