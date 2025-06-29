import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Database, Shield, TrendingUp } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { LanguageManagement } from '@/components/i18n/components/LanguageManagement';
import RLSOptimizationReport from '@/components/performance/RLSOptimizationReport';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';

const SystemSettings = () => {
  const { isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('general');

  if (!isAdmin()) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2 text-white">無權限訪問</h2>
        <p className="text-white/70 font-medium drop-shadow-md">您沒有權限訪問系統設定</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-white drop-shadow-md">系統設定</h1>
      </div>

      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-xl border border-white/30">
            <TabsTrigger
              value="general"
              className="flex items-center gap-2 text-white/80 data-[state=active]:text-white data-[state=active]:bg-white/30"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">一般設定</span>
              <span className="sm:hidden">一般</span>
            </TabsTrigger>
            <TabsTrigger
              value="language"
              className="flex items-center gap-2 text-white/80 data-[state=active]:text-white data-[state=active]:bg-white/30"
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">語言設定</span>
              <span className="sm:hidden">語言</span>
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center gap-2 text-white/80 data-[state=active]:text-white data-[state=active]:bg-white/30"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">效能監控</span>
              <span className="sm:hidden">效能</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2 text-white/80 data-[state=active]:text-white data-[state=active]:bg-white/30"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">安全設定</span>
              <span className="sm:hidden">安全</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="general" className="mt-0">
              <Card className="backdrop-blur-xl bg-white/30 border border-white/40">
                <CardHeader>
                  <CardTitle className="text-white">一般系統設定</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80">一般系統設定功能開發中...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="language" className="mt-0">
              <LanguageManagement />
            </TabsContent>

            <TabsContent value="performance" className="mt-0">
              <div className="space-y-6">
                <PerformanceMonitor />
                <RLSOptimizationReport />
              </div>
            </TabsContent>

            <TabsContent value="security" className="mt-0">
              <Card className="backdrop-blur-xl bg-white/30 border border-white/40">
                <CardHeader>
                  <CardTitle className="text-white">安全設定</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80">安全設定功能開發中...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SystemSettings;
