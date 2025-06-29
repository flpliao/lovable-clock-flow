
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFinalPermissions } from '@/hooks/useFinalPermissions';
import RLSPerformanceMonitor from './RLSPerformanceMonitor';
import PermissionTestPanel from './PermissionTestPanel';
import { Settings, TestTube, Database, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  const { isAdmin } = useFinalPermissions();
  const [activeTab, setActiveTab] = useState('performance');

  if (!isAdmin()) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2 text-white">無權限訪問</h2>
        <p className="text-white/70 font-medium drop-shadow-md">您沒有權限訪問管理員儀表板</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <h1 className="text-2xl font-bold text-white drop-shadow-md">管理員儀表板</h1>
      </div>

      <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-lg p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/20 backdrop-blur-xl border border-white/30">
            <TabsTrigger
              value="performance"
              className="flex items-center gap-2 text-white/80 data-[state=active]:text-white data-[state=active]:bg-white/30"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">效能監控</span>
              <span className="sm:hidden">效能</span>
            </TabsTrigger>
            <TabsTrigger
              value="testing"
              className="flex items-center gap-2 text-white/80 data-[state=active]:text-white data-[state=active]:bg-white/30"
            >
              <TestTube className="h-4 w-4" />
              <span className="hidden sm:inline">測試驗證</span>
              <span className="sm:hidden">測試</span>
            </TabsTrigger>
            <TabsTrigger
              value="database"
              className="flex items-center gap-2 text-white/80 data-[state=active]:text-white data-[state=active]:bg-white/30"
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">資料庫</span>
              <span className="sm:hidden">DB</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="performance" className="mt-0">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">RLS 效能監控</h2>
                  <p className="text-white/80">監控資料庫行級安全性政策的效能狀況</p>
                </div>
                <RLSPerformanceMonitor />
              </div>
            </TabsContent>

            <TabsContent value="testing" className="mt-0">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">權限測試與驗證</h2>
                  <p className="text-white/80">執行完整的權限測試和系統遷移驗證</p>
                </div>
                <PermissionTestPanel />
              </div>
            </TabsContent>

            <TabsContent value="database" className="mt-0">
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">資料庫管理</h2>
                  <p className="text-white/80">資料庫設定和進階管理功能</p>
                </div>
                {/* 這裡可以加入其他資料庫管理組件 */}
                <div className="p-8 text-center text-white/60">
                  <Database className="h-12 w-12 mx-auto mb-4" />
                  <p>資料庫管理功能開發中...</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
