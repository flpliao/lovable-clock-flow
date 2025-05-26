
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLeaveManagementContext } from '@/contexts/LeaveManagementContext';
import { LeaveRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import Header from '@/components/Header';
import LeaveRequestDetail from '@/components/LeaveRequestDetail';
import { useNotifications } from '@/hooks/useNotifications';
import { toast } from '@/hooks/use-toast';

const LeaveApprovalView = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { getLeaveRequestById, isApproverForRequest } = useLeaveManagementContext();
  const { addNotification } = useNotifications();
  const [leaveRequest, setLeaveRequest] = useState<LeaveRequest | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (requestId) {
      const request = getLeaveRequestById(requestId);
      setLeaveRequest(request || null);
    }
    setLoading(false);
  }, [requestId, getLeaveRequestById]);
  
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
        isApprover={isApproverForRequest(leaveRequest)}
      />
    </div>
  );
};

export default LeaveApprovalView;
