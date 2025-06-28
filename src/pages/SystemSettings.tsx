
import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Navigate } from 'react-router-dom';
import { Settings, Globe, Shield, Database, CheckCircle2, AlertCircle, Wrench, Languages, Server, Activity, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComprehensiveDiagnostics } from '@/components/company/diagnostics/ComprehensiveDiagnostics';
import { RLSSettingsCard } from '@/components/company/components/RLSSettingsCard';
import { LanguageManagement } from '@/components/i18n/components/LanguageManagement';
import CheckInDistanceSettings from '@/components/company/components/CheckInDistanceSettings';
import GoogleMapsApiKeySettings from '@/components/company/components/GoogleMapsApiKeySettings';

const SystemSettings = () => {
  const { currentUser, isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('general');

  // 權限檢查：只有管理員可以訪問
  if (!currentUser || !isAdmin()) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
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
        <div className="w-full px-4 lg:px-8 pt-32 md:pt-36 pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50 text-white">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-md">
                系統設定
              </h1>
              <p className="text-white/80 font-medium drop-shadow-sm text-sm mt-1">管理系統配置、安全設定和多語言支援</p>
            </div>
          </div>
        </div>

        {/* 標籤導航 */}
        <div className="w-full px-4 lg:px-8 pb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 p-1 shadow-lg h-14">
              <TabsTrigger 
                value="general" 
                className="text-gray-800 data-[state=active]:bg-white/50 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-4 text-sm data-[state=active]:backdrop-blur-xl flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                一般設定
              </TabsTrigger>
              <TabsTrigger 
                value="i18n" 
                className="text-gray-800 data-[state=active]:bg-white/50 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-4 text-sm data-[state=active]:backdrop-blur-xl flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                語系管理
              </TabsTrigger>
              <TabsTrigger 
                value="diagnostics" 
                className="text-gray-800 data-[state=active]:bg-white/50 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg rounded-xl font-semibold transition-all duration-300 py-3 px-4 text-sm data-[state=active]:backdrop-blur-xl flex items-center gap-2"
              >
                <Wrench className="h-4 w-4" />
                診斷工具
              </TabsTrigger>
            </TabsList>
            
            {/* 內容區域 */}
            <div className="mt-8">
              <TabsContent value="general" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/90 rounded-xl shadow-lg border border-green-400/50">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white drop-shadow-sm">地圖服務與GPS設定</h2>
                      <p className="text-white/80 font-medium drop-shadow-sm text-sm">GPS 轉換和地圖服務配置</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <GoogleMapsApiKeySettings />
                    <CheckInDistanceSettings />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="i18n" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/90 rounded-xl shadow-lg border border-blue-400/50">
                      <Languages className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white drop-shadow-sm">多語言支援</h2>
                      <p className="text-white/80 font-medium drop-shadow-sm text-sm">系統語言和本地化設定</p>
                    </div>
                  </div>
                  <LanguageManagement />
                </div>
              </TabsContent>

              <TabsContent value="diagnostics" className="mt-0">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/90 rounded-xl shadow-lg border border-orange-400/50">
                      <Activity className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white drop-shadow-sm">系統診斷</h2>
                      <p className="text-white/80 font-medium drop-shadow-sm text-sm">系統狀態檢查和連線測試</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <ComprehensiveDiagnostics />
                    
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/90 rounded-xl shadow-lg border border-purple-400/50">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white drop-shadow-sm">資料庫安全政策</h3>
                        <p className="text-white/80 font-medium drop-shadow-sm text-sm">資料庫安全設定和存取控制</p>
                      </div>
                    </div>
                    
                    <RLSSettingsCard />
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
