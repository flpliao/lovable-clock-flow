
import React from 'react';
import { formatCurrency } from '@/utils/payrollUtils';

interface PayrollSummaryProps {
  grossSalary: number;
  netSalary: number;
}

const PayrollSummary: React.FC<PayrollSummaryProps> = ({
  grossSalary,
  netSalary
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">應發薪資: </span>
          <span className="text-green-600">{formatCurrency(grossSalary)}</span>
        </div>
        <div>
          <span className="font-medium">實發薪資: </span>
          <span className="text-blue-600 font-bold">{formatCurrency(netSalary)}</span>
        </div>
      </div>
    </div>
  );
};

export default PayrollSummary;
