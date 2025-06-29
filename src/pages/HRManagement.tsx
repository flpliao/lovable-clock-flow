
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, DollarSign, TrendingUp } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import PayrollManagement from '@/components/hr/PayrollManagement';
import SalaryStructureManagement from '@/components/hr/SalaryStructureManagement';
import RLSOptimizationReport from '@/components/performance/RLSOptimizationReport';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';

const HRManagement = () => {
  const { isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('payroll');

  if (!isAdmin()) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2 text-white">無權限訪問</h2>
        <p className="text-white/70 font-medium drop-shadow-md">您沒有權限訪問 HR 管理功能</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-white drop-shadow-md">HR 管理</h1>
      </div>

      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/20 backdrop-blur-xl border border-white/30">
            <TabsTrigger
              value="payroll"
              className="flex items-center gap-2 text-white/80 data-[state=active]:text-white data-[state=active]:bg-white/30"
            >
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">薪資管理</span>
              <span className="sm:hidden">薪資</span>
            </TabsTrigger>
            <TabsTrigger
              value="salary"
              className="flex items-center gap-2 text-white/80 data-[state=active]:text-white data-[state=active]:bg-white/30"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">薪資結構</span>
              <span className="sm:hidden">結構</span>
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center gap-2 text-white/80 data-[state=active]:text-white data-[state=active]:bg-white/30"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">系統效能</span>
              <span className="sm:hidden">效能</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="payroll" className="mt-0">
              <PayrollManagement />
            </TabsContent>

            <TabsContent value="salary" className="mt-0">
              <SalaryStructureManagement />
            </TabsContent>

            <TabsContent value="performance" className="mt-0">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">系統效能監控</h2>
                  <p className="text-white/80">監控 RLS 政策優化狀況和資料庫效能</p>
                </div>
                <PerformanceMonitor />
                <RLSOptimizationReport />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default HRManagement;
