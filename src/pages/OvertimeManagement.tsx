
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Plus, History, Timer, Calendar, FileText } from 'lucide-react';
import OvertimeRequestForm from '@/components/overtime/OvertimeRequestForm';
import OvertimeHistory from '@/components/overtime/OvertimeHistory';
import { useUnifiedPermissions } from '@/hooks/useUnifiedPermissions';
import { OVERTIME_PERMISSIONS } from '@/components/staff/constants/permissions/overtimePermissions';
import { StaffManagementProvider } from '@/contexts/StaffManagementContext';

const OvertimeManagementContent = () => {
  const { currentUser } = useUser();
  const { hasPermission } = useUnifiedPermissions();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // 檢查加班基本權限 - 所有員工都能查看自己的加班記錄和申請加班
  const canViewOwnOvertime = hasPermission(OVERTIME_PERMISSIONS.VIEW_OWN_OVERTIME);
  const canCreateOvertime = hasPermission(OVERTIME_PERMISSIONS.CREATE_OVERTIME);

  console.log('🔐 加班權限檢查:', {
    user: currentUser.name,
    canViewOwnOvertime,
    canCreateOvertime
  });

  // 如果沒有任何加班權限，顯示權限不足（這種情況應該很少發生）
  if (!canViewOwnOvertime && !canCreateOvertime) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
        <div className="relative z-10 w-full">
          <div className="w-full px-4 lg:px-8 pt-32 md:pt-36 pb-8">
            <div className="flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 text-center">
                <Clock className="h-16 w-16 text-white/60 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">權限不足</h2>
                <p className="text-white/80">您沒有存取加班管理功能的權限</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 決定預設標籤頁：優先顯示申請頁面，如果沒有申請權限則顯示記錄頁面
  const defaultTab = canCreateOvertime ? "request" : "history";

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{
        animationDelay: '2s'
      }}></div>
      <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{
        animationDelay: '4s'
      }}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{
        animationDelay: '6s'
      }}></div>
      
      <div className="relative z-10 w-full">
        {/* 頁面標題區域 */}
        <div className="w-full px-4 lg:px-8 pt-32 md:pt-36 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">加班管理</h1>
                <p className="text-white/80 text-lg">管理您的加班申請和記錄</p>
              </div>
            </div>
          </div>
        </div>

        {/* 功能選擇區域 */}
        <div className="w-full px-4 lg:px-8 pb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500/80 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white drop-shadow-md">加班功能</h2>
          </div>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-1 shadow-lg h-14">
              {canCreateOvertime && (
                <TabsTrigger 
                  value="request" 
                  className="text-gray-800 data-[state=active]:bg-white/50 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">申請加班</span>
                  <span className="sm:hidden">申請</span>
                </TabsTrigger>
              )}
              {canViewOwnOvertime && (
                <TabsTrigger 
                  value="history" 
                  className="text-gray-800 data-[state=active]:bg-white/50 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">加班記錄</span>
                  <span className="sm:hidden">記錄</span>
                </TabsTrigger>
              )}
            </TabsList>
            
            {/* 內容區域 */}
            <div className="mt-8">
              {canCreateOvertime && (
                <TabsContent value="request" className="mt-0">
                  <OvertimeRequestForm />
                </TabsContent>
              )}
              
              {canViewOwnOvertime && (
                <TabsContent value="history" className="mt-0">
                  <OvertimeHistory />
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

const OvertimeManagement = () => {
  return (
    <StaffManagementProvider>
      <OvertimeManagementContent />
    </StaffManagementProvider>
  );
};

export default OvertimeManagement;
