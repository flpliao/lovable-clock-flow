
import { useUser } from '@/contexts/UserContext';
import { LeaveRequest } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const useLeaveApproval = () => {
  const { annualLeaveBalance, setAnnualLeaveBalance } = useUser();
  
  // Handle approve action
  const handleApprove = (leaveRequest: LeaveRequest, comment: string, onRequestChange: (updatedRequest: LeaveRequest) => void) => {
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
        status: 'approved' as const,
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
  
  // Handle reject action
  const handleReject = (leaveRequest: LeaveRequest, reason: string, onRequestChange: (updatedRequest: LeaveRequest) => void) => {
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
    
    const updatedRequest: LeaveRequest = {
      ...leaveRequest,
      status: 'rejected' as const,
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
  
  return { handleApprove, handleReject };
};
