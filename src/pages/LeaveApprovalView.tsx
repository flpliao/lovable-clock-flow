
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
import { visionProStyles } from '@/utils/visionProStyles';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex justify-center items-center">
        <div className="text-white font-medium">載入中...</div>
      </div>
    );
  }
  
  if (!leaveRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        {/* Vision Pro 風格背景效果 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-400/15 via-transparent to-transparent"></div>
        
        <div className="relative z-10 container mx-auto py-8 px-4">
          <Header />
          <div className="flex items-center mb-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className={`mr-2 ${visionProStyles.glassButton} border-white/40 text-white hover:bg-white/30`}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">請假審核</h1>
          </div>
          <div className={`${visionProStyles.cardBackground} rounded-3xl border border-white/30 p-8 text-center`}>
            <p className="text-white/80 font-medium drop-shadow-md mb-4">請假申請不存在或已被刪除</p>
            <Button 
              className={`${visionProStyles.glassButton} border-white/40 text-white hover:bg-white/30`}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Vision Pro 風格背景效果 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-400/15 via-transparent to-transparent"></div>
      
      {/* 浮動光點效果 */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-float"></div>
      <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400/40 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-white/30 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10 container mx-auto py-8 px-4">
        <Header />
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className={`mr-3 ${visionProStyles.glassButton} border-white/40 text-white hover:bg-white/30`}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">請假審核</h1>
        </div>
        
        <div className={`${visionProStyles.cardBackground} rounded-3xl border border-white/30 shadow-2xl overflow-hidden`}>
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
