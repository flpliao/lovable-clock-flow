
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, DollarSign, Settings, Globe } from 'lucide-react';
import AttendanceExceptionManagement from '@/components/attendance/AttendanceExceptionManagement';
import OvertimeManagement from '@/components/hr/OvertimeManagement';

const HRManagement = () => {
  const { currentUser, isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('exceptions');
  
  if (!currentUser || !(isAdmin() || currentUser.department === 'HR')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1 p-2 sm:p-3">
        <div className="mb-3">
          <h1 className="text-lg sm:text-xl font-bold flex items-center">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-green-600" />
            人事管理系統
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">管理考勤異常、加班、薪資等人事相關事務</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-3">
            <TabsTrigger value="exceptions" className="text-xs sm:text-sm">
              <Clock className="h-4 w-4 mr-1" />
              異常處理
            </TabsTrigger>
            <TabsTrigger value="overtime" className="text-xs sm:text-sm">
              <Clock className="h-4 w-4 mr-1" />
              加班管理
            </TabsTrigger>
            <TabsTrigger value="payroll" className="text-xs sm:text-sm">
              <DollarSign className="h-4 w-4 mr-1" />
              薪資管理
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">
              <Settings className="h-4 w-4 mr-1" />
              系統設定
            </TabsTrigger>
            <TabsTrigger value="i18n" className="text-xs sm:text-sm">
              <Globe className="h-4 w-4 mr-1" />
              多語系
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="exceptions">
            <AttendanceExceptionManagement />
          </TabsContent>
          
          <TabsContent value="overtime">
            <OvertimeManagement />
          </TabsContent>
          
          <TabsContent value="payroll">
            <div className="text-center py-8 text-gray-500">
              薪資管理功能開發中...
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="text-center py-8 text-gray-500">
              系統設定功能開發中...
            </div>
          </TabsContent>
          
          <TabsContent value="i18n">
            <div className="text-center py-8 text-gray-500">
              多語系管理功能開發中...
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default HRManagement;
