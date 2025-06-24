
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { useUnifiedPermissions } from '@/hooks/useUnifiedPermissions';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Plus, History, Settings, Users } from 'lucide-react';
import OvertimeRequestForm from '@/components/overtime/OvertimeRequestForm';
import OvertimeHistory from '@/components/overtime/OvertimeHistory';
import OvertimeManagementComponent from '@/components/hr/OvertimeManagement';

const OvertimeManagement = () => {
  const { currentUser } = useUser();
  const { hasPermission, rolesLoading, isAdmin } = useUnifiedPermissions();

  console.log('🔍 加班管理頁面載入中...', {
    currentUser: currentUser?.name,
    rolesLoading,
    currentPath: window.location.pathname
  });

  if (!currentUser) {
    console.log('❌ 用戶未登入，重定向到登入頁面');
    return <Navigate to="/login" replace />;
  }

  // 等待權限載入完成
  if (rolesLoading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
        <div className="relative z-10 w-full flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">載入權限中...</div>
        </div>
      </div>
    );
  }

  // 檢查是否為廖俊雄（特殊用戶）
  const isLiaoJunxiong = currentUser?.name === '廖俊雄' && 
                        currentUser?.id === '550e8400-e29b-41d4-a716-446655440001';

  // 權限檢查 - 檢查各種加班相關權限
  const canRequestOvertime = hasPermission('overtime:request');
  const canViewOvertime = hasPermission('overtime:view') || hasPermission('overtime:view_own');
  const canManageOvertime = hasPermission('overtime:manage') || hasPermission('hr:overtime_manage');
  const canApproveOvertime = hasPermission('overtime:approve');
  const canViewAllOvertime = hasPermission('overtime:view_all');

  console.log('🔐 加班管理權限檢查結果:', {
    canRequestOvertime,
    canViewOvertime,
    canManageOvertime,
    canApproveOvertime,
    canViewAllOvertime,
    isLiaoJunxiong,
    isAdmin: isAdmin(),
    userRole: currentUser.role,
    userName: currentUser.name
  });

  // 廖俊雄或系統管理員優先顯示管理介面
  if (isLiaoJunxiong || isAdmin() || canManageOvertime || canViewAllOvertime) {
    console.log('✅ 顯示加班管理介面 (管理員/HR)');
    return <OvertimeManagementComponent />;
  }

  // 檢查是否有任何加班相關權限
  const hasAnyOvertimePermission = canRequestOvertime || canViewOvertime || canApproveOvertime;

  // 如果用戶沒有任何加班相關權限，顯示無權限提示
  if (!hasAnyOvertimePermission) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
        <div className="relative z-10 w-full flex items-center justify-center min-h-screen">
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/30">
            <Clock className="h-16 w-16 text-white/80 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">無存取權限</h2>
            <p className="text-white/80">您沒有存取加班管理功能的權限</p>
            <p className="text-white/60 text-sm mt-2">請聯繫系統管理員獲取相關權限</p>
          </div>
        </div>
      </div>
    );
  }

  // 一般員工看到個人加班功能
  const availableTabs = [];
  
  if (canRequestOvertime) {
    availableTabs.push('request');
  }
  
  if (canViewOvertime) {
    availableTabs.push('history');
  }

  const defaultTab = availableTabs[0] || 'request';

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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">加班管理</h1>
                <p className="text-white/80 text-lg">管理您的加班申請與記錄</p>
              </div>
            </div>
          </div>
        </div>

        {/* 權限提示區域 */}
        <div className="w-full px-4 lg:px-8 pb-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-2 text-white/90">
              <Users className="h-5 w-5" />
              <span className="font-medium">當前權限:</span>
              <div className="flex flex-wrap gap-2">
                {(isLiaoJunxiong || isAdmin()) && (
                  <span className="px-2 py-1 bg-red-500/20 text-red-100 rounded-lg text-sm border border-red-400/30">
                    系統管理員
                  </span>
                )}
                {canRequestOvertime && (
                  <span className="px-2 py-1 bg-green-500/20 text-green-100 rounded-lg text-sm border border-green-400/30">
                    申請加班
                  </span>
                )}
                {canViewOvertime && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-100 rounded-lg text-sm border border-blue-400/30">
                    查看記錄
                  </span>
                )}
                {canApproveOvertime && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-100 rounded-lg text-sm border border-purple-400/30">
                    審核加班
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 功能選擇區域 */}
        <div className="w-full px-4 lg:px-8 pb-8">
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className={`grid w-full grid-cols-${availableTabs.length} bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-1 shadow-lg h-14`}>
              {canRequestOvertime && (
                <TabsTrigger 
                  value="request" 
                  className="text-gray-800 data-[state=active]:bg-white/50 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-6 text-base data-[state=active]:backdrop-blur-xl flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">申請加班</span>
                  <span className="sm:hidden">申請</span>
                </TabsTrigger>
              )}
              {canViewOvertime && (
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
              {canRequestOvertime && (
                <TabsContent value="request" className="mt-0">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-1 border border-white/20">
                    <OvertimeRequestForm />
                  </div>
                </TabsContent>
              )}
              
              {canViewOvertime && (
                <TabsContent value="history" className="mt-0">
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-1 border border-white/20">
                    <OvertimeHistory />
                  </div>
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default OvertimeManagement;
