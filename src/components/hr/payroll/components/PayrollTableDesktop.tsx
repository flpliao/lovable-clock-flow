
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card>
      <CardHeader>
        <CardTitle>薪資記錄列表</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>員工</TableHead>
              <TableHead>部門/職位</TableHead>
              <TableHead>薪資期間</TableHead>
              <TableHead>基本薪資</TableHead>
              <TableHead>應發薪資</TableHead>
              <TableHead>實發薪資</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrolls.map((payroll) => (
              <TableRow key={payroll.id}>
                <TableCell className="font-medium">
                  {payroll.staff?.name || '未知員工'}
                </TableCell>
                <TableCell>
                  <div>
                    <div>{payroll.staff?.department}</div>
                    <div className="text-sm text-gray-500">{payroll.staff?.position}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {payroll.pay_period_start}<br />
                    ~ {payroll.pay_period_end}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(payroll.base_salary)}
                </TableCell>
                <TableCell className="font-medium text-green-600">
                  {formatCurrency(payroll.gross_salary)}
                </TableCell>
                <TableCell className="font-medium text-blue-600">
                  {formatCurrency(payroll.net_salary)}
                </TableCell>
                <TableCell>
                  <Badge className={getPayrollStatusColor(payroll.status)}>
                    {getPayrollStatusText(payroll.status)}
                  </Badge>
                </TableCell>
                <TableCell>
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
          <div className="text-center py-8 text-gray-500">
            沒有找到相關的薪資記錄
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PayrollTableDesktop;
