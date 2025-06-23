
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { MissedCheckinRequest } from '@/types/missedCheckin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, User, Calendar, FileText, RefreshCw, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import MissedCheckinDialog from '@/components/check-in/MissedCheckinDialog';

const MissedCheckinManagement = () => {
  const { currentUser } = useUser();
  const { toast } = useToast();
  const [requests, setRequests] = useState<MissedCheckinRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // 載入使用者的忘記打卡申請記錄
  const loadRequests = async () => {
    if (!currentUser?.id) {
      setIsLoading(false);
      return;
    }

    console.log('🔍 載入忘記打卡申請記錄，當前用戶:', currentUser.id, currentUser.name);

    try {
      setRefreshing(true);
      
      const { data, error } = await supabase
        .from('missed_checkin_requests')
        .select(`
          *,
          staff:staff_id (
            name,
            department,
            position,
            branch_name
          )
        `)
        .eq('staff_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ 載入忘記打卡申請失敗:', error);
        toast({
          title: "載入失敗",
          description: "無法載入忘記打卡申請記錄",
          variant: "destructive"
        });
        return;
      }

      const formattedData = (data || []).map(item => ({
        ...item,
        missed_type: item.missed_type as 'check_in' | 'check_out' | 'both',
        status: item.status as 'pending' | 'approved' | 'rejected',
        staff: Array.isArray(item.staff) ? item.staff[0] : item.staff
      }));

      console.log('✅ 成功載入忘記打卡申請記錄:', formattedData.length, '筆');
      setRequests(formattedData);
    } catch (error) {
      console.error('❌ 載入忘記打卡申請時發生錯誤:', error);
      toast({
        title: "載入失敗",
        description: "載入忘記打卡申請時發生錯誤",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      loadRequests();
    }
  }, [currentUser?.id]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return '已核准';
      case 'rejected':
        return '已拒絕';
      case 'pending':
        return '待審核';
      default:
        return status;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '-';
    return format(new Date(timeString), 'HH:mm');
  };

  const refreshData = () => {
    loadRequests();
  };

  const handleAddSuccess = () => {
    setShowAddDialog(false);
    loadRequests();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-8">
              <h1 className="text-2xl font-bold text-white mb-4">請先登入</h1>
              <p className="text-white/80">您需要登入系統才能查看忘記打卡申請記錄</p>
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
                  <h1 className="text-2xl font-bold text-white drop-shadow-md">忘記打卡管理</h1>
                  <p className="text-white/80 font-medium drop-shadow-sm">Missed Check-in Management - 查看申請記錄與狀態</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="bg-green-500 hover:bg-green-600 text-white border-0"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新增申請
                </Button>
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
          </div>

          {/* 統計資訊 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-white mb-2">{requests.length}</div>
              <div className="text-white/80 text-sm font-medium">總申請數</div>
            </div>
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-yellow-300 mb-2">
                {requests.filter(req => req.status === 'pending').length}
              </div>
              <div className="text-white/80 text-sm font-medium">待審核</div>
            </div>
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-green-300 mb-2">
                {requests.filter(req => req.status === 'approved').length}
              </div>
              <div className="text-white/80 text-sm font-medium">已核准</div>
            </div>
            <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-4 text-center">
              <div className="text-3xl font-bold text-red-300 mb-2">
                {requests.filter(req => req.status === 'rejected').length}
              </div>
              <div className="text-white/80 text-sm font-medium">已拒絕</div>
            </div>
          </div>

          {/* 申請記錄列表 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white drop-shadow-md mb-6">我的忘記打卡申請記錄</h2>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white/80">載入中...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white/60" />
                </div>
                <p className="text-white font-medium drop-shadow-sm">目前沒有忘記打卡申請記錄</p>
                <p className="text-white/80 mt-1 font-medium drop-shadow-sm">點擊「新增申請」來建立您的第一筆申請</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div key={request.id} className="bg-white/10 rounded-2xl p-6 border border-white/20">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge className={`${getStatusColor(request.status)} text-white`}>
                            {getStatusText(request.status)}
                          </Badge>
                          <h3 className="text-lg font-semibold text-white">
                            {getMissedTypeText(request.missed_type)}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-white/70">申請日期</span>
                            <div className="text-white font-medium">
                              {format(new Date(request.request_date), 'yyyy/MM/dd')}
                            </div>
                          </div>
                          {request.requested_check_in_time && (
                            <div>
                              <span className="text-white/70">上班時間</span>
                              <div className="text-white font-medium">{formatTime(request.requested_check_in_time)}</div>
                            </div>
                          )}
                          {request.requested_check_out_time && (
                            <div>
                              <span className="text-white/70">下班時間</span>
                              <div className="text-white font-medium">{formatTime(request.requested_check_out_time)}</div>
                            </div>
                          )}
                          <div>
                            <span className="text-white/70">申請時間</span>
                            <div className="text-white font-medium">
                              {format(new Date(request.created_at), 'MM/dd HH:mm')}
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 p-3 bg-white/10 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="h-4 w-4 text-white/80" />
                            <span className="text-white/70 text-sm">申請原因</span>
                          </div>
                          <p className="text-white text-sm">{request.reason}</p>
                        </div>

                        {request.status !== 'pending' && (
                          <div className="mt-3 p-3 bg-white/10 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-4 w-4 text-white/80" />
                              <span className="text-white/70 text-sm">審核結果</span>
                            </div>
                            <div className="text-white text-sm">
                              <div>審核時間：{request.approval_date ? format(new Date(request.approval_date), 'yyyy/MM/dd HH:mm') : '-'}</div>
                              {request.approval_comment && (
                                <div className="mt-1">審核備註：{request.approval_comment}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 lg:ml-6">
                        {request.status === 'approved' && (
                          <CheckCircle className="h-8 w-8 text-green-400" />
                        )}
                        {request.status === 'rejected' && (
                          <XCircle className="h-8 w-8 text-red-400" />
                        )}
                        {request.status === 'pending' && (
                          <Clock className="h-8 w-8 text-yellow-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 新增申請對話框 */}
      <MissedCheckinDialog
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default MissedCheckinManagement;
