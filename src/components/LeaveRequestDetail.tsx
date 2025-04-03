
import React from 'react';
import { format } from 'date-fns';
import { LeaveRequest } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LeaveApprovalFlow from './LeaveApprovalFlow';
import LeaveApprovalActions from './LeaveApprovalActions';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/components/ui/use-toast';

// Helper to get leave type in Chinese
const getLeaveTypeText = (type: string): string => {
  switch (type) {
    case 'annual': return '特休';
    case 'sick': return '病假';
    case 'personal': return '事假';
    default: return '其他';
  }
};

// Helper to get status badge color
const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" => {
  switch (status) {
    case 'approved': return 'default';
    case 'pending': return 'secondary';
    case 'rejected': return 'destructive';
    default: return 'secondary';
  }
};

// Helper to get status text in Chinese
const getStatusText = (status: string): string => {
  switch (status) {
    case 'approved': return '已核准';
    case 'pending': return '審核中';
    case 'rejected': return '已拒絕';
    default: return '未知';
  }
};

interface LeaveRequestDetailProps {
  leaveRequest: LeaveRequest;
  onRequestChange: (updatedRequest: LeaveRequest) => void;
  isApprover?: boolean;
}

const LeaveRequestDetail: React.FC<LeaveRequestDetailProps> = ({
  leaveRequest,
  onRequestChange,
  isApprover = false
}) => {
  const { annualLeaveBalance, setAnnualLeaveBalance } = useUser();
  
  // Mock function to handle approve
  const handleApprove = (comment: string) => {
    if (!leaveRequest.approvals) return;
    
    // Find the current approval that needs to be approved
    const currentApprovalIndex = leaveRequest.approvals.findIndex(
      a => a.level === leaveRequest.approval_level
    );
    
    if (currentApprovalIndex === -1) return;
    
    // Create a copy of approvals
    const updatedApprovals = [...leaveRequest.approvals];
    updatedApprovals[currentApprovalIndex] = {
      ...updatedApprovals[currentApprovalIndex],
      status: 'approved',
      comment: comment,
      approval_date: new Date().toISOString()
    };
    
    // Determine next approval level or if all are approved
    const nextLevelIndex = updatedApprovals.findIndex(
      a => a.level > leaveRequest.approval_level! && a.status === 'pending'
    );
    
    let updatedRequest: LeaveRequest;
    
    if (nextLevelIndex === -1) {
      // All levels approved
      updatedRequest = {
        ...leaveRequest,
        status: 'approved',
        approvals: updatedApprovals,
        approval_level: undefined,
        current_approver: undefined,
        updated_at: new Date().toISOString()
      };
      
      // If it's annual leave, deduct from balance
      if (leaveRequest.leave_type === 'annual' && annualLeaveBalance) {
        const daysToDeduct = leaveRequest.hours / 8;
        const updatedBalance = {
          ...annualLeaveBalance,
          used_days: annualLeaveBalance.used_days + daysToDeduct
        };
        
        setAnnualLeaveBalance(updatedBalance);
        
        toast({
          title: "請假已核准",
          description: `已從特休帳戶扣除 ${daysToDeduct.toFixed(1)} 天`,
        });
      } else {
        toast({
          title: "請假已核准",
          description: "所有審核流程已完成",
        });
      }
    } else {
      // Move to next approval level
      updatedRequest = {
        ...leaveRequest,
        approvals: updatedApprovals,
        approval_level: updatedApprovals[nextLevelIndex].level,
        current_approver: updatedApprovals[nextLevelIndex].approver_id,
        updated_at: new Date().toISOString()
      };
      
      toast({
        title: "審核成功",
        description: "請假申請已進入下一級審核",
      });
    }
    
    onRequestChange(updatedRequest);
  };
  
  // Mock function to handle reject
  const handleReject = (reason: string) => {
    if (!leaveRequest.approvals) return;
    
    // Find the current approval that needs to be approved
    const currentApprovalIndex = leaveRequest.approvals.findIndex(
      a => a.level === leaveRequest.approval_level
    );
    
    if (currentApprovalIndex === -1) return;
    
    // Create a copy of approvals
    const updatedApprovals = [...leaveRequest.approvals];
    updatedApprovals[currentApprovalIndex] = {
      ...updatedApprovals[currentApprovalIndex],
      status: 'rejected',
      comment: reason,
      approval_date: new Date().toISOString()
    };
    
    const updatedRequest = {
      ...leaveRequest,
      status: 'rejected',
      approvals: updatedApprovals,
      rejection_reason: reason,
      updated_at: new Date().toISOString()
    };
    
    toast({
      title: "請假已拒絕",
      description: "已通知申請人",
      variant: "destructive"
    });
    
    onRequestChange(updatedRequest);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">請假詳情</CardTitle>
          <Badge variant={getStatusBadgeVariant(leaveRequest.status)}>
            {getStatusText(leaveRequest.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">請假類型</p>
              <p className="font-medium">{getLeaveTypeText(leaveRequest.leave_type)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">請假時數</p>
              <p className="font-medium">{leaveRequest.hours} 小時 ({leaveRequest.hours / 8} 天)</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">開始日期</p>
              <p className="font-medium">{format(new Date(leaveRequest.start_date), 'yyyy/MM/dd')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">結束日期</p>
              <p className="font-medium">{format(new Date(leaveRequest.end_date), 'yyyy/MM/dd')}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">請假事由</p>
            <p className="bg-gray-50 p-3 rounded mt-1">{leaveRequest.reason}</p>
          </div>
          
          {leaveRequest.rejection_reason && (
            <div>
              <p className="text-sm text-muted-foreground text-red-500">拒絕原因</p>
              <p className="bg-red-50 p-3 rounded mt-1 text-red-800">{leaveRequest.rejection_reason}</p>
            </div>
          )}
          
          {leaveRequest.approvals && leaveRequest.approvals.length > 0 && (
            <LeaveApprovalFlow 
              approvals={leaveRequest.approvals} 
              currentLevel={leaveRequest.approval_level || 0}
            />
          )}
          
          {isApprover && leaveRequest.status === 'pending' && (
            <LeaveApprovalActions
              leaveRequest={leaveRequest}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveRequestDetail;
