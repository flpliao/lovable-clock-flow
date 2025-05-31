
import React, { useState } from 'react';
import { Settings, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComprehensiveDiagnostics } from '@/components/company/diagnostics/ComprehensiveDiagnostics';
import { RLSSettingsCard } from '@/components/company/components/RLSSettingsCard';
import { LanguageManagement } from '@/components/i18n/components/LanguageManagement';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="space-y-3">
        <div className="flex items-center mb-3">
          <Settings className="h-4 w-4 mr-2 text-blue-600" />
          <h1 className="text-lg font-bold">系統設定</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-3 h-auto">
            <TabsTrigger value="general" className="text-xs p-1.5 flex flex-col items-center gap-0.5">
              <Settings className="h-3 w-3" />
              <span>一般設定</span>
            </TabsTrigger>
            <TabsTrigger value="i18n" className="text-xs p-1.5 flex flex-col items-center gap-0.5">
              <Globe className="h-3 w-3" />
              <span>語系管理</span>
            </TabsTrigger>
            <TabsTrigger value="diagnostics" className="text-xs p-1.5 flex flex-col items-center gap-0.5">
              <Settings className="h-3 w-3" />
              <span>診斷工具</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="mt-0">
            <div className="space-y-3">
              <RLSSettingsCard />
            </div>
          </TabsContent>
          
          <TabsContent value="i18n" className="mt-0">
            <LanguageManagement />
          </TabsContent>

          <TabsContent value="diagnostics" className="mt-0">
            <div className="space-y-3">
              <ComprehensiveDiagnostics />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemSettings;
