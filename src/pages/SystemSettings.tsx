import CheckInDistanceSettings from '@/components/company/components/CheckInDistanceSettings';
import GoogleMapsApiKeySettings from '@/components/company/components/GoogleMapsApiKeySettings';
import { LanguageManagement } from '@/components/i18n/components/LanguageManagement';
import { useIsAdmin } from '@/hooks/useStores';
import { Globe, MapPin, Settings, Shield } from 'lucide-react';
import { useState } from 'react';

const SystemSettings = () => {
  const isAdmin = useIsAdmin();
  const [activeTab, setActiveTab] = useState('general');

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 text-center max-w-md">
              <div className="p-4 bg-red-500/90 rounded-2xl shadow-lg backdrop-blur-xl border border-red-400/30 text-white w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold mb-3 text-white">無權限訪問</h2>
              <p className="text-white/80">您沒有權限訪問系統設定</p>
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
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 text-center">
              <div className="p-4 bg-blue-500/90 rounded-2xl shadow-lg backdrop-blur-xl border border-blue-400/30 text-white w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Settings className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">功能開發中</h3>
              <p className="text-white/80">一般系統設定功能正在開發中，敬請期待</p>
            </div>
          </div>
        );
      
      case 'location':
        return (
          <div className="space-y-6">
            <CheckInDistanceSettings />
            <GoogleMapsApiKeySettings />
          </div>
        );
      
      case 'language':
        return (
          <div className="space-y-6">
            <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl">
              <LanguageManagement />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 relative overflow-hidden">
      {/* 背景光效 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-pink-400/10 via-transparent to-transparent"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        {/* 頁面標題 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">系統設定</h1>
          <p className="text-xl text-white/80">管理系統配置和設定</p>
        </div>

        {/* 主要內容區域 */}
        <div className="backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* 標籤導航 */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 backdrop-blur-xl border ${
                      isActive 
                        ? 'bg-white/20 border-white/40 text-white shadow-lg' 
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${
                      isActive 
                        ? 'bg-white/20' 
                        : 'bg-white/10'
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-sm">{tab.label}</div>
                      <div className="text-xs opacity-80 hidden sm:block">{tab.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
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
