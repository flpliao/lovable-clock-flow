
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, FileText, History } from 'lucide-react';
import OvertimeRequestForm from '@/components/overtime/OvertimeRequestForm';
import OvertimeHistory from '@/components/overtime/OvertimeHistory';
import OvertimeView from '@/components/overtime/OvertimeView';
import { useOvertimePermissions } from '@/hooks/useOvertimePermissions';
import { StaffManagementProvider } from '@/contexts/StaffManagementContext';

const OvertimeManagementContent = () => {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState<string>('request');
  const {
    canViewOwnOvertime,
    canCreateOvertime,
    canViewAllOvertime,
    canApproveOvertime,
    canManageOvertime,
    hasAnyOvertimePermission
  } = useOvertimePermissions();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  console.log('🔐 加班權限檢查:', {
    user: currentUser.name,
    canViewOwnOvertime,
    canCreateOvertime,
    canViewAllOvertime,
    canApproveOvertime,
    canManageOvertime,
    hasAnyOvertimePermission
  });

  // 如果用戶沒有任何加班相關權限
  if (!hasAnyOvertimePermission) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-red-400 via-red-500 to-red-600 relative overflow-hidden mobile-fullscreen">
        <div className="absolute inset-0 bg-gradient-to-tr from-red-400/80 via-red-500/60 to-red-600/80"></div>
        
        <div className="relative z-10 w-full flex items-center justify-center min-h-screen">
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-lg text-center max-w-md">
            <div className="w-16 h-16 bg-red-500/80 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">無加班權限</h2>
            <p className="text-white/80 mb-6">
              您目前沒有加班管理相關權限，請聯繫系統管理員。
            </p>
            <button 
              onClick={() => window.history.back()}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              返回上一頁
            </button>
          </div>
        </div>
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

        {/* 功能選擇區域 - 模仿請假管理的三個選項卡 */}
        <div className="w-full px-4 lg:px-8 pb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-1 shadow-lg h-14">
              <TabsTrigger 
                value="request" 
                className="text-gray-800 data-[state=active]:bg-white/50 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">申請加班</span>
                <span className="sm:hidden">申請</span>
              </TabsTrigger>
              <TabsTrigger 
                value="view" 
                className="text-gray-800 data-[state=active]:bg-white/50 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">查看加班</span>
                <span className="sm:hidden">查看</span>
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="text-gray-800 data-[state=active]:bg-white/50 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">加班記錄</span>
                <span className="sm:hidden">記錄</span>
              </TabsTrigger>
            </TabsList>
            
            {/* 內容區域 */}
            <div className="mt-8">
              <TabsContent value="request" className="mt-0">
                <OvertimeRequestForm />
              </TabsContent>
              
              <TabsContent value="view" className="mt-0">
                <OvertimeView />
              </TabsContent>
              
              <TabsContent value="history" className="mt-0">
                <OvertimeHistory />
              </TabsContent>
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
