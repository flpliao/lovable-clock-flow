
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, getPayrollStatusText, getPayrollStatusColor } from '@/utils/payrollUtils';
import PayrollTableActions from './PayrollTableActions';

interface PayrollTableDesktopProps {
  payrolls: any[];
  onEdit: (payroll: any) => void;
  onDelete: (id: string) => void;
  onOpenApprovalDialog: (payroll: any) => void;
  onOpenPaymentDialog: (payroll: any) => void;
}

const PayrollTableDesktop: React.FC<PayrollTableDesktopProps> = ({
  payrolls,
  onEdit,
  onDelete,
  onOpenApprovalDialog,
  onOpenPaymentDialog
}) => {
  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-white/20">
        <h3 className="text-xl font-bold text-gray-900 drop-shadow-sm">薪資記錄列表</h3>
      </div>
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/20 bg-white/10">
              <TableHead className="text-sm text-gray-900 font-bold py-4 px-6">員工</TableHead>
              <TableHead className="text-sm text-gray-900 font-bold py-4 px-4">部門/職位</TableHead>
              <TableHead className="text-sm text-gray-900 font-bold py-4 px-4">薪資期間</TableHead>
              <TableHead className="text-sm text-gray-900 font-bold py-4 px-4">基本薪資</TableHead>
              <TableHead className="text-sm text-gray-900 font-bold py-4 px-4">應發薪資</TableHead>
              <TableHead className="text-sm text-gray-900 font-bold py-4 px-4">實發薪資</TableHead>
              <TableHead className="text-sm text-gray-900 font-bold py-4 px-4">狀態</TableHead>
              <TableHead className="text-sm text-gray-900 font-bold py-4 px-6">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrolls.map((payroll) => (
              <TableRow key={payroll.id} className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                <TableCell className="font-semibold text-gray-900 py-4 px-6">
                  {payroll.staff?.name || '未知員工'}
                </TableCell>
                <TableCell className="py-4 px-4">
                  <div>
                    <div className="font-medium text-gray-900">{payroll.staff?.department}</div>
                    <div className="text-sm text-gray-700">{payroll.staff?.position}</div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4">
                  <div className="text-sm text-gray-800">
                    {payroll.pay_period_start}<br />
                    ~ {payroll.pay_period_end}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-gray-900 py-4 px-4">
                  {formatCurrency(payroll.base_salary)}
                </TableCell>
                <TableCell className="font-semibold text-green-700 py-4 px-4">
                  {formatCurrency(payroll.gross_salary)}
                </TableCell>
                <TableCell className="font-semibold text-blue-700 py-4 px-4">
                  {formatCurrency(payroll.net_salary)}
                </TableCell>
                <TableCell className="py-4 px-4">
                  <Badge className={getPayrollStatusColor(payroll.status)}>
                    {getPayrollStatusText(payroll.status)}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-6">
                  <PayrollTableActions
                    payroll={payroll}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onOpenApprovalDialog={onOpenApprovalDialog}
                    onOpenPaymentDialog={onOpenPaymentDialog}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {payrolls.length === 0 && (
          <div className="text-center py-12 text-gray-700">
            <p className="text-lg font-medium">沒有找到相關的薪資記錄</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollTableDesktop;
