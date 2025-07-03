import HolidayCalendar from '@/components/holiday/HolidayCalendar';
import HolidaySettings from '@/components/holiday/HolidaySettings';
import WorkHoursAnalytics from '@/components/holiday/WorkHoursAnalytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentUser, useIsAdmin } from '@/hooks/useStores';
import { BarChart3, Calendar, MapPin, Settings, Timer } from 'lucide-react';
import { useState } from 'react';
import { Navigate } from 'react-router-dom';

const HolidayManagement = () => {
  const currentUser = useCurrentUser();
  const isAdmin = useIsAdmin();
  const [activeTab, setActiveTab] = useState('calendar');
  
  if (!currentUser) {
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
        <div className="w-full px-4 lg:px-8 pt-32 md:pt-36 pb-8 py-[50px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">假日管理</h1>
                <p className="text-white/80 text-lg font-medium drop-shadow-md">管理法定假日、計算工作時數與休假統計</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <div className="p-3 bg-blue-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50">
                <Timer className="h-6 w-6 text-white" />
              </div>
              <div className="p-3 bg-green-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-green-400/50">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* 功能導航 */}
        <div className="w-full px-4 lg:px-8 pb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500/80 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white drop-shadow-md">假日功能</h2>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'} bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-1 shadow-lg h-14`}>
              <TabsTrigger value="calendar" className="text-gray-800 data-[state=active]:bg-white/50 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">假日行事曆</span>
                <span className="sm:hidden">行事曆</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-gray-800 data-[state=active]:bg-white/50 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">工時統計</span>
                <span className="sm:hidden">統計</span>
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="settings" className="text-gray-800 data-[state=active]:bg-white/50 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">假日設定</span>
                  <span className="sm:hidden">設定</span>
                </TabsTrigger>
              )}
            </TabsList>
            
            <div className="mt-8">
              <TabsContent value="calendar" className="mt-0">
                <HolidayCalendar />
              </TabsContent>
              
              <TabsContent value="analytics" className="mt-0">
                <WorkHoursAnalytics />
              </TabsContent>
              
              {isAdmin && (
                <TabsContent value="settings" className="mt-0">
                  <HolidaySettings />
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
export default HolidayManagement;