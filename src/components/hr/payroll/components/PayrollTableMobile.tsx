
import React from 'react';
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
      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="text-center text-gray-700">
          <p className="text-lg font-medium">沒有找到相關的薪資記錄</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payrolls.map((payroll) => (
        <div key={payroll.id} className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">
                  {payroll.staff?.name || '未知員工'}
                </h3>
                <p className="text-sm text-gray-700 font-medium mt-1">
                  {payroll.staff?.position} · {payroll.staff?.department}
                </p>
              </div>
              <Badge className={`${getPayrollStatusColor(payroll.status)} shadow-md`}>
                {getPayrollStatusText(payroll.status)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/30 rounded-lg p-3">
                <span className="text-gray-700 font-medium block mb-1">薪資期間</span>
                <p className="font-semibold text-gray-900">
                  {payroll.pay_period_start} ~ {payroll.pay_period_end}
                </p>
              </div>
              <div className="bg-white/30 rounded-lg p-3">
                <span className="text-gray-700 font-medium block mb-1">實發薪資</span>
                <p className="font-bold text-green-700 text-lg">
                  {formatCurrency(payroll.net_salary)}
                </p>
              </div>
            </div>
            
            <div className="bg-white/20 rounded-lg p-3 border border-white/20">
              <PayrollTableActions
                payroll={payroll}
                isMobile={true}
                onEdit={onEdit}
                onDelete={onDelete}
                onOpenApprovalDialog={onOpenApprovalDialog}
                onOpenPaymentDialog={onOpenPaymentDialog}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PayrollTableMobile;
