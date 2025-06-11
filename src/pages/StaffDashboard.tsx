
import React, { useState } from 'react';
import StaffAnalyticsDashboard from '@/components/staff/StaffAnalyticsDashboard';
import TeamCheckInManagement from '@/components/staff/TeamCheckInManagement';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffManagementProvider } from '@/contexts/StaffManagementContext';
import { BarChart3, Clock, Users, Activity } from 'lucide-react';

const StaffDashboard = () => {
  const { currentUser, isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Allow admin users to access this page
  if (!currentUser || !isAdmin()) {
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

      <StaffManagementProvider>
        <div className="relative z-10">
          <main className="p-2 sm:p-4 lg:p-6 pt-8 sm:pt-12 lg:pt-16">
            {/* 頁面標題區域 */}
            <div className="mb-10">
              <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl shadow-xl p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/70 rounded-2xl shadow-lg backdrop-blur-xl border border-blue-400/30">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white drop-shadow-md">
                        員工考勤儀表板
                      </h1>
                      <p className="text-white/80 text-sm mt-1">管理所有員工考勤數據及分析</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-3">
                    <div className="p-2 bg-green-500/60 rounded-lg shadow-md backdrop-blur-xl border border-green-400/40">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                    <div className="p-2 bg-orange-500/60 rounded-lg shadow-md backdrop-blur-xl border border-orange-400/40">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 標籤導航 */}
            <div className="backdrop-blur-xl bg-white/20 border border-white/20 rounded-3xl shadow-xl p-6 mb-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/15 rounded-xl h-12">
                  <TabsTrigger 
                    value="analytics" 
                    className="text-white data-[state=active]:bg-white/30 data-[state=active]:text-white rounded-lg flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    數據分析
                  </TabsTrigger>
                  <TabsTrigger 
                    value="check-ins" 
                    className="text-white data-[state=active]:bg-white/30 data-[state=active]:text-white rounded-lg flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    打卡管理
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* 內容區域 - 直接顯示在主背景上 */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="analytics" className="mt-0">
                <StaffAnalyticsDashboard />
              </TabsContent>
              
              <TabsContent value="check-ins" className="mt-0">
                <TeamCheckInManagement />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </StaffManagementProvider>
    </div>
  );
};

export default StaffDashboard;
