
import React, { useState } from 'react';
import { Settings, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComprehensiveDiagnostics } from '@/components/company/diagnostics/ComprehensiveDiagnostics';
import { RLSSettingsCard } from '@/components/company/components/RLSSettingsCard';
import { Card, CardContent } from '@/components/ui/card';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="min-h-screen bg-gray-50 p-1">
      <div className="space-y-2">
        <div className="flex items-center mb-2">
          <Settings className="h-4 w-4 mr-2 text-blue-600" />
          <h1 className="text-base font-bold">系統設定</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 h-auto">
            <TabsTrigger value="general" className="text-xs p-2 flex flex-col items-center gap-1">
              <Settings className="h-3 w-3" />
              <span>一般設定</span>
            </TabsTrigger>
            <TabsTrigger value="i18n" className="text-xs p-2 flex flex-col items-center gap-1">
              <Globe className="h-3 w-3" />
              <span>語系管理</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="space-y-2">
              <RLSSettingsCard />
              <ComprehensiveDiagnostics />
            </div>
          </TabsContent>
          
          <TabsContent value="i18n">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-gray-500 text-sm">
                  <Globe className="h-8 w-8 mx-auto mb-3 text-blue-500" />
                  <h3 className="font-medium mb-2">多語系管理</h3>
                  <p>語系設定功能開發中...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemSettings;
