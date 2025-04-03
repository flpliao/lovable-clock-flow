
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { LeaveRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import LeaveRequestDetail from '@/components/LeaveRequestDetail';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from '@/hooks/use-toast';

// Mock leave requests (in a real app, this would come from API)
const mockLeaveRequests: { [key: string]: LeaveRequest } = {
  '4': {
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
  }
};

const LeaveApprovalView = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { addNotification } = useNotifications();
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, fetch from API
    if (requestId && mockLeaveRequests[requestId]) {
      setLeaveRequest(mockLeaveRequests[requestId]);
    }
    setLoading(false);
  }, [requestId]);
  
  const handleLeaveRequestChange = (updatedRequest: LeaveRequest) => {
    setLeaveRequest(updatedRequest);
    
    // Add notification for the applicant
    if (updatedRequest.status === 'approved') {
      addNotification({
        title: '請假已核准',
        message: `您從 ${updatedRequest.start_date} 到 ${updatedRequest.end_date} 的${
          updatedRequest.leave_type === 'annual' ? '特休假' : '請假'
        }已被核准`,
        type: 'leave_status',
        data: {
          leaveRequestId: updatedRequest.id,
          userId: updatedRequest.user_id
        }
      });
      
      toast({
        title: "申請人已收到通知",
        description: "已通知申請人請假已核准"
      });
    } else if (updatedRequest.status === 'rejected') {
      addNotification({
        title: '請假已拒絕',
        message: `您從 ${updatedRequest.start_date} 到 ${updatedRequest.end_date} 的${
          updatedRequest.leave_type === 'annual' ? '特休假' : '請假'
        }已被拒絕`,
        type: 'leave_status',
        data: {
          leaveRequestId: updatedRequest.id,
          userId: updatedRequest.user_id
        }
      });
      
      toast({
        title: "申請人已收到通知",
        description: "已通知申請人請假已拒絕"
      });
    } else if (updatedRequest.status === 'pending' && updatedRequest.current_approver) {
      // Notify next approver
      addNotification({
        title: '請假申請等待審核',
        message: `有一個新的請假申請需要您審核`,
        type: 'leave_approval',
        data: {
          leaveRequestId: updatedRequest.id,
          userId: updatedRequest.current_approver,
          actionRequired: true
        }
      });
      
      toast({
        title: "下一級審核人已收到通知",
        description: "已通知下一級審核人審核此請假申請"
      });
    }
  };

  // Check if current user is an approver
  const isApprover = () => {
    if (!currentUser || !leaveRequest || !leaveRequest.approvals) return false;
    
    return leaveRequest.approvals.some(
      a => a.level === leaveRequest.approval_level && a.approver_id === currentUser.id
    );
  };
  
  if (loading) {
    return <div className="flex justify-center p-8">載入中...</div>;
  }
  
  if (!leaveRequest) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Header />
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">請假審核</h1>
        </div>
        <div className="p-8 text-center">
          <p>請假申請不存在或已被刪除</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate('/')}
          >
            返回首頁
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Header />
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">請假審核</h1>
      </div>
      
      <LeaveRequestDetail
        leaveRequest={leaveRequest}
        onRequestChange={handleLeaveRequestChange}
        isApprover={isApprover()}
      />
    </div>
  );
};

export default LeaveApprovalView;
