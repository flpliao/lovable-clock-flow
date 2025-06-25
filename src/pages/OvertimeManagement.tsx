
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, History, Users } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useUnifiedPermissions } from '@/hooks/useUnifiedPermissions';
import { OVERTIME_PERMISSIONS } from '@/components/staff/constants/permissions/overtimePermissions';
import OvertimeRequestForm from '@/components/overtime/OvertimeRequestForm';
import OvertimeHistory from '@/components/overtime/OvertimeHistory';

const OvertimeManagement: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { hasPermission } = useUnifiedPermissions();
  const [activeTab, setActiveTab] = useState('request');

  const handleFormSuccess = () => {
    setActiveTab('history');
  };

  // 檢查用戶權限
  const canApproveOvertime = hasPermission(OVERTIME_PERMISSIONS.APPROVE_OVERTIME_LEVEL_1);
  const canViewTeamOvertime = hasPermission(OVERTIME_PERMISSIONS.VIEW_TEAM_OVERTIME);
  
  // 管理員或具備審核權限的用戶可以看到團隊管理
  const canManageTeam = currentUser?.role === 'admin' || canApproveOvertime || canViewTeamOvertime;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
            
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">加班管理</h1>
              <p className="text-gray-600">
                {canManageTeam ? '管理員工加班申請，查看審核狀態與統計數據' : '提交加班申請，查看審核狀態與歷史記錄'}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className={`grid w-full ${canManageTeam ? 'grid-cols-3' : 'grid-cols-2'} backdrop-blur-xl bg-white/30 border border-white/30 rounded-xl p-1 h-12 mb-6`}>
                <TabsTrigger 
                  value="request" 
                  className="text-gray-800 data-[state=active]:bg-white/40 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-3 text-sm data-[state=active]:backdrop-blur-xl"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  申請加班
                </TabsTrigger>
                <TabsTrigger 
                  value="history" 
                  className="text-gray-800 data-[state=active]:bg-white/40 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-3 text-sm data-[state=active]:backdrop-blur-xl"
                >
                  <History className="h-4 w-4 mr-2" />
                  {canManageTeam ? '申請記錄' : '我的申請'}
                </TabsTrigger>
                {canManageTeam && (
                  <TabsTrigger 
                    value="management" 
                    className="text-gray-800 data-[state=active]:bg-white/40 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm rounded-lg font-medium transition-all duration-200 py-2 px-3 text-sm data-[state=active]:backdrop-blur-xl"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    團隊管理
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="request" className="mt-0">
                <OvertimeRequestForm onSuccess={handleFormSuccess} />
              </TabsContent>

              <TabsContent value="history" className="mt-0">
                <OvertimeHistory />
              </TabsContent>

              {canManageTeam && (
                <TabsContent value="management" className="mt-0">
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto text-white/60 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">團隊加班管理</h3>
                    <p className="text-white/80 mb-6">管理團隊成員的加班申請和審核流程</p>
                    <div className="text-white/60 text-sm">此功能正在開發中...</div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OvertimeManagement;
