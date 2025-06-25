
import { useState, useEffect } from 'react';
import { OvertimeRequest } from '@/types/overtime';
import { useUser } from '@/contexts/UserContext';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from '@/components/ui/use-toast';

// Mock data - in a real app this would come from API
const mockOvertimeRequests: OvertimeRequest[] = [
  {
    id: '4',
    user_id: '1',
    overtime_date: '2024-04-10',
    start_time: '18:00',
    end_time: '21:00',
    hours: 3,
    reason: '專案趕工',
    status: 'pending',
    approval_level: 1,
    current_approver: '2',
    created_at: '2024-04-03T08:00:00Z',
    updated_at: '2024-04-03T08:00:00Z',
    approvals: [
      {
        id: '1',
        overtime_request_id: '4',
        approver_id: '2',
        approver_name: '王小明',
        status: 'pending',
        level: 1
      },
      {
        id: '2',
        overtime_request_id: '4',
        approver_id: '3',
        approver_name: '李經理',
        status: 'pending',
        level: 2
      },
      {
        id: '3',
        overtime_request_id: '4',
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
    overtime_date: '2023-10-15',
    start_time: '18:00',
    end_time: '20:00',
    hours: 2,
    reason: '緊急處理客戶問題',
    status: 'approved',
    created_at: '2023-10-10T08:00:00Z',
    updated_at: '2023-10-12T10:30:00Z'
  },
  {
    id: '2',
    user_id: '1',
    overtime_date: '2023-11-20',
    start_time: '19:00',
    end_time: '22:00',
    hours: 3,
    reason: '月底結帳作業',
    status: 'approved',
    created_at: '2023-11-18T09:00:00Z',
    updated_at: '2023-11-19T14:20:00Z'
  },
  {
    id: '3',
    user_id: '1',
    overtime_date: '2023-12-25',
    start_time: '18:00',
    end_time: '21:00',
    hours: 3,
    reason: '系統維護',
    status: 'rejected',
    rejection_reason: '聖誕節當日不建議加班',
    created_at: '2023-12-20T11:00:00Z',
    updated_at: '2023-12-21T16:45:00Z'
  }
];

export const useOvertimeManagement = () => {
  const [overtimeRequests, setOvertimeRequests] = useState<OvertimeRequest[]>(mockOvertimeRequests);
  const [currentOvertimeRequest, setCurrentOvertimeRequest] = useState<OvertimeRequest | null>(null);
  const { currentUser } = useUser();
  const { addNotification } = useNotifications();

  // Initialize current overtime request (pending one)
  useEffect(() => {
    const pendingRequest = overtimeRequests.find(
      request => request.user_id === currentUser?.id && request.status === 'pending'
    );
    setCurrentOvertimeRequest(pendingRequest || null);
  }, [overtimeRequests, currentUser?.id]);

  // Get overtime history for current user
  const getOvertimeHistory = () => {
    return overtimeRequests.filter(request => request.user_id === currentUser?.id);
  };

  // Get pending requests for approval (where current user is an approver)
  const getPendingApprovals = () => {
    return overtimeRequests.filter(request => 
      request.status === 'pending' && 
      request.approvals?.some(approval => 
        approval.approver_id === currentUser?.id && 
        approval.level === request.approval_level
      )
    );
  };

  // Create new overtime request
  const createOvertimeRequest = (newRequest: OvertimeRequest) => {
    const updatedRequests = [...overtimeRequests, newRequest];
    setOvertimeRequests(updatedRequests);
    setCurrentOvertimeRequest(newRequest);
    
    // Send notification to the first approver
    if (newRequest.approvals && newRequest.approvals.length > 0) {
      const firstApprover = newRequest.approvals.find(a => a.level === 1);
      if (firstApprover) {
        addNotification({
          title: '加班申請等待審核',
          message: `有新的加班申請需要您的審核`,
          type: 'overtime_approval',
          data: {
            overtimeRequestId: newRequest.id,
            userId: firstApprover.approver_id,
            actionRequired: true
          }
        });
      }
    }
    
    toast({
      title: "加班申請已送出",
      description: `加班時數: ${newRequest.hours} 小時，等待主管審核`,
    });
  };

  // Update overtime request (for approvals/rejections)
  const updateOvertimeRequest = (updatedRequest: OvertimeRequest) => {
    const updatedRequests = overtimeRequests.map(request =>
      request.id === updatedRequest.id ? updatedRequest : request
    );
    setOvertimeRequests(updatedRequests);
    
    // Update current overtime request if it's the same one
    if (currentOvertimeRequest?.id === updatedRequest.id) {
      setCurrentOvertimeRequest(updatedRequest);
    }
  };

  // Get specific overtime request by ID
  const getOvertimeRequestById = (id: string) => {
    return overtimeRequests.find(request => request.id === id);
  };

  // Check if current user is approver for a specific request
  const isApproverForRequest = (request: OvertimeRequest) => {
    if (!currentUser || !request.approvals) return false;
    
    return request.approvals.some(
      approval => approval.level === request.approval_level && 
                 approval.approver_id === currentUser.id
    );
  };

  return {
    overtimeRequests,
    currentOvertimeRequest,
    getOvertimeHistory,
    getPendingApprovals,
    createOvertimeRequest,
    updateOvertimeRequest,
    getOvertimeRequestById,
    isApproverForRequest
  };
};
