
import React from 'react';
import { Settings } from 'lucide-react';
import { ComprehensiveDiagnostics } from '@/components/company/diagnostics/ComprehensiveDiagnostics';

const SystemSettings = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Settings className="h-8 w-8 mr-3 text-blue-600" />
          <h1 className="text-3xl font-bold">系統設定</h1>
        </div>
        <p className="text-gray-600">
          管理系統各項設定與診斷工具
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <ComprehensiveDiagnostics />
      </div>
    </div>
  );
};

export default SystemSettings;
