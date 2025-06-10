
import React from 'react';
import { Building2, Database, Settings } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const CompanyBranchHeader: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="mb-6">
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-md">
                公司基本資料與營業處管理
              </h1>
              <p className="text-white/80 text-sm mt-1">管理公司基本資料與營業處資訊</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="p-2 bg-green-500/60 rounded-lg shadow-md backdrop-blur-xl border border-green-400/40">
              <Database className="h-4 w-4 text-white" />
            </div>
            <div className="p-2 bg-purple-500/60 rounded-lg shadow-md backdrop-blur-xl border border-purple-400/40">
              <Settings className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
