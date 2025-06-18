
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
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>

      <div className="relative z-10 w-full">
        {/* 頁面標題區域 */}
        <div className="w-full px-4 lg:px-8 pt-32 md:pt-36 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50 text-white">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-md">
                薪資系統
              </h1>
              <p className="text-white/80 font-medium drop-shadow-sm text-sm mt-1">管理考勤異常、薪資等人事相關事務</p>
            </div>
          </div>
        </div>

        {/* 主標籤導航 */}
        <div className="w-full px-4 lg:px-8 pb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-1 shadow-lg h-14">
              <TabsTrigger 
                value="exceptions" 
                className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                考勤異常
              </TabsTrigger>
              <TabsTrigger 
                value="payroll" 
                className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                薪資管理
              </TabsTrigger>
            </TabsList>
            
            {/* 內容區域 */}
            <div className="mt-8">
              <TabsContent value="exceptions" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/90 rounded-xl shadow-lg border border-orange-400/50">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white drop-shadow-sm">考勤異常管理</h2>
                    </div>
                  </div>
                  <AttendanceExceptionManagement />
                </div>
              </TabsContent>
              
              <TabsContent value="payroll" className="mt-0">
                {/* 薪資子標籤 */}
                <div className="space-y-6">
                  <Tabs value={payrollSubTab} onValueChange={setPayrollSubTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-1 shadow-lg h-14">
                      <TabsTrigger 
                        value="records" 
                        className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
                      >
                        <DollarSign className="h-4 w-4" />
                        薪資記錄
                      </TabsTrigger>
                      <TabsTrigger 
                        value="structure" 
                        className="text-white/90 data-[state=active]:bg-white/50 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
                      >
                        <Settings className="h-4 w-4" />
                        薪資結構
                      </TabsTrigger>
                    </TabsList>

                    {/* 薪資內容區域 */}
                    <div className="mt-8">
                      <TabsContent value="records" className="mt-0">
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/90 rounded-xl shadow-lg border border-green-400/50">
                              <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-white drop-shadow-sm">薪資記錄管理</h2>
                            </div>
                          </div>
                          <PayrollManagement />
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="structure" className="mt-0">
                        <div className="space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/90 rounded-xl shadow-lg border border-blue-400/50">
                              <Settings className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-white drop-shadow-sm">薪資結構管理</h2>
                            </div>
                          </div>
                          <SalaryStructureManagement />
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HRManagement;
