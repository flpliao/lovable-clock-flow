
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getPayrollStatusText, getPayrollStatusColor, formatCurrency } from '@/utils/payrollUtils';
import { Payroll } from '@/types/hr';
import { mockStaffData } from './mockPayrollData';
import PayrollMobileCard from './PayrollMobileCard';
import { useIsMobile } from '@/hooks/use-mobile';

interface PayrollTableProps {
  payrolls: Payroll[];
}

const PayrollTable: React.FC<PayrollTableProps> = ({ payrolls }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div>
        <h3 className="text-sm font-medium mb-3">薪資記錄 ({payrolls.length})</h3>
        {payrolls.map((payroll) => (
          <PayrollMobileCard key={payroll.id} payroll={payroll} />
        ))}
        {payrolls.length === 0 && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500 text-sm">
                沒有找到相關的薪資記錄
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>薪資記錄</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>員工</TableHead>
              <TableHead>職位/部門</TableHead>
              <TableHead>薪資期間</TableHead>
              <TableHead>基本薪資</TableHead>
              <TableHead>加班費</TableHead>
              <TableHead>津貼</TableHead>
              <TableHead>總薪資</TableHead>
              <TableHead>扣除額</TableHead>
              <TableHead>實發薪資</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrolls.map((payroll) => {
              const staffInfo = mockStaffData[payroll.staff_id as keyof typeof mockStaffData];
              return (
                <TableRow key={payroll.id}>
                  <TableCell className="font-medium">
                    {staffInfo?.name || '未知員工'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{staffInfo?.position || '未知職位'}</div>
                      <div className="text-sm text-gray-500">{staffInfo?.department || '未知部門'}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {payroll.pay_period_start} ~ {payroll.pay_period_end}
                    </div>
                  </TableCell>
                  <TableCell>{formatCurrency(payroll.base_salary)}</TableCell>
                  <TableCell>{formatCurrency(payroll.overtime_pay || 0)}</TableCell>
                  <TableCell>{formatCurrency(payroll.allowances || 0)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(payroll.gross_salary)}</TableCell>
                  <TableCell>
                    {formatCurrency((payroll.tax || 0) + (payroll.labor_insurance || 0) + (payroll.health_insurance || 0) + (payroll.deductions || 0))}
                  </TableCell>
                  <TableCell className="font-bold text-green-600">
                    {formatCurrency(payroll.net_salary)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getPayrollStatusColor(payroll.status)}>
                      {getPayrollStatusText(payroll.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        查看
                      </Button>
                      {payroll.status === 'calculated' && (
                        <Button variant="outline" size="sm" className="text-green-600">
                          核准
                        </Button>
                      )}
                      {payroll.status === 'approved' && (
                        <Button variant="outline" size="sm" className="text-purple-600">
                          發放
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
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

export default PayrollTable;
