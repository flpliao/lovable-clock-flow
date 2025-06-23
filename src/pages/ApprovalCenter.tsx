import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { LeaveRequest } from '@/types';
import { MissedCheckinRequest } from '@/types/missedCheckin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, User, Calendar, FileText, RefreshCw, Eye, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { getLeaveTypeText } from '@/utils/leaveUtils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { sendLeaveStatusNotification } from '@/services/leaveNotificationService';
import { NotificationDatabaseOperations } from '@/services/notifications';
import LeaveApprovalDetail from '@/components/leave/LeaveApprovalDetail';

interface ApprovalStats {
  todayApproved: number;
  todayRejected: number;
  missedCheckinApproved: number;
  missedCheckinRejected: number;
}

interface LeaveRequestWithApplicant extends LeaveRequest {
  applicant_name?: string;
}

interface MissedCheckinWithStaff extends MissedCheckinRequest {
  staff_name?: string;
  staff_department?: string;
  staff_position?: string;
}

const ApprovalCenter = () => {
  const { currentUser, isAdmin, isManager } = useUser();
  const { toast } = useToast();
  const [pendingLeaveRequests, setPendingLeaveRequests] = useState<LeaveRequestWithApplicant[]>([]);
  const [pendingMissedCheckins, setPendingMissedCheckins] = useState<MissedCheckinWithStaff[]>([]);
  const [approvalStats, setApprovalStats] = useState<ApprovalStats>({ 
    todayApproved: 0, 
    todayRejected: 0,
    missedCheckinApproved: 0,
    missedCheckinRejected: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequestWithApplicant | null>(null);
  const [activeTab, setActiveTab] = useState('leave');

  // 載入統計資料
  const loadApprovalStats = async () => {
    if (!currentUser?.id) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // 查詢今日已核准的請假申請
      const { data: approvedLeaveData, error: approvedLeaveError } = await supabase
        .from('leave_requests')
        .select('id')
        .eq('status', 'approved')
        .gte('updated_at', `${today}T00:00:00`)
        .lt('updated_at', `${today}T23:59:59`);

      // 查詢今日已拒絕的請假申請
      const { data: rejectedLeaveData, error: rejectedLeaveError } = await supabase
        .from('leave_requests')
        .select('id')
        .eq('status', 'rejected')
        .gte('updated_at', `${today}T00:00:00`)
        .lt('updated_at', `${today}T23:59:59`);

      // 查詢今日已核准的忘記打卡申請
      const { data: approvedMissedData, error: approvedMissedError } = await supabase
        .from('missed_checkin_requests')
        .select('id')
        .eq('status', 'approved')
        .gte('updated_at', `${today}T00:00:00`)
        .lt('updated_at', `${today}T23:59:59`);

      // 查詢今日已拒絕的忘記打卡申請
      const { data: rejectedMissedData, error: rejectedMissedError } = await supabase
        .from('missed_checkin_requests')
        .select('id')
        .eq('status', 'rejected')
        .gte('updated_at', `${today}T00:00:00`)
        .lt('updated_at', `${today}T23:59:59`);

      setApprovalStats({
        todayApproved: approvedLeaveData?.length || 0,
        todayRejected: rejectedLeaveData?.length || 0,
        missedCheckinApproved: approvedMissedData?.length || 0,
        missedCheckinRejected: rejectedMissedData?.length || 0
      });

      console.log('✅ 成功載入今日審核統計');
    } catch (error) {
      console.error('❌ 載入今日審核統計時發生錯誤:', error);
    }
  };

  // 載入需要當前用戶審核的請假申請
  const loadPendingLeaveRequests = async () => {
    if (!currentUser?.id) {
      return;
    }

    console.log('🔍 載入待審核請假申請，當前用戶:', currentUser.id, currentUser.name);

    try {
      setRefreshing(true);
      
      // 查詢方式1: 查詢 current_approver 等於當前用戶的申請
      const { data: directRequests, error: directError } = await supabase
        .from('leave_requests')
        .select(`
          *,
          approval_records (*),
          staff!leave_requests_user_id_fkey(name)
        `)
        .eq('status', 'pending')
        .eq('current_approver', currentUser.id);

      if (directError) {
        console.error('❌ 查詢直接指派的申請失敗:', directError);
      }

      // 查詢方式2: 查詢審核記錄中需要當前用戶審核的申請
      const { data: approvalRequests, error: approvalError } = await supabase
        .from('approval_records')
        .select(`
          leave_request_id,
          leave_requests!inner(
            *,
            approval_records (*),
            staff!leave_requests_user_id_fkey(name)
          )
        `)
        .eq('approver_id', currentUser.id)
        .eq('status', 'pending');

      if (approvalError) {
        console.error('❌ 查詢審核記錄申請失敗:', approvalError);
      }

      // 查詢方式3: 通過主管關係查詢下屬的待審核申請
      const { data: subordinateRequests, error: subordinateError } = await supabase
        .from('leave_requests')
        .select(`
          *,
          approval_records (*),
          staff!leave_requests_user_id_fkey(name, supervisor_id)
        `)
        .eq('status', 'pending');

      if (subordinateError) {
        console.error('❌ 查詢下屬申請失敗:', subordinateError);
      }

      // 合併所有結果並去重
      const allRequests = [];
      
      // 添加直接指派的申請
      if (directRequests) {
        allRequests.push(...directRequests);
      }

      // 添加審核記錄中的申請
      if (approvalRequests) {
        approvalRequests.forEach(record => {
          if (record.leave_requests && !allRequests.some(req => req.id === record.leave_requests.id)) {
            allRequests.push(record.leave_requests);
          }
        });
      }

      // 添加下屬的申請（如果當前用戶是其主管）
      if (subordinateRequests) {
        subordinateRequests.forEach(request => {
          if (request.staff && request.staff.supervisor_id === currentUser.id) {
            if (!allRequests.some(req => req.id === request.id)) {
              allRequests.push(request);
            }
          }
        });
      }

      console.log('✅ 成功載入待審核請假申請:', allRequests.length, '筆');
      
      const formattedRequests: LeaveRequestWithApplicant[] = allRequests.map((request: any) => ({
        id: request.id,
        user_id: request.user_id || request.staff_id,
        start_date: request.start_date,
        end_date: request.end_date,
        leave_type: request.leave_type,
        status: request.status,
        hours: Number(request.hours),
        reason: request.reason,
        approval_level: request.approval_level,
        current_approver: request.current_approver,
        created_at: request.created_at,
        updated_at: request.updated_at,
        applicant_name: request.staff?.name || '未知申請人',
        approvals: (request.approval_records || []).map((approval: any) => ({
          id: approval.id,
          leave_request_id: approval.leave_request_id,
          approver_id: approval.approver_id,
          approver_name: approval.approver_name,
          status: approval.status,
          level: approval.level,
          approval_date: approval.approval_date,
          comment: approval.comment
        }))
      }));

      setPendingLeaveRequests(formattedRequests);
    } catch (error) {
      console.error('❌ 載入待審核請假申請時發生錯誤:', error);
      toast({
        title: "載入失敗",
        description: "載入待審核請假申請時發生錯誤",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // 載入待審核的忘記打卡申請
  const loadPendingMissedCheckins = async () => {
    if (!currentUser?.id) {
      return;
    }

    console.log('🔍 載入待審核忘記打卡申請，當前用戶:', currentUser.id, currentUser.name);

    try {
      const { data, error } = await supabase
        .from('missed_checkin_requests')
        .select(`
          *,
          staff:staff_id (
            name,
            department,
            position,
            branch_name,
            supervisor_id
          )
        `)
        .eq('status', 'pending');

      if (error) {
        console.error('❌ 查詢忘記打卡申請失敗:', error);
        return;
      }

      // 篩選出當前用戶需要審核的申請
      const filteredRequests = (data || []).filter(request => {
        const staff = Array.isArray(request.staff) ? request.staff[0] : request.staff;
        return staff?.supervisor_id === currentUser.id || isAdmin() || isManager();
      });

      const formattedRequests: MissedCheckinWithStaff[] = filteredRequests.map(request => {
        const staff = Array.isArray(request.staff) ? request.staff[0] : request.staff;
        return {
          ...request,
          missed_type: request.missed_type as 'check_in' | 'check_out' | 'both',
          status: request.status as 'pending' | 'approved' | 'rejected',
          staff_name: staff?.name || '未知員工',
          staff_department: staff?.department || '未知部門',
          staff_position: staff?.position || '未知職位'
        };
      });

      console.log('✅ 成功載入待審核忘記打卡申請:', formattedRequests.length, '筆');
      setPendingMissedCheckins(formattedRequests);
    } catch (error) {
      console.error('❌ 載入待審核忘記打卡申請時發生錯誤:', error);
      toast({
        title: "載入失敗",
        description: "載入待審核忘記打卡申請時發生錯誤",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      loadPendingLeaveRequests();
      loadPendingMissedCheckins();
      loadApprovalStats();
    }
  }, [currentUser?.id]);

  const handleApprove = async (request: LeaveRequestWithApplicant) => {
    try {
      console.log('🚀 開始核准請假申請:', request.id);

      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) {
        console.error('❌ 核准請假申請失敗:', error);
        toast({
          title: "核准失敗",
          description: "無法核准請假申請",
          variant: "destructive"
        });
        return;
      }

      // 更新審核記錄
      const { error: approvalError } = await supabase
        .from('approval_records')
        .update({
          status: 'approved',
          approval_date: new Date().toISOString(),
          comment: '主管核准'
        })
        .eq('leave_request_id', request.id)
        .eq('approver_id', currentUser.id);

      if (approvalError) {
        console.warn('⚠️ 更新審核記錄失敗:', approvalError);
      }

      // 發送通知給申請人
      if (request.applicant_name) {
        await sendLeaveStatusNotification(
          request.user_id,
          request.applicant_name,
          request.id,
          'approved',
          currentUser.name || '主管',
          '主管核准'
        );
      }

      console.log('✅ 請假申請核准成功');
      toast({
        title: "核准成功",
        description: "請假申請已核准",
      });

      // 重新載入待審核列表和統計
      setPendingLeaveRequests(prev => prev.filter(req => req.id !== request.id));
      loadApprovalStats();
    } catch (error) {
      console.error('❌ 核准請假申請時發生錯誤:', error);
      toast({
        title: "核准失敗",
        description: "核准請假申請時發生錯誤",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (request: LeaveRequestWithApplicant) => {
    try {
      console.log('🚀 開始拒絕請假申請:', request.id);

      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: 'rejected',
          rejection_reason: '主管拒絕',
          updated_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) {
        console.error('❌ 拒絕請假申請失敗:', error);
        toast({
          title: "拒絕失敗",
          description: "無法拒絕請假申請",
          variant: "destructive"
        });
        return;
      }

      // 更新審核記錄
      const { error: approvalError } = await supabase
        .from('approval_records')
        .update({
          status: 'rejected',
          approval_date: new Date().toISOString(),
          comment: '主管拒絕'
        })
        .eq('leave_request_id', request.id)
        .eq('approver_id', currentUser.id);

      if (approvalError) {
        console.warn('⚠️ 更新審核記錄失敗:', approvalError);
      }

      // 發送通知給申請人
      if (request.applicant_name) {
        await sendLeaveStatusNotification(
          request.user_id,
          request.applicant_name,
          request.id,
          'rejected',
          currentUser.name || '主管',
          '主管拒絕'
        );
      }

      console.log('✅ 請假申請拒絕成功');
      toast({
        title: "拒絕成功",
        description: "請假申請已拒絕",
        variant: "destructive"
      });

      // 重新載入待審核列表和統計
      setPendingLeaveRequests(prev => prev.filter(req => req.id !== request.id));
      loadApprovalStats();
    } catch (error) {
      console.error('❌ 拒絕請假申請時發生錯誤:', error);
      toast({
        title: "拒絕失敗",
        description: "拒絕請假申請時發生錯誤",
        variant: "destructive"
      });
    }
  };

  const handleMissedCheckinApproval = async (requestId: string, action: 'approved' | 'rejected', comment?: string) => {
    if (!currentUser) return;
    
    try {
      const { data: updatedRequest, error } = await supabase
        .from('missed_checkin_requests')
        .update({
          status: action,
          approved_by: currentUser.id,
          approval_comment: comment || '',
          approval_date: new Date().toISOString()
        })
        .eq('id', requestId)
        .select(`
          *,
          staff:staff_id (
            name,
            department,
            position,
            branch_name
          )
        `)
        .single();

      if (error) throw error;

      // 發送通知給申請人
      await createApplicantNotification(updatedRequest, action);

      toast({
        title: action === 'approved' ? "申請已核准" : "申請已拒絕",
        description: `忘記打卡申請已${action === 'approved' ? '核准' : '拒絕'}`
      });

      // 重新載入申請列表
      setPendingMissedCheckins(prev => prev.filter(req => req.id !== requestId));
      loadApprovalStats();
    } catch (error) {
      console.error('審核失敗:', error);
      toast({
        title: "審核失敗",
        description: "無法處理申請，請稍後重試",
        variant: "destructive"
      });
    }
  };

  const createApplicantNotification = async (requestData: any, action: 'approved' | 'rejected') => {
    try {
      const staffInfo = Array.isArray(requestData.staff) ? requestData.staff[0] : requestData.staff;
      const actionText = action === 'approved' ? '已核准' : '已被退回';
      
      await NotificationDatabaseOperations.addNotification(requestData.staff_id, {
        title: '忘記打卡申請結果',
        message: `您的忘記打卡申請${actionText} (${requestData.request_date})`,
        type: 'missed_checkin_approval',
        data: {
          missedCheckinRequestId: requestData.id,
          actionRequired: false,
          applicantName: staffInfo?.name,
          requestDate: requestData.request_date,
          missedType: requestData.missed_type
        }
      });

      console.log(`已發送忘記打卡申請結果通知給 ${staffInfo?.name}`);
    } catch (error) {
      console.error('創建申請人通知失敗:', error);
    }
  };

  const getMissedTypeText = (type: string) => {
    switch (type) {
      case 'check_in':
        return '忘記上班打卡';
      case 'check_out':
        return '忘記下班打卡';
      case 'both':
        return '忘記上下班打卡';
      default:
        return type;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '-';
    return format(new Date(timeString), 'HH:mm', { locale: zhTW });
  };

  const refreshData = () => {
    setRefreshing(true);
    Promise.all([
      loadPendingLeaveRequests(),
      loadPendingMissedCheckins(),
      loadApprovalStats()
    ]).finally(() => {
      setRefreshing(false);
    });
  };

  // 如果正在查看詳細頁面，顯示詳細審核頁面
  if (selectedRequest) {
    return (
      <LeaveApprovalDetail
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
        onApprovalComplete={() => {
          setSelectedRequest(null);
          refreshData();
        }}
      />
    );
  }

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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white drop-shadow-md">核准中心</h1>
                  <p className="text-white/80 font-medium drop-shadow-sm">統一審核請假申請與忘記打卡申請</p>
                </div>
              </div>
              <Button
                onClick={refreshData}
                disabled={refreshing}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                重新整理
              </Button>
            </div>
          </div>

          {/* 統計資訊 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-white mb-2">{pendingLeaveRequests.length}</div>
              <div className="text-white/80 text-xs font-medium">待審請假</div>
            </div>
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-300 mb-2">{pendingMissedCheckins.length}</div>
              <div className="text-white/80 text-xs font-medium">待審打卡</div>
            </div>
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-green-300 mb-2">
                {approvalStats.todayApproved + approvalStats.missedCheckinApproved}
              </div>
              <div className="text-white/80 text-xs font-medium">今日已核准</div>
            </div>
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-red-300 mb-2">
                {approvalStats.todayRejected + approvalStats.missedCheckinRejected}
              </div>
              <div className="text-white/80 text-xs font-medium">今日已拒絕</div>
            </div>
          </div>

          {/* 審核申請列表 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-white/20 border border-white/30 mb-6">
                <TabsTrigger value="leave" className="data-[state=active]:bg-white/30">
                  請假申請 ({pendingLeaveRequests.length})
                </TabsTrigger>
                <TabsTrigger value="missed-checkin" className="data-[state=active]:bg-white/30">
                  忘記打卡 ({pendingMissedCheckins.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="leave">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white/80">載入中...</p>
                  </div>
                ) : pendingLeaveRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white/60" />
                    </div>
                    <p className="text-white font-medium drop-shadow-sm">目前沒有待審核的請假申請</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingLeaveRequests.map((request) => (
                      <div key={request.id} className="bg-white/10 rounded-2xl p-6 border border-white/20">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge className="bg-blue-500/80 text-white">請假申請</Badge>
                              <User className="h-5 w-5 text-white/80" />
                              <h3 className="text-lg font-semibold text-white">{request.applicant_name}</h3>
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
                              onClick={() => setSelectedRequest(request)}
                              className="bg-blue-500 hover:bg-blue-600 text-white border-0"
                              size="sm"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              詳細審核
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="missed-checkin">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white/80">載入中...</p>
                  </div>
                ) : pendingMissedCheckins.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white/60" />
                    </div>
                    <p className="text-white font-medium drop-shadow-sm">目前沒有待審核的忘記打卡申請</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingMissedCheckins.map((request) => (
                      <div key={request.id} className="bg-white/10 rounded-2xl p-6 border border-white/20">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge className="bg-orange-500/80 text-white">忘記打卡</Badge>
                              <User className="h-5 w-5 text-white/80" />
                              <h3 className="text-lg font-semibold text-white">{request.staff_name}</h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-white/70">申請類型</span>
                                <div className="text-white font-medium">{getMissedTypeText(request.missed_type)}</div>
                              </div>
                              <div>
                                <span className="text-white/70">申請日期</span>
                                <div className="text-white font-medium">
                                  {format(new Date(request.request_date), 'yyyy/MM/dd', { locale: zhTW })}
                                </div>
                              </div>
                              <div>
                                <span className="text-white/70">部門職位</span>
                                <div className="text-white font-medium">{request.staff_department} - {request.staff_position}</div>
                              </div>
                              <div>
                                <span className="text-white/70">申請時間</span>
                                <div className="text-white font-medium">
                                  {format(new Date(request.created_at), 'MM/dd HH:mm')}
                                </div>
                              </div>
                            </div>

                            {(request.requested_check_in_time || request.requested_check_out_time) && (
                              <div className="mt-3 p-3 bg-white/10 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Clock className="h-4 w-4 text-white/80" />
                                  <span className="text-white/70 text-sm">補登時間</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  {request.requested_check_in_time && (
                                    <div>
                                      <span className="text-white/70">上班時間：</span>
                                      <span className="text-white font-medium">{formatTime(request.requested_check_in_time)}</span>
                                    </div>
                                  )}
                                  {request.requested_check_out_time && (
                                    <div>
                                      <span className="text-white/70">下班時間：</span>
                                      <span className="text-white font-medium">{formatTime(request.requested_check_out_time)}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="mt-3 p-3 bg-white/10 rounded-lg">
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="h-4 w-4 text-white/80" />
                                <span className="text-white/70 text-sm">申請原因</span>
                              </div>
                              <p className="text-white text-sm">{request.reason}</p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 lg:ml-6">
                            <Button
                              onClick={() => handleMissedCheckinApproval(request.id, 'approved')}
                              className="bg-green-500 hover:bg-green-600 text-white border-0"
                              size="sm"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              核准
                            </Button>
                            <Button
                              onClick={() => handleMissedCheckinApproval(request.id, 'rejected', '主管拒絕')}
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalCenter;
