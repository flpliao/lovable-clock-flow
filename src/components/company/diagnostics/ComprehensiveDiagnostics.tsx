
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConnectionDiagnostics } from './ConnectionDiagnostics';
import { SecurityDiagnostics } from './components/SecurityDiagnostics';
import { Database, Shield, Wifi } from 'lucide-react';

export const ComprehensiveDiagnostics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('connection');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">系統診斷工具</h2>
        <p className="text-gray-600">
          全面檢查系統連線狀況、安全性設定和資料完整性
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connection" className="flex items-center">
            <Database className="h-4 w-4 mr-2" />
            連線診斷
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            安全性診斷
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="connection" className="mt-6">
          <ConnectionDiagnostics />
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <SecurityDiagnostics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
