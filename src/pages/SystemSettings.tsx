
import React from 'react';
import { Settings } from 'lucide-react';
import { ComprehensiveDiagnostics } from '@/components/company/diagnostics/ComprehensiveDiagnostics';
import { RLSSettingsCard } from '@/components/company/components/RLSSettingsCard';

const SystemSettings = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-1">
      <div className="space-y-2">
        <div className="flex items-center mb-2">
          <Settings className="h-4 w-4 mr-2 text-blue-600" />
          <h1 className="text-base font-bold">系統設定</h1>
        </div>

        <div className="space-y-2">
          <RLSSettingsCard />
          <ComprehensiveDiagnostics />
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
