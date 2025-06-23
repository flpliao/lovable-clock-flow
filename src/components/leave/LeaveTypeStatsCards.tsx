
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';

interface LeaveTypeStatsCardsProps {
  stats: {
    total: number;
    active: number;
    paid: number;
    systemDefault: number;
  };
}

export function LeaveTypeStatsCards({ stats }: LeaveTypeStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
      <Card className="backdrop-blur-xl bg-white/60 border-0 shadow-xl rounded-3xl hover:bg-white/70 transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">總假別數</CardTitle>
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg text-white">
            <FileText className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-slate-800 mb-1">{stats.total}</div>
          <p className="text-slate-600 text-sm">個假別類型</p>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur-xl bg-white/60 border-0 shadow-xl rounded-3xl hover:bg-white/70 transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">已啟用</CardTitle>
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg text-white">
            <CheckCircle className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-700 mb-1">{stats.active}</div>
          <p className="text-slate-600 text-sm">可使用假別</p>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur-xl bg-white/60 border-0 shadow-xl rounded-3xl hover:bg-white/70 transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">有薪假別</CardTitle>
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg text-white">
            <TrendingUp className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-700 mb-1">{stats.paid}</div>
          <p className="text-slate-600 text-sm">帶薪休假</p>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur-xl bg-white/60 border-0 shadow-xl rounded-3xl hover:bg-white/70 transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">系統預設</CardTitle>
          <div className="p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl shadow-lg text-white">
            <AlertCircle className="h-5 w-5" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-violet-700 mb-1">{stats.systemDefault}</div>
          <p className="text-slate-600 text-sm">內建假別</p>
        </CardContent>
      </Card>
    </div>
  );
}
