
import React from 'react';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ApproverInfo {
  id: string;
  name: string;
  position: string;
  level: number;
  status?: 'pending' | 'approved' | 'rejected';
}

interface LeaveApprovalWorkflowProps {
  approvers: ApproverInfo[];
  currentLevel?: number;
}

export function LeaveApprovalWorkflow({ approvers, currentLevel = 1 }: LeaveApprovalWorkflowProps) {
  // Calculate approval progress percentage
  const approvedCount = approvers.filter(a => a.status === 'approved').length;
  const progressPercentage = (approvedCount / approvers.length) * 100;

  // Sort approvers by level to ensure correct display order
  const sortedApprovers = [...approvers].sort((a, b) => a.level - b.level);
  
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">審核流程</h3>
        <span className="text-xs text-muted-foreground">
          {approvedCount} / {approvers.length} 已完成
        </span>
      </div>

      <Progress value={progressPercentage} className="h-2" />
      
      <div className="space-y-3 mt-4">
        {/* Vertical line connecting approval steps */}
        <div className="relative">
          <div className="absolute left-3.5 top-2 bottom-0 w-0.5 bg-gray-200 h-[calc(100%-16px)]" />
          
          {sortedApprovers.map((approver, index) => (
            <div 
              key={approver.id} 
              className={cn(
                "relative flex items-start mb-4",
                index + 1 < currentLevel ? "opacity-70" : ""
              )}
            >
              {/* Status indicator */}
              <div className="relative z-10 mr-3">
                {approver.status === 'approved' ? (
                  <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                ) : approver.status === 'rejected' ? (
                  <div className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="h-4 w-4 text-red-600" />
                  </div>
                ) : approver.level === currentLevel ? (
                  <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                ) : (
                  <div className="h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-gray-400" />
                  </div>
                )}
              </div>

              {/* Approver details */}
              <div className="flex-1">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{approver.name}</span>
                    <span className={cn(
                      "ml-2 text-xs px-2 py-0.5 rounded-full",
                      approver.status === 'approved' ? "bg-green-50 text-green-700" :
                      approver.status === 'rejected' ? "bg-red-50 text-red-700" :
                      approver.level === currentLevel ? "bg-amber-50 text-amber-700" :
                      "bg-gray-50 text-gray-700"
                    )}>
                      {approver.status === 'approved' ? '已核准' : 
                       approver.status === 'rejected' ? '已拒絕' : 
                       approver.level === currentLevel ? '審核中' : '等待中'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 mt-0.5">
                    {approver.position}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-2 flex items-center">
        <AlertCircle className="h-3 w-3 mr-1" />
        請假審核將按照以上流程進行，所有審核人同意後才會核准。
      </p>
    </div>
  );
}
