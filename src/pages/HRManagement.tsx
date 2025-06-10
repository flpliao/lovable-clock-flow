
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, DollarSign, Settings, Activity, Database } from 'lucide-react';
import AttendanceExceptionManagement from '@/components/attendance/AttendanceExceptionManagement';
import OvertimeManagement from '@/components/hr/OvertimeManagement';
import PayrollManagement from '@/components/hr/PayrollManagement';
import SalaryStructureManagement from '@/components/hr/SalaryStructureManagement';

const HRManagement = () => {
  const { currentUser, isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('exceptions');
  const [payrollSubTab, setPayrollSubTab] = useState('records');
  
  if (!currentUser || !(isAdmin() || currentUser.department === 'HR')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400/35 via-blue-300/25 to-blue-200/15 relative overflow-hidden">
      {/* 動態背景元素 */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-float"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/30 rounded-full animate-float"></div>
      </div>

      <div className="relative z-10">
        <main className="p-2 sm:p-4 lg:p-6 space-y-6">
          {/* 頁面標題區域 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/70 rounded-2xl shadow-lg backdrop-blur-xl border border-green-400/30">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white drop-shadow-md">
                    薪資系統
                  </h1>
                  <p className="text-white/80 text-sm mt-1">管理考勤異常、薪資等人事相關事務</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="p-2 bg-blue-500/60 rounded-lg shadow-md backdrop-blur-xl border border-blue-400/40">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <div className="p-2 bg-purple-500/60 rounded-lg shadow-md backdrop-blur-xl border border-purple-400/40">
                  <Database className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* 主標籤導航 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl shadow-xl p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/15 rounded-xl h-12">
                <TabsTrigger 
                  value="exceptions" 
                  className="text-white data-[state=active]:bg-white/30 data-[state=active]:text-white rounded-lg flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  考勤異常
                </TabsTrigger>
                <TabsTrigger 
                  value="payroll" 
                  className="text-white data-[state=active]:bg-white/30 data-[state=active]:text-white rounded-lg flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4" />
                  薪資管理
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* 內容區域 - 直接顯示在主背景上 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="exceptions" className="mt-0">
              <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-500/70 rounded-xl shadow-lg">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white drop-shadow-md">考勤異常管理</h2>
                </div>
                <AttendanceExceptionManagement />
              </div>
            </TabsContent>
            
            <TabsContent value="payroll" className="mt-0">
              {/* 薪資子標籤 */}
              <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl shadow-xl p-4 mb-6">
                <Tabs value={payrollSubTab} onValueChange={setPayrollSubTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-white/15 rounded-xl h-12">
                    <TabsTrigger 
                      value="records" 
                      className="text-white data-[state=active]:bg-white/30 data-[state=active]:text-white rounded-lg flex items-center gap-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      薪資記錄
                    </TabsTrigger>
                    <TabsTrigger 
                      value="structure" 
                      className="text-white data-[state=active]:bg-white/30 data-[state=active]:text-white rounded-lg flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      薪資結構
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* 薪資內容區域 */}
              <Tabs value={payrollSubTab} onValueChange={setPayrollSubTab} className="w-full">
                <TabsContent value="records" className="mt-0">
                  <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl shadow-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-500/70 rounded-xl shadow-lg">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white drop-shadow-md">薪資記錄管理</h2>
                    </div>
                    <PayrollManagement />
                  </div>
                </TabsContent>
                
                <TabsContent value="structure" className="mt-0">
                  <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl shadow-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-500/70 rounded-xl shadow-lg">
                        <Settings className="h-5 w-5 text-white" />
                      </div>
                      <h2 className="text-xl font-bold text-white drop-shadow-md">薪資結構管理</h2>
                    </div>
                    <SalaryStructureManagement />
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default HRManagement;
