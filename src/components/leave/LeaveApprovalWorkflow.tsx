
import React from 'react';

interface ApproverInfo {
  id: string;
  name: string;
  position: string;
  level: number;
}

interface LeaveApprovalWorkflowProps {
  approvers: ApproverInfo[];
}

export function LeaveApprovalWorkflow({ approvers }: LeaveApprovalWorkflowProps) {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      <h3 className="text-sm font-medium">審核流程</h3>
      <div className="space-y-2">
        {approvers.map((approver, index) => (
          <div key={approver.id} className="flex items-center">
            <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">
              {index + 1}
            </div>
            <div className="ml-2">
              <span className="text-sm font-medium">{approver.name}</span>
              <span className="text-xs text-gray-500 ml-1">({approver.position})</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        請假審核將按照以上流程進行，所有審核人同意後才會核准。
      </p>
    </div>
  );
}
