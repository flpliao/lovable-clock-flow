
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
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden flex justify-center items-center">
        <div className="text-white font-medium">載入中...</div>
      </div>
    );
  }
  
  if (!leaveRequest) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
        {/* 動態背景漸層 */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
        
        {/* 浮動光點效果 */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
        <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>
        
        <div className="relative z-10 container mx-auto py-8 px-4">
          <Header />
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="mr-2 backdrop-blur-xl bg-white/30 border border-white/40 text-white hover:bg-white/50 shadow-lg rounded-xl"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">請假審核</h1>
          </div>
          <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl p-8 text-center shadow-xl">
            <p className="text-white/80 font-medium drop-shadow-md mb-4">請假申請不存在或已被刪除</p>
            <Button 
              className="backdrop-blur-xl bg-white/30 border border-white/40 text-white hover:bg-white/50 shadow-lg"
              onClick={() => navigate('/')}
            >
              返回首頁
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden mobile-fullscreen">
      {/* 動態背景漸層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-3/5 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-2/3 w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '4s' }}></div>
      <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-200/40 rounded-full animate-pulse" style={{ animationDelay: '6s' }}></div>

      <div className="relative z-10 container mx-auto py-8 px-4">
        <Header />
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="mr-3 backdrop-blur-xl bg-white/30 border border-white/40 text-white hover:bg-white/50 shadow-lg rounded-xl"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">請假審核</h1>
        </div>
        
        <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
          <LeaveRequestDetail
            leaveRequest={leaveRequest}
            isApprover={isApproverForRequest(leaveRequest)}
          />
        </div>
      </div>
    </div>
  );
};

export default LeaveApprovalView;
