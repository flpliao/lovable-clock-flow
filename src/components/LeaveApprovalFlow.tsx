
import React from 'react';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { ApprovalRecord } from '@/types';
import { cn } from '@/lib/utils';

interface LeaveApprovalFlowProps {
  approvals: ApprovalRecord[];
  currentLevel: number;
}

const LeaveApprovalFlow: React.FC<LeaveApprovalFlowProps> = ({ 
  approvals,
  currentLevel
}) => {
  // Sort approvals by level
  const sortedApprovals = [...approvals].sort((a, b) => a.level - b.level);
  
  return (
    <div className="my-6">
      <h3 className="text-sm font-medium mb-4">審核流程</h3>
      <div className="relative">
        {/* Vertical line connecting approval steps */}
        <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gray-200" />
        
        {sortedApprovals.map((approval, index) => (
          <div 
            key={approval.id} 
            className={cn(
              "relative flex items-start mb-4 pl-10",
              index + 1 < currentLevel ? "opacity-70" : ""
            )}
          >
            {/* Status indicator */}
            <div className="absolute left-0 top-0.5">
              {approval.status === 'approved' ? (
                <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              ) : approval.status === 'rejected' ? (
                <div className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="h-4 w-4 text-red-600" />
                </div>
              ) : index + 1 === currentLevel ? (
                <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
              ) : (
                <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-gray-400" />
                </div>
              )}
            </div>

            {/* Approval details */}
            <div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {approval.level === 1 ? '一級主管' : 
                   approval.level === 2 ? '二級主管' : 
                   approval.level === 3 ? '部門經理' : '人事審核'}
                </span>
                <span className="text-xs text-gray-500">
                  {approval.approver_name || '未指派'}
                </span>
              </div>
              
              {approval.status !== 'pending' && (
                <div className="mt-1 text-xs">
                  <span className="text-gray-500">
                    {approval.approval_date ? 
                      `審核時間: ${new Date(approval.approval_date).toLocaleString('zh-TW')}` : 
                      '等待審核'}
                  </span>
                  {approval.comment && (
                    <div className="mt-1 bg-gray-50 p-2 rounded">
                      <p className="text-gray-600">{approval.comment}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaveApprovalFlow;
