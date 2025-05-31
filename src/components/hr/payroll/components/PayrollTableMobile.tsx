
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, getPayrollStatusText, getPayrollStatusColor } from '@/utils/payrollUtils';
import PayrollTableActions from './PayrollTableActions';

interface PayrollTableMobileProps {
  payrolls: any[];
  onEdit: (payroll: any) => void;
  onDelete: (id: string) => void;
  onOpenApprovalDialog: (payroll: any) => void;
  onOpenPaymentDialog: (payroll: any) => void;
}

const PayrollTableMobile: React.FC<PayrollTableMobileProps> = ({
  payrolls,
  onEdit,
  onDelete,
  onOpenApprovalDialog,
  onOpenPaymentDialog
}) => {
  if (payrolls.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500 text-sm">
            沒有找到相關的薪資記錄
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      {payrolls.map((payroll) => (
        <Card key={payroll.id} className="mb-3">
          <CardContent className="p-3">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium text-sm">
                  {payroll.staff?.name || '未知員工'}
                </h3>
                <p className="text-xs text-gray-500">
                  {payroll.staff?.position} · {payroll.staff?.department}
                </p>
              </div>
              <Badge className={getPayrollStatusColor(payroll.status)}>
                {getPayrollStatusText(payroll.status)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div>
                <span className="text-gray-500">薪資期間:</span>
                <p className="font-medium">
                  {payroll.pay_period_start} ~ {payroll.pay_period_end}
                </p>
              </div>
              <div>
                <span className="text-gray-500">實發薪資:</span>
                <p className="font-medium text-green-600">
                  {formatCurrency(payroll.net_salary)}
                </p>
              </div>
            </div>
            
            <PayrollTableActions
              payroll={payroll}
              isMobile={true}
              onEdit={onEdit}
              onDelete={onDelete}
              onOpenApprovalDialog={onOpenApprovalDialog}
              onOpenPaymentDialog={onOpenPaymentDialog}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PayrollTableMobile;
