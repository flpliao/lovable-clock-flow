
import React from 'react';
import { formatCurrency } from '@/utils/payrollUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Clock, CheckCircle, DollarSign } from 'lucide-react';

interface PayrollStatsProps {
  stats: any;
  isLoading: boolean;
}

const PayrollStats: React.FC<PayrollStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl shadow-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-16 mb-2 bg-white/30" />
                <Skeleton className="h-6 w-20 bg-white/30" />
              </div>
              <Skeleton className="h-8 w-8 rounded-xl bg-white/30" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl shadow-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70">總記錄</p>
            <h3 className="text-xl font-bold text-white drop-shadow-md">{stats.total}</h3>
          </div>
          <div className="p-2 bg-blue-500/70 rounded-xl shadow-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
      
      <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl shadow-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70">待核准</p>
            <h3 className="text-xl font-bold text-white drop-shadow-md">{stats.pending}</h3>
          </div>
          <div className="p-2 bg-orange-500/70 rounded-xl shadow-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
      
      <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl shadow-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70">已發放</p>
            <h3 className="text-xl font-bold text-white drop-shadow-md">{stats.paid}</h3>
          </div>
          <div className="p-2 bg-green-500/70 rounded-xl shadow-lg">
            <CheckCircle className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
      
      <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl shadow-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/70">總薪資</p>
            <h3 className="text-lg font-bold text-white drop-shadow-md">
              {formatCurrency(stats.totalNet)}
            </h3>
          </div>
          <div className="p-2 bg-purple-500/70 rounded-xl shadow-lg">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollStats;
