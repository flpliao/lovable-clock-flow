import StaffAnalyticsDashboard from '@/components/staff/StaffAnalyticsDashboard';
import TeamCheckInManagement from '@/components/staff/TeamCheckInManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaffManagementProvider } from '@/contexts/StaffManagementContext';
import { useCurrentUser } from '@/hooks/useStores';
import { permissionService } from '@/services/simplifiedPermissionService';
import { Activity, BarChart3, Clock, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const StaffDashboard = () => {
  const currentUser = useCurrentUser();
  const isAdmin = permissionService.isAdmin();
  const [activeTab, setActiveTab] = useState('analytics');

  // Allow admin users to access this page
  if (!currentUser || !isAdmin) {
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
      <div
        className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse"
        style={{ animationDelay: '2s' }}
      ></div>
      <div
        className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse"
        style={{ animationDelay: '4s' }}
      ></div>
      <div
        className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse"
        style={{ animationDelay: '6s' }}
      ></div>

      <StaffManagementProvider>
        <div className="relative z-10 w-full">
          {/* 頁面標題區域 */}
          <div className="w-full px-4 lg:px-8 pt-32 md:pt-36 pb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50 text-white">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white drop-shadow-md">員工考勤儀表板</h1>
                  <p className="text-white/80 font-medium drop-shadow-sm text-sm mt-1">
                    管理所有員工考勤數據及分析
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <div className="p-2 bg-green-500/90 rounded-lg shadow-md backdrop-blur-xl border border-green-400/50">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <div className="p-2 bg-orange-500/90 rounded-lg shadow-md backdrop-blur-xl border border-orange-400/50">
                  <Users className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* 標籤導航 */}
          <div className="w-full px-4 lg:px-8 pb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-1 shadow-lg h-14">
                <TabsTrigger
                  value="analytics"
                  className="text-gray-800 data-[state=active]:bg-white/70 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  數據分析
                </TabsTrigger>
                <TabsTrigger
                  value="check-ins"
                  className="text-gray-800 data-[state=active]:bg-white/70 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
                >
                  <Clock className="h-4 w-4" />
                  打卡管理
                </TabsTrigger>
              </TabsList>

              {/* 內容區域 - 直接顯示在淡藍色背景上，無額外卡片包裝 */}
              <div className="mt-8">
                <TabsContent value="analytics" className="mt-0">
                  <StaffAnalyticsDashboard />
                </TabsContent>

                <TabsContent value="check-ins" className="mt-0">
                  <TeamCheckInManagement />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </StaffManagementProvider>
    </div>
  );
};

export default StaffDashboard;
