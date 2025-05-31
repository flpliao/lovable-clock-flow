
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Clock, DollarSign, Settings, Globe } from 'lucide-react';
import AttendanceExceptionManagement from '@/components/attendance/AttendanceExceptionManagement';
import OvertimeManagement from '@/components/hr/OvertimeManagement';
import PayrollManagement from '@/components/hr/PayrollManagement';
import SalaryStructureManagement from '@/components/hr/SalaryStructureManagement';

const HRManagement = () => {
  const { currentUser, isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('exceptions');
  
  if (!currentUser || !(isAdmin() || currentUser.department === 'HR')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-3 space-y-4">
        <div className="text-center">
          <h1 className="text-xl font-bold flex items-center justify-center">
            <Users className="h-5 w-5 mr-2 text-green-600" />
            人事管理系統
          </h1>
          <p className="text-sm text-gray-600 mt-1">管理考勤異常、加班、薪資等人事相關事務</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-4 h-auto">
            <TabsTrigger value="exceptions" className="text-xs p-2 flex flex-col items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>異常</span>
            </TabsTrigger>
            <TabsTrigger value="overtime" className="text-xs p-2 flex flex-col items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>加班</span>
            </TabsTrigger>
            <TabsTrigger value="payroll" className="text-xs p-2 flex flex-col items-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span>薪資</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs p-2 flex flex-col items-center gap-1">
              <Settings className="h-3 w-3" />
              <span>設定</span>
            </TabsTrigger>
            <TabsTrigger value="i18n" className="text-xs p-2 flex flex-col items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>語系</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="exceptions">
            <AttendanceExceptionManagement />
          </TabsContent>
          
          <TabsContent value="overtime">
            <OvertimeManagement />
          </TabsContent>
          
          <TabsContent value="payroll">
            <div className="space-y-4">
              <PayrollManagement />
              <SalaryStructureManagement />
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
