
import { useUser } from '@/contexts/UserContext';
import { useNotifications } from '@/hooks/useNotifications';
import { LeaveRequest } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const useLeaveApproval = () => {
  const { annualLeaveBalance, setAnnualLeaveBalance } = useUser();
  const { addNotification } = useNotifications();
  
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
      
      // Send notification to the original applicant
      addNotification({
        title: '請假已核准',
        message: '您的請假申請已獲得所有主管核准',
        type: 'leave_status',
        data: {
          leaveRequestId: leaveRequest.id,
          userId: leaveRequest.user_id
        }
      });
      
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
      
      // Send notification to the original applicant about progress
      addNotification({
        title: '請假審核進度更新',
        message: `您的請假申請已通過第${leaveRequest.approval_level}級審核，正在等待下一級主管審核`,
        type: 'leave_status',
        data: {
          leaveRequestId: leaveRequest.id,
          userId: leaveRequest.user_id
        }
      });
      
      // Send notification to the next approver
      addNotification({
        title: '請假申請等待審核',
        message: `有新的請假申請需要您的審核`,
        type: 'leave_approval',
        data: {
          leaveRequestId: leaveRequest.id,
          userId: updatedApprovals[nextLevelIndex].approver_id,
          actionRequired: true
        }
      });
      
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
    
    // Send notification to the original applicant
    addNotification({
      title: '請假已拒絕',
      message: `您的請假申請已被拒絕，拒絕原因：${reason}`,
      type: 'leave_status',
      data: {
        leaveRequestId: leaveRequest.id,
        userId: leaveRequest.user_id
      }
    });
    
    toast({
      title: "請假已拒絕",
      description: "已通知申請人",
      variant: "destructive"
    });
    
    onRequestChange(updatedRequest);
  };
  
  return { handleApprove, handleReject };
};
