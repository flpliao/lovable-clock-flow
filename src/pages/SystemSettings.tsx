
import React, { useState } from 'react';
import { Settings, Globe, Shield, Database, CheckCircle2, AlertCircle, Wrench, Languages, Server, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComprehensiveDiagnostics } from '@/components/company/diagnostics/ComprehensiveDiagnostics';
import { RLSSettingsCard } from '@/components/company/components/RLSSettingsCard';
import { LanguageManagement } from '@/components/i18n/components/LanguageManagement';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen pt-20 md:pt-24">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>

      <div className="relative z-10 w-full">
        {/* 頁面標題區域 */}
        <div className="w-full px-0 sm:px-4 lg:px-8 pt-4 pb-4">
          <div className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 border border-white/40 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50 text-white">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 drop-shadow-sm">
                  系統設定
                </h1>
                <p className="text-gray-700 font-medium drop-shadow-sm text-sm mt-1">管理系統配置、安全設定和多語言支援</p>
              </div>
            </div>
          </div>
        </div>

        {/* 標籤導航 */}
        <div className="w-full px-0 sm:px-4 lg:px-8 pb-6">
          <div className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 border border-white/40 rounded-2xl shadow-lg p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/30 rounded-xl h-auto p-1">
                <TabsTrigger 
                  value="general" 
                  className="text-gray-900 data-[state=active]:bg-white/60 data-[state=active]:text-gray-900 rounded-lg flex flex-col items-center gap-1 py-3 px-2 text-xs"
                >
                  <div className="p-1.5 bg-purple-500/90 rounded-lg shadow-md">
                    <Settings className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">一般設定</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="i18n" 
                  className="text-gray-900 data-[state=active]:bg-white/60 data-[state=active]:text-gray-900 rounded-lg flex flex-col items-center gap-1 py-3 px-2 text-xs"
                >
                  <div className="p-1.5 bg-green-500/90 rounded-lg shadow-md">
                    <Globe className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">語系管理</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="diagnostics" 
                  className="text-gray-900 data-[state=active]:bg-white/60 data-[state=active]:text-gray-900 rounded-lg flex flex-col items-center gap-1 py-3 px-2 text-xs"
                >
                  <div className="p-1.5 bg-orange-500/90 rounded-lg shadow-md">
                    <Wrench className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">診斷工具</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* 內容區域 - 直接顯示在主背景上 */}
        <div className="w-full px-0 sm:px-4 lg:px-8 pb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="general" className="mt-0">
              <div className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 border border-white/40 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-500/90 rounded-xl shadow-lg border border-purple-400/50">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 drop-shadow-sm">安全設定</h2>
                    <p className="text-gray-700 font-medium drop-shadow-sm text-sm">資料庫安全政策配置</p>
                  </div>
                </div>
                <RLSSettingsCard />
              </div>
            </TabsContent>
            
            <TabsContent value="i18n" className="mt-0">
              <div className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 border border-white/40 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-500/90 rounded-xl shadow-lg border border-green-400/50">
                    <Languages className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 drop-shadow-sm">多語言支援</h2>
                    <p className="text-gray-700 font-medium drop-shadow-sm text-sm">系統語言和本地化設定</p>
                  </div>
                </div>
                <LanguageManagement />
              </div>
            </TabsContent>

            <TabsContent value="diagnostics" className="mt-0">
              <div className="backdrop-blur-2xl bg-gradient-to-br from-white/70 to-white/50 border border-white/40 rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-500/90 rounded-xl shadow-lg border border-orange-400/50">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 drop-shadow-sm">系統診斷</h2>
                    <p className="text-gray-700 font-medium drop-shadow-sm text-sm">系統狀態檢查和連線測試</p>
                  </div>
                </div>
                <ComprehensiveDiagnostics />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
