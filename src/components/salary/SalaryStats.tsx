import { formatCurrency } from '@/utils/payrollUtils';
import { CheckCircle, Clock, DollarSign, FileText, TrendingUp } from 'lucide-react';
import React from 'react';

interface SalaryStatsProps {
  total: number;
  pending: number;
  paid: number;
  totalNet: number;
}

const SalaryStats: React.FC<SalaryStatsProps> = ({ total, pending, paid, totalNet }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-500/70 rounded-xl shadow-lg">
          <TrendingUp className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white drop-shadow-md">統計資料</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl shadow-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">總記錄</p>
              <h3 className="text-xl font-bold text-white drop-shadow-md">{total}</h3>
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
              <h3 className="text-xl font-bold text-white drop-shadow-md">{pending}</h3>
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
              <h3 className="text-xl font-bold text-white drop-shadow-md">{paid}</h3>
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
                {formatCurrency(totalNet)}
              </h3>
            </div>
            <div className="p-2 bg-purple-500/70 rounded-xl shadow-lg">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryStats;
