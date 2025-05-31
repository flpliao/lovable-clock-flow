
import React from 'react';
import { Settings } from 'lucide-react';
import { ComprehensiveDiagnostics } from '@/components/company/diagnostics/ComprehensiveDiagnostics';
import { RLSSettingsCard } from '@/components/company/components/RLSSettingsCard';

const SystemSettings = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-2 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center mb-2">
            <Settings className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-bold">系統設定</h1>
          </div>
          <p className="text-sm text-gray-600">
            管理系統各項設定與診斷工具
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* RLS 安全設定區塊 */}
          <RLSSettingsCard />
          
          {/* 系統診斷工具 */}
          <ComprehensiveDiagnostics />
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
