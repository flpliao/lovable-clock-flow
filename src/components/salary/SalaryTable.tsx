import { AddButton } from '@/components/common/buttons';
import SalaryTableDesktop from '@/components/salary/components/SalaryTableDesktop';
import SalaryTableLoading from '@/components/salary/components/SalaryTableLoading';
import SalaryTableMobile from '@/components/salary/components/SalaryTableMobile';
import SalaryPaymentDialog from '@/components/salary/dialogs/SalaryPaymentDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Salary } from '@/types/salary';
import { formatYearMonth } from '@/utils/dateUtils';
import React, { useState } from 'react';

interface SalaryTableProps {
  salaries: Salary[];
  isLoading: boolean;
  onEdit: (salary: Salary) => void;
  onDelete: (slug: string) => void;
  yearMonth?: string;
  onAdd?: () => void;
}

const SalaryTable: React.FC<SalaryTableProps> = ({
  salaries,
  isLoading,
  onEdit,
  onDelete,
  yearMonth,
  onAdd,
}) => {
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
      <Card className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md rounded-xl overflow-hidden">
        <CardHeader className="bg-white/60 border-b border-white/30 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-slate-800 text-xl font-bold">
                薪資記錄列表{yearMonth ? ` - ${formatYearMonth(yearMonth)}` : ''}
              </CardTitle>
              <CardDescription className="text-slate-600 font-medium">
                {yearMonth
                  ? `${formatYearMonth(yearMonth)} 的員工薪資記錄`
                  : '管理系統中的所有薪資記錄'}
              </CardDescription>
            </div>
            {onAdd && (
              <div className="flex-shrink-0">
                <AddButton onClick={onAdd} />
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isMobile ? (
            <SalaryTableMobile salaries={salaries} onEdit={onEdit} onDelete={onDelete} />
          ) : (
            <SalaryTableDesktop salaries={salaries} onEdit={onEdit} onDelete={onDelete} />
          )}
        </CardContent>
      </Card>

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
