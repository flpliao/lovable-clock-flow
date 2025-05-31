
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/payrollUtils';
import { Skeleton } from '@/components/ui/skeleton';

interface PayrollStatsProps {
  stats: any;
  isLoading: boolean;
}

const PayrollStats: React.FC<PayrollStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-3">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      <Card>
        <CardContent className="p-3">
          <div className="text-center">
            <p className="text-xs text-gray-600">總記錄</p>
            <p className="text-lg font-bold text-blue-600">{stats.total}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3">
          <div className="text-center">
            <p className="text-xs text-gray-600">待核准</p>
            <p className="text-lg font-bold text-orange-600">{stats.pending}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3">
          <div className="text-center">
            <p className="text-xs text-gray-600">已發放</p>
            <p className="text-lg font-bold text-green-600">{stats.paid}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-3">
          <div className="text-center">
            <p className="text-xs text-gray-600">總薪資</p>
            <p className="text-sm font-bold text-purple-600">
              {formatCurrency(stats.totalNet)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayrollStats;
