import { Building2, Database, Settings } from 'lucide-react';
import React from 'react';

export const CompanyBranchHeader: React.FC = () => {
  return (
    <div className="mb-6">
      <div className="backdrop-blur-xl bg-white/25 border border-white/30 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/80 rounded-xl shadow-lg backdrop-blur-xl border border-blue-400/50">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-md">公司單位與打卡管理</h1>
              <p className="text-white/80 text-sm mt-1">可編輯單位與打卡資訊</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
