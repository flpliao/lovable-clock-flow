import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import StaffManagement from '@/components/staff/StaffManagement';
import DepartmentManagement from '@/components/departments/DepartmentManagement';
import PositionManagement from '@/components/positions/PositionManagement';
import { Users, Building, Briefcase, UserCheck, Settings, Database, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { StaffManagementProvider } from '@/contexts/StaffManagementContext';
import { DataSyncManager } from '@/utils/dataSync';
const PersonnelManagement = () => {
  const {
    currentUser,
    isAdmin
  } = useUser();
  const [activeTab, setActiveTab] = useState('staff');
  const [syncStatus, setSyncStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  if (!currentUser || !(isAdmin() || currentUser.department === 'HR')) {
    return <Navigate to="/login" />;
  }

  // 檢查系統同步狀態
  useEffect(() => {
    const checkSyncStatus = async () => {
      console.log('🔍 檢查系統前後台同步狀態...');
      const isConnected = await DataSyncManager.checkBackendConnection();
      setSyncStatus(isConnected ? 'connected' : 'disconnected');
      if (isConnected) {
        setLastSyncTime(new Date().toLocaleString('zh-TW'));
        console.log('✅ 系統前後台連線正常');
      } else {
        console.log('❌ 系統前後台連線異常');
      }
    };
    checkSyncStatus();
  }, []);

  // 手動同步資料
  const handleManualSync = async () => {
    console.log('🔄 使用者觸發手動同步');
    setSyncStatus('checking');
    const syncResult = await DataSyncManager.performFullSync();
    if (syncResult.connectionStatus) {
      setSyncStatus('connected');
      setLastSyncTime(new Date().toLocaleString('zh-TW'));
      console.log('✅ 手動同步完成');
    } else {
      setSyncStatus('disconnected');
      console.log('❌ 手動同步失敗');
    }
  };
  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'checking':
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'disconnected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };
  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'checking':
        return '檢查中...';
      case 'connected':
        return `已連線 (${lastSyncTime})`;
      case 'disconnected':
        return '連線異常';
    }
  };
  return <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
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

      <StaffManagementProvider>
        <div className="relative z-10 w-full">
          {/* 頁面標題區域 */}
          <div className="w-full px-4 lg:px-8 pt-32 md:pt-36 pb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/70 rounded-2xl shadow-lg backdrop-blur-xl border border-purple-400/30">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white drop-shadow-md">
                    人員與部門管理
                  </h1>
                  <p className="text-white/80 text-sm mt-1">管理組織架構、人員資料與職位權限</p>
                </div>
              </div>
              
              {/* 系統同步狀態顯示 */}
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 p-2 bg-white/20 rounded-lg shadow-md backdrop-blur-xl border border-white/30">
                  {getSyncStatusIcon()}
                  <span className="text-white text-sm font-medium">{getSyncStatusText()}</span>
                </div>
                
              </div>
            </div>
            
            {/* 手機版同步狀態 */}
            <div className="md:hidden mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 p-2 bg-white/20 rounded-lg shadow-md backdrop-blur-xl border border-white/30">
                {getSyncStatusIcon()}
                <span className="text-white text-sm font-medium">{getSyncStatusText()}</span>
              </div>
              <Button onClick={handleManualSync} variant="outline" size="sm" disabled={syncStatus === 'checking'} className="bg-white/25 border-white/40 text-white hover:bg-white/35">
                <RefreshCw className={`h-4 w-4 ${syncStatus === 'checking' ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>

          {/* 標籤導航 */}
          <div className="w-full px-4 lg:px-8 pb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/30 backdrop-blur-xl rounded-xl border border-white/30 p-1 mb-6">
                <TabsTrigger value="staff" className="text-gray-800 data-[state=active]:bg-white/60 data-[state=active]:text-gray-900 data-[state=active]:shadow-md rounded-lg font-medium transition-all duration-200 py-2 px-4 flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  人員組織
                </TabsTrigger>
                <TabsTrigger value="departments" className="text-gray-800 data-[state=active]:bg-white/60 data-[state=active]:text-gray-900 data-[state=active]:shadow-md rounded-lg font-medium transition-all duration-200 py-2 px-4 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  部門門市
                </TabsTrigger>
                <TabsTrigger value="positions" className="text-gray-800 data-[state=active]:bg-white/60 data-[state=active]:text-gray-900 data-[state=active]:shadow-md rounded-lg font-medium transition-all duration-200 py-2 px-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  職位管理
                </TabsTrigger>
              </TabsList>
              
              {/* 內容區域 */}
              <div>
                <TabsContent value="staff" className="mt-0">
                  <StaffManagement />
                </TabsContent>
                
                <TabsContent value="departments" className="mt-0">
                  <DepartmentManagement />
                </TabsContent>
                
                <TabsContent value="positions" className="mt-0">
                  <PositionManagement />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </StaffManagementProvider>
    </div>;
};
export default PersonnelManagement;