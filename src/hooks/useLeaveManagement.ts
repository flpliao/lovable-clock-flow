import { useState, useEffect } from 'react';
import { LeaveRequest } from '@/types';
import { useUser } from '@/contexts/UserContext';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from '@/components/ui/use-toast';

// Mock data - in a real app this would come from API
const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '4',
    user_id: '1',
    start_date: '2024-04-10',
    end_date: '2024-04-12',
    leave_type: 'annual',
    status: 'pending',
    hours: 24,
    reason: '個人休假',
    approval_level: 1,
    current_approver: '2',
    created_at: '2024-04-03T08:00:00Z',
    updated_at: '2024-04-03T08:00:00Z',
    approvals: [
      {
        id: '1',
        leave_request_id: '4',
        approver_id: '2',
        approver_name: '王小明',
        status: 'pending',
        level: 1
      },
      {
        id: '2',
        leave_request_id: '4',
        approver_id: '3',
        approver_name: '李經理',
        status: 'pending',
        level: 2
      },
      {
        id: '3',
        leave_request_id: '4',
        approver_id: '4',
        approver_name: '人事部 張小姐',
        status: 'pending',
        level: 3
      }
    ]
  },
  {
    id: '1',
    user_id: '1',
    start_date: '2023-10-15',
    end_date: '2023-10-16',
    leave_type: 'annual',
    status: 'approved',
    hours: 16,
    reason: '個人休假',
    created_at: '2023-10-10T08:00:00Z',
    updated_at: '2023-10-12T10:30:00Z'
  },
  {
    id: '2',
    user_id: '1',
    start_date: '2023-11-20',
    end_date: '2023-11-20',
    leave_type: 'sick',
    status: 'approved',
    hours: 8,
    reason: '感冒就醫',
    created_at: '2023-11-18T09:00:00Z',
    updated_at: '2023-11-19T14:20:00Z'
  },
  {
    id: '3',
    user_id: '1',
    start_date: '2023-12-25',
    end_date: '2023-12-25',
    leave_type: 'personal',
    status: 'rejected',
    hours: 8,
    reason: '家庭事務',
    rejection_reason: '該日期為重要會議日',
    created_at: '2023-12-20T11:00:00Z',
    updated_at: '2023-12-21T16:45:00Z'
  }
];

export const useLeaveManagement = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [currentLeaveRequest, setCurrentLeaveRequest] = useState<LeaveRequest | null>(null);
  const { currentUser, annualLeaveBalance, setAnnualLeaveBalance } = useUser();
  const { addNotification } = useNotifications();

  // Initialize current leave request (pending one)
  useEffect(() => {
    const pendingRequest = leaveRequests.find(
      request => request.user_id === currentUser?.id && request.status === 'pending'
    );
    setCurrentLeaveRequest(pendingRequest || null);
  }, [leaveRequests, currentUser?.id]);

  // Get leave history for current user
  const getLeaveHistory = () => {
    return leaveRequests.filter(request => request.user_id === currentUser?.id);
  };

  // Get pending requests for approval (where current user is an approver)
  const getPendingApprovals = () => {
    return leaveRequests.filter(request => 
      request.status === 'pending' && 
      request.approvals?.some(approval => 
        approval.approver_id === currentUser?.id && 
        approval.level === request.approval_level
      )
    );
  };

  // Create new leave request
  const createLeaveRequest = (newRequest: LeaveRequest) => {
    const updatedRequests = [...leaveRequests, newRequest];
    setLeaveRequests(updatedRequests);
    setCurrentLeaveRequest(newRequest);
    
    // Send notification to the first approver
    if (newRequest.approvals && newRequest.approvals.length > 0) {
      const firstApprover = newRequest.approvals.find(a => a.level === 1);
      if (firstApprover) {
        addNotification({
          title: '請假申請等待審核',
          message: `有新的請假申請需要您的審核`,
          type: 'leave_approval',
          data: {
            leaveRequestId: newRequest.id,
            userId: firstApprover.approver_id,
            actionRequired: true
          }
        });
      }
    }
    
    toast({
      title: "請假申請已送出",
      description: `請假時數: ${newRequest.hours} 小時，等待主管審核`,
    });
  };

  // Update leave request (for approvals/rejections)
  const updateLeaveRequest = (updatedRequest: LeaveRequest) => {
    const updatedRequests = leaveRequests.map(request =>
      request.id === updatedRequest.id ? updatedRequest : request
    );
    setLeaveRequests(updatedRequests);
    
    // Update current leave request if it's the same one
    if (currentLeaveRequest?.id === updatedRequest.id) {
      setCurrentLeaveRequest(updatedRequest);
    }

    // If it's annual leave and approved, deduct from balance
    if (updatedRequest.status === 'approved' && 
        updatedRequest.leave_type === 'annual' && 
        annualLeaveBalance) {
      const daysToDeduct = updatedRequest.hours / 8;
      const updatedBalance = {
        ...annualLeaveBalance,
        used_days: annualLeaveBalance.used_days + daysToDeduct
      };
      setAnnualLeaveBalance(updatedBalance);
    }
  };

  // Get specific leave request by ID
  const getLeaveRequestById = (id: string) => {
    return leaveRequests.find(request => request.id === id);
  };

  // Check if current user is approver for a specific request
  const isApproverForRequest = (request: LeaveRequest) => {
    if (!currentUser || !request.approvals) return false;
    
    return request.approvals.some(
      approval => approval.level === request.approval_level && 
                 approval.approver_id === currentUser.id
    );
  };

  return {
    leaveRequests,
    currentLeaveRequest,
    getLeaveHistory,
    getPendingApprovals,
    createLeaveRequest,
    updateLeaveRequest,
    getLeaveRequestById,
    isApproverForRequest
  };
};
