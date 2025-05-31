
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { formatCurrency, getPayrollStatusText, getPayrollStatusColor } from '@/utils/payrollUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

interface PayrollTableProps {
  payrolls: any[];
  isLoading: boolean;
  onEdit: (payroll: any) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, updates: any) => void;
}

const PayrollTable: React.FC<PayrollTableProps> = ({ 
  payrolls, 
  isLoading, 
  onEdit, 
  onDelete, 
  onUpdateStatus 
}) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleApprove = (payroll: any) => {
    onUpdateStatus(payroll.id, { 
      status: 'approved',
      approval_date: new Date().toISOString()
    });
  };

  const handleReject = (payroll: any) => {
    onUpdateStatus(payroll.id, { status: 'draft' });
  };

  const handleMarkPaid = (payroll: any) => {
    onUpdateStatus(payroll.id, { 
      status: 'paid',
      paid_date: new Date().toISOString()
    });
  };

  if (isMobile) {
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
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => onEdit(payroll)}>
                  <Edit className="h-3 w-3 mr-1" />
                  編輯
                </Button>
                
                {payroll.status === 'calculated' && (
                  <>
                    <Button size="sm" className="text-xs bg-green-600" onClick={() => handleApprove(payroll)}>
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs text-red-600" onClick={() => handleReject(payroll)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                )}
                
                {payroll.status === 'approved' && (
                  <Button size="sm" className="text-xs bg-purple-600" onClick={() => handleMarkPaid(payroll)}>
                    標記已發放
                  </Button>
                )}
                
                <Button variant="outline" size="sm" className="text-red-600 text-xs" onClick={() => onDelete(payroll.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
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
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(payroll)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {payroll.status === 'calculated' && (
                      <>
                        <Button size="sm" className="bg-green-600" onClick={() => handleApprove(payroll)}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleReject(payroll)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
                    {payroll.status === 'approved' && (
                      <Button size="sm" className="bg-purple-600" onClick={() => handleMarkPaid(payroll)}>
                        標記已發放
                      </Button>
                    )}
                    
                    <Button variant="outline" size="sm" className="text-red-600" onClick={() => onDelete(payroll.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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

export default PayrollTable;
