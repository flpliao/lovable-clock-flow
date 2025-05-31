
import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Plus, History } from 'lucide-react';
import OvertimeRequestForm from '@/components/overtime/OvertimeRequestForm';
import OvertimeHistory from '@/components/overtime/OvertimeHistory';

const OvertimeManagement = () => {
  const { currentUser } = useUser();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-3 space-y-4">
        <div className="text-center">
          <h1 className="text-xl font-bold flex items-center justify-center">
            <Clock className="h-5 w-5 mr-2 text-purple-600" />
            加班管理
          </h1>
          <p className="text-sm text-gray-600 mt-1">申請加班、查詢加班記錄</p>
        </div>
        
        <Tabs defaultValue="request" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 h-auto">
            <TabsTrigger value="request" className="text-xs p-2 flex flex-col items-center gap-1">
              <Plus className="h-3 w-3" />
              <span>申請加班</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs p-2 flex flex-col items-center gap-1">
              <History className="h-3 w-3" />
              <span>加班記錄</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="request">
            <OvertimeRequestForm />
          </TabsContent>
          
          <TabsContent value="history">
            <OvertimeHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default OvertimeManagement;
