
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StaffManagement from '@/components/staff/StaffManagement';
import DepartmentManagement from '@/components/departments/DepartmentManagement';
import PositionManagement from '@/components/positions/PositionManagement';
import { Users, Building, Briefcase, UserCheck, Settings, Database } from 'lucide-react';
import { StaffManagementProvider } from '@/contexts/StaffManagementContext';

const PersonnelManagement = () => {
  const { currentUser, isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('staff');
  
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

      <StaffManagementProvider>
        <div className="relative z-10">
          <main className="p-2 sm:p-4 lg:p-6">
            {/* 頁面標題區域 */}
            <div className="mb-6">
              <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-purple-400/50">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white drop-shadow-md">
                        人員與部門管理
                      </h1>
                      <p className="text-white/80 text-sm mt-1">管理組織架構、人員資料與職位權限</p>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-3">
                    <div className="p-2 bg-green-500/60 rounded-lg shadow-md backdrop-blur-xl border border-green-400/40">
                      <Database className="h-4 w-4 text-white" />
                    </div>
                    <div className="p-2 bg-orange-500/60 rounded-lg shadow-md backdrop-blur-xl border border-orange-400/40">
                      <Settings className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 標籤導航 */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
              <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-4">
                <TabsList className="grid w-full grid-cols-3 bg-white/20 rounded-xl">
                  <TabsTrigger 
                    value="staff" 
                    className="text-white data-[state=active]:bg-white/40 data-[state=active]:text-white rounded-lg flex items-center gap-2"
                  >
                    <UserCheck className="h-4 w-4" />
                    人員組織
                  </TabsTrigger>
                  <TabsTrigger 
                    value="departments" 
                    className="text-white data-[state=active]:bg-white/40 data-[state=active]:text-white rounded-lg flex items-center gap-2"
                  >
                    <Building className="h-4 w-4" />
                    部門門市
                  </TabsTrigger>
                  <TabsTrigger 
                    value="positions" 
                    className="text-white data-[state=active]:bg-white/40 data-[state=active]:text-white rounded-lg flex items-center gap-2"
                  >
                    <Briefcase className="h-4 w-4" />
                    職位管理
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="staff" className="mt-0">
                <StaffManagement />
              </TabsContent>
              
              <TabsContent value="departments" className="mt-0">
                <DepartmentManagement />
              </TabsContent>
              
              <TabsContent value="positions" className="mt-0">
                <PositionManagement />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </StaffManagementProvider>
    </div>
  );
};

export default PersonnelManagement;
