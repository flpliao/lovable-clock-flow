
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Calculator, FileText } from 'lucide-react';
import { formatCurrency } from '@/utils/payrollUtils';

const PayrollStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">總薪資支出</p>
              <p className="text-lg font-bold text-green-600">{formatCurrency(1380000)}</p>
            </div>
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">已計算</p>
              <p className="text-lg font-bold text-blue-600">15</p>
            </div>
            <Calculator className="h-6 w-6 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">已核准</p>
              <p className="text-lg font-bold text-green-600">8</p>
            </div>
            <FileText className="h-6 w-6 text-green-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600">已發放</p>
              <p className="text-lg font-bold text-purple-600">5</p>
            </div>
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollStats;
