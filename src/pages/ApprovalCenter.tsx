
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useSupabaseLeaveManagement } from '@/hooks/useSupabaseLeaveManagement';
import { LeaveRequest } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, User, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { getLeaveTypeText } from '@/utils/leaveUtils';

const ApprovalCenter = () => {
  const { currentUser } = useUser();
  const { getLeaveHistory } = useSupabaseLeaveManagement();
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPendingRequests = () => {
      if (!currentUser) return;

      // 獲取需要當前用戶審核的請假申請
      const allRequests = getLeaveHistory();
      const myPendingRequests = allRequests.filter(request => 
        request.status === 'pending' && 
        request.current_approver === currentUser.id
      );

      setPendingRequests(myPendingRequests);
      setIsLoading(false);
    };

    loadPendingRequests();
  }, [currentUser, getLeaveHistory]);

  const handleApprove = async (requestId: string) => {
    // 這裡可以整合實際的審核邏輯
    console.log('核准請假申請:', requestId);
  };

  const handleReject = async (requestId: string) => {
    // 這裡可以整合實際的拒絕邏輯
    console.log('拒絕請假申請:', requestId);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-8">
              <h1 className="text-2xl font-bold text-white mb-4">請先登入</h1>
              <p className="text-white/80">您需要登入系統才能查看待審核的申請</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36">
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* 頁面標題 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-md">核准中心</h1>
                <p className="text-white/80 font-medium drop-shadow-sm">Approval Center - 待審核請假申請</p>
              </div>
            </div>
          </div>

          {/* 統計資訊 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-white mb-2">{pendingRequests.length}</div>
              <div className="text-white/80 text-sm font-medium">待審核申請</div>
            </div>
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-green-300 mb-2">0</div>
              <div className="text-white/80 text-sm font-medium">今日已核准</div>
            </div>
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-red-300 mb-2">0</div>
              <div className="text-white/80 text-sm font-medium">今日已拒絕</div>
            </div>
          </div>

          {/* 待審核申請列表 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white drop-shadow-md mb-6">待審核申請</h2>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/80">載入中...</p>
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white/60" />
                </div>
                <p className="text-white font-medium drop-shadow-sm">目前沒有待審核的申請</p>
                <p className="text-white/80 mt-1 font-medium drop-shadow-sm">所有申請都已處理完畢</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="bg-white/10 rounded-2xl p-6 border border-white/20">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <User className="h-5 w-5 text-white/80" />
                          <h3 className="text-lg font-semibold text-white">申請人員資訊</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-white/70">請假類型</span>
                            <div className="text-white font-medium">{getLeaveTypeText(request.leave_type)}</div>
                          </div>
                          <div>
                            <span className="text-white/70">請假期間</span>
                            <div className="text-white font-medium">
                              {format(new Date(request.start_date), 'MM/dd')} - {format(new Date(request.end_date), 'MM/dd')}
                            </div>
                          </div>
                          <div>
                            <span className="text-white/70">請假時數</span>
                            <div className="text-white font-medium">{request.hours} 小時</div>
                          </div>
                          <div>
                            <span className="text-white/70">申請時間</span>
                            <div className="text-white font-medium">
                              {format(new Date(request.created_at), 'MM/dd HH:mm')}
                            </div>
                          </div>
                        </div>

                        {request.reason && (
                          <div className="mt-3 p-3 bg-white/10 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="h-4 w-4 text-white/80" />
                              <span className="text-white/70 text-sm">請假原因</span>
                            </div>
                            <p className="text-white text-sm">{request.reason}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 lg:ml-6">
                        <Button
                          onClick={() => handleApprove(request.id)}
                          className="bg-green-500 hover:bg-green-600 text-white border-0"
                          size="sm"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          核准
                        </Button>
                        <Button
                          onClick={() => handleReject(request.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          拒絕
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalCenter;
