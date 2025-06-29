
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Database, Shield, TrendingUp, Globe, MapPin } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { LanguageManagement } from '@/components/i18n/components/LanguageManagement';
import RLSOptimizationReport from '@/components/performance/RLSOptimizationReport';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';
import CheckInDistanceSettings from '@/components/company/components/CheckInDistanceSettings';
import GoogleMapsApiKeySettings from '@/components/company/components/GoogleMapsApiKeySettings';
import { RLSSettingsCard } from '@/components/company/components/RLSSettingsCard';
import { visionProStyles } from '@/utils/visionProStyles';

const SystemSettings = () => {
  const { isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState('general');

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400/35 via-blue-300/25 to-blue-200/15 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className={`${visionProStyles.liquidGlassCard} p-8 text-center max-w-md`}>
              <div className="p-4 bg-red-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-red-400/50 text-white w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold mb-3 text-gray-900 drop-shadow-sm">無權限訪問</h2>
              <p className="text-gray-700 font-medium drop-shadow-sm">您沒有權限訪問系統設定</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: 'general',
      label: '一般設定',
      icon: Settings,
      description: '基本系統設定'
    },
    {
      id: 'location',
      label: '位置設定',
      icon: MapPin,
      description: 'GPS 和地圖設定'
    },
    {
      id: 'language',
      label: '語言設定',
      icon: Globe,
      description: '多語系管理'
    },
    {
      id: 'performance',
      label: '效能監控',
      icon: TrendingUp,
      description: '系統效能分析'
    },
    {
      id: 'security',
      label: '安全設定',
      icon: Shield,
      description: 'RLS 和權限管理'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white drop-shadow-md mb-2">一般系統設定</h2>
              <p className="text-white/80">管理基本的系統配置選項</p>
            </div>
            
            <div className={`${visionProStyles.liquidGlassCard} p-8 text-center`}>
              <div className="p-4 bg-blue-500/90 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50 text-white w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Settings className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 drop-shadow-sm mb-2">功能開發中</h3>
              <p className="text-gray-700 drop-shadow-sm">一般系統設定功能正在開發中，敬請期待</p>
            </div>
          </div>
        );
      
      case 'location':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white drop-shadow-md mb-2">位置與地圖設定</h2>
              <p className="text-white/80">管理 GPS 打卡距離和 Google Maps 整合</p>
            </div>
            
            <CheckInDistanceSettings />
            <GoogleMapsApiKeySettings />
          </div>
        );
      
      case 'language':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white drop-shadow-md mb-2">多語系管理</h2>
              <p className="text-white/80">設定系統語言和地區選項</p>
            </div>
            
            <div className={visionProStyles.liquidGlassCard}>
              <LanguageManagement />
            </div>
          </div>
        );
      
      case 'performance':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white drop-shadow-md mb-2">效能監控</h2>
              <p className="text-white/80">監控系統效能和資料庫優化狀況</p>
            </div>
            
            <PerformanceMonitor />
            <RLSOptimizationReport />
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white drop-shadow-md mb-2">安全設定</h2>
              <p className="text-white/80">管理資料庫安全政策和權限控制</p>
            </div>
            
            <RLSSettingsCard />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400/35 via-blue-300/25 to-blue-200/15 relative overflow-hidden">
      {/* 背景光效 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-400/15 via-transparent to-transparent"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* 頁面標題 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-4">系統設定</h1>
          <p className="text-xl text-white/90 drop-shadow-md">管理系統配置和安全設定</p>
        </div>

        {/* 主要內容區域 */}
        <div className={`${visionProStyles.liquidGlassCard} p-8`}>
          {/* 標籤導航 */}
          <div className="mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-white/30 backdrop-blur-xl border border-white/40 rounded-2xl p-2 shadow-lg">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex flex-col items-center gap-2 py-4 px-6 text-gray-700 data-[state=active]:text-white data-[state=active]:bg-white/40 data-[state=active]:shadow-lg rounded-xl transition-all duration-300 hover:bg-white/20"
                    >
                      <Icon className="h-6 w-6" />
                      <div className="text-center">
                        <div className="font-semibold text-sm">{tab.label}</div>
                        <div className="text-xs opacity-80 hidden sm:block">{tab.description}</div>
                      </div>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>

          {/* 標籤內容 */}
          <div className="min-h-[400px]">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
