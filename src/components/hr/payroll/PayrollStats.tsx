
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Calculator, FileText } from 'lucide-react';
import { formatCurrency } from '@/utils/payrollUtils';

const PayrollStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">總薪資支出</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(1380000)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">已計算</p>
              <p className="text-2xl font-bold text-blue-600">15</p>
            </div>
            <Calculator className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">已核准</p>
              <p className="text-2xl font-bold text-green-600">8</p>
            </div>
            <FileText className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">已發放</p>
              <p className="text-2xl font-bold text-purple-600">5</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollStats;
