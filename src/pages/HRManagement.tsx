import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, DollarSign } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import PayrollManagement from '@/components/hr/PayrollManagement';
import SalaryStructureManagement from '@/components/hr/SalaryStructureManagement';

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
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{animationDelay: '4s'}}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{animationDelay: '6s'}}></div>

      <div className="relative z-10 w-full px-4 lg:px-8 pt-24 md:pt-28 pb-8">
        <div className="space-y-6">
          <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            <h1 className="text-2xl font-bold text-white drop-shadow-md">HR 管理</h1>
          </div>

          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/20 backdrop-blur-xl border border-white/30">
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
              </TabsList>

              <div className="mt-6">
                <TabsContent value="payroll" className="mt-0">
                  <PayrollManagement />
                </TabsContent>

                <TabsContent value="salary" className="mt-0">
                  <SalaryStructureManagement />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRManagement;
