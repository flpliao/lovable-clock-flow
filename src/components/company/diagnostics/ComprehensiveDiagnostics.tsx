
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConnectionDiagnostics } from './ConnectionDiagnostics';
import { SecurityDiagnostics } from './components/SecurityDiagnostics';
import { Database, Shield } from 'lucide-react';

export const ComprehensiveDiagnostics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('connection');

  return (
    <div className="space-y-3">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-8">
          <TabsTrigger value="connection" className="flex items-center text-xs">
            <Database className="h-3 w-3 mr-1" />
            連線
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center text-xs">
            <Shield className="h-3 w-3 mr-1" />
            安全
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="connection" className="mt-2">
          <ConnectionDiagnostics />
        </TabsContent>
        
        <TabsContent value="security" className="mt-2">
          <SecurityDiagnostics />
        </TabsContent>
      </Tabs>
    </div>
  );
};
