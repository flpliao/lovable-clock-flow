import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, TrendingUp } from 'lucide-react';

interface LeaveTypeStatsCardsProps {
  stats: {
    total: number;
    active: number;
    paid: number;
  };
}

export function LeaveTypeStatsCards({ stats }: LeaveTypeStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700">總假別數</CardTitle>
          <div className="p-2 bg-blue-500/90 rounded-lg shadow-sm">
            <FileText className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
          <p className="text-slate-600 text-xs mt-1">個假別類型</p>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700">已啟用</CardTitle>
          <div className="p-2 bg-emerald-500/90 rounded-lg shadow-sm">
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-700">{stats.active}</div>
          <p className="text-slate-600 text-xs mt-1">可使用假別</p>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-sm bg-white/80 border border-white/40 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-700">有薪假別</CardTitle>
          <div className="p-2 bg-amber-500/90 rounded-lg shadow-sm">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-700">{stats.paid}</div>
          <p className="text-slate-600 text-xs mt-1">帶薪休假</p>
        </CardContent>
      </Card>
    </div>
  );
}
