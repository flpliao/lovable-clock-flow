
import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ApprovalHeaderProps {
  refreshData: () => void;
  refreshing: boolean;
}

const ApprovalHeader: React.FC<ApprovalHeaderProps> = ({ refreshData, refreshing }) => {
  return (
    <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-md">核准中心</h1>
            <p className="text-white/80 font-medium drop-shadow-sm">Approval Center - 待審核申請管理</p>
          </div>
        </div>
        <Button onClick={refreshData} disabled={refreshing} className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          重新整理
        </Button>
      </div>
    </div>
  );
};

export default ApprovalHeader;
