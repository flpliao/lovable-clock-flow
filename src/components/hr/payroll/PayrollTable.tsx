
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Check, X, DollarSign, Clock } from 'lucide-react';
import { formatCurrency, getPayrollStatusText, getPayrollStatusColor } from '@/utils/payrollUtils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import PayrollApprovalDialog from './dialogs/PayrollApprovalDialog';
import PayrollPaymentDialog from './dialogs/PayrollPaymentDialog';

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

  const handleOpenApprovalDialog = (payroll: any) => {
    setApprovalDialog({ open: true, payroll });
  };

  const handleOpenPaymentDialog = (payroll: any) => {
    setPaymentDialog({ open: true, payroll });
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
                  <Button 
                    size="sm" 
                    className="text-xs bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleOpenApprovalDialog(payroll)}
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    核准
                  </Button>
                )}
                
                {payroll.status === 'approved' && (
                  <Button 
                    size="sm" 
                    className="text-xs bg-green-600 hover:bg-green-700"
                    onClick={() => handleOpenPaymentDialog(payroll)}
                  >
                    <DollarSign className="h-3 w-3 mr-1" />
                    發放
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

        <PayrollApprovalDialog
          open={approvalDialog.open}
          onOpenChange={(open) => setApprovalDialog({ open, payroll: null })}
          payroll={approvalDialog.payroll}
          onApprove={(comment) => onApprove(approvalDialog.payroll.id, comment)}
          onReject={(comment) => onReject(approvalDialog.payroll.id, comment)}
        />

        <PayrollPaymentDialog
          open={paymentDialog.open}
          onOpenChange={(open) => setPaymentDialog({ open, payroll: null })}
          payroll={paymentDialog.payroll}
          onConfirmPayment={(paymentData) => onMarkAsPaid(paymentDialog.payroll.id, paymentData)}
        />
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
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleOpenApprovalDialog(payroll)}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {payroll.status === 'approved' && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleOpenPaymentDialog(payroll)}
                      >
                        <DollarSign className="h-4 w-4" />
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

        <PayrollApprovalDialog
          open={approvalDialog.open}
          onOpenChange={(open) => setApprovalDialog({ open, payroll: null })}
          payroll={approvalDialog.payroll}
          onApprove={(comment) => onApprove(approvalDialog.payroll?.id, comment)}
          onReject={(comment) => onReject(approvalDialog.payroll?.id, comment)}
        />

        <PayrollPaymentDialog
          open={paymentDialog.open}
          onOpenChange={(open) => setPaymentDialog({ open, payroll: null })}
          payroll={paymentDialog.payroll}
          onConfirmPayment={(paymentData) => onMarkAsPaid(paymentDialog.payroll?.id, paymentData)}
        />
      </CardContent>
    </Card>
  );
};

export default PayrollTable;
