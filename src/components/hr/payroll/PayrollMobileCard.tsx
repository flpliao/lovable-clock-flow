
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPayrollStatusText, getPayrollStatusColor, formatCurrency } from '@/utils/payrollUtils';
import { Payroll } from '@/types/hr';
import { mockStaffData } from './mockPayrollData';

interface PayrollMobileCardProps {
  payroll: Payroll;
}

const PayrollMobileCard: React.FC<PayrollMobileCardProps> = ({ payroll }) => {
  const staffInfo = mockStaffData[payroll.staff_id as keyof typeof mockStaffData];

  return (
    <Card className="mb-3">
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium text-sm">{staffInfo?.name || '未知員工'}</h3>
            <p className="text-xs text-gray-500">{staffInfo?.position} · {staffInfo?.department}</p>
          </div>
          <Badge className={getPayrollStatusColor(payroll.status)}>
            {getPayrollStatusText(payroll.status)}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div>
            <span className="text-gray-500">薪資期間:</span>
            <p className="font-medium">{payroll.pay_period_start} ~ {payroll.pay_period_end}</p>
          </div>
          <div>
            <span className="text-gray-500">實發薪資:</span>
            <p className="font-bold text-green-600">{formatCurrency(payroll.net_salary)}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-1 text-xs mb-3">
          <div>
            <span className="text-gray-500">基本:</span>
            <p>{formatCurrency(payroll.base_salary)}</p>
          </div>
          <div>
            <span className="text-gray-500">加班:</span>
            <p>{formatCurrency(payroll.overtime_pay || 0)}</p>
          </div>
          <div>
            <span className="text-gray-500">津貼:</span>
            <p>{formatCurrency(payroll.allowances || 0)}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            查看
          </Button>
          {payroll.status === 'calculated' && (
            <Button variant="outline" size="sm" className="text-green-600 text-xs">
              核准
            </Button>
          )}
          {payroll.status === 'approved' && (
            <Button variant="outline" size="sm" className="text-purple-600 text-xs">
              發放
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PayrollMobileCard;
