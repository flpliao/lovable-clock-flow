import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { MissedCheckinRequest } from '@/types/missedCheckin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, User, CheckCircle, XCircle, Building2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { NotificationDatabaseOperations } from '@/services/notifications';

const MissedCheckinManagement = () => {
  const { currentUser, isAdmin, isManager } = useUser();
  const { toast } = useToast();
  const [requests, setRequests] = useState<MissedCheckinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<MissedCheckinRequest | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadRequests = async () => {
    if (!currentUser) {
      console.log('沒有當前用戶，跳過載入');
      setLoading(false);
      return;
    }

    try {
      console.log('開始載入忘記打卡申請，用戶:', currentUser.name);
      
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
        .order('created_at', { ascending: false });

      console.log('Supabase 查詢結果:', { data, error });

      if (error) {
        console.error('載入申請失敗:', error);
        toast({
          title: "載入失敗",
          description: `無法載入忘記打卡申請: ${error.message}`,
          variant: "destructive"
        });
        setRequests([]);
        return;
      }

      // 過濾權限：只顯示當前用戶可以處理的申請
      const filteredData = (data || []).filter(item => {
        const staff = Array.isArray(item.staff) ? item.staff[0] : item.staff;
        
        // 管理員可以看到所有申請
        if (isAdmin()) {
          return true;
        }
        
        // 申請人可以看到自己的申請（但不能審核）
        if (item.staff_id === currentUser.id) {
          return true;
        }
        
        // 直屬主管可以看到下屬的申請
        if (staff?.supervisor_id === currentUser.id) {
          return true;
        }
        
        return false;
      });

      const formattedData = filteredData.map(item => ({
        ...item,
        missed_type: item.missed_type as 'check_in' | 'check_out' | 'both',
        status: item.status as 'pending' | 'approved' | 'rejected',
        staff: Array.isArray(item.staff) ? item.staff[0] : item.staff
      }));

      console.log('格式化後的資料:', formattedData);
      setRequests(formattedData);
      
    } catch (error) {
      console.error('載入申請時發生錯誤:', error);
      toast({
        title: "載入失敗",
        description: "載入忘記打卡申請時發生錯誤",
        variant: "destructive"
      });
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('MissedCheckinManagement useEffect:', {
      currentUser: currentUser?.name,
      isAdmin: isAdmin(),
      isManager: isManager()
    });
    
    if (currentUser) {
      loadRequests();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const canApproveRequest = (request: MissedCheckinRequest) => {
    // 申請人不能審核自己的申請
    if (request.staff_id === currentUser?.id) {
      return false;
    }
    
    // 管理員可以審核所有申請
    if (isAdmin()) {
      return true;
    }
    
    // 直屬主管可以審核下屬的申請
    const staff = Array.isArray(request.staff) ? request.staff[0] : request.staff;
    return staff?.supervisor_id === currentUser?.id;
  };

  const handleApproval = async (requestId: string, action: 'approved' | 'rejected') => {
    if (!currentUser) return;
    
    setActionLoading(true);
    try {
      const { data: updatedRequest, error } = await supabase
        .from('missed_checkin_requests')
        .update({
          status: action,
          approved_by: currentUser.id,
          approval_comment: approvalComment,
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
      loadRequests();
      setSelectedRequest(null);
      setApprovalComment('');
    } catch (error) {
      console.error('審核失敗:', error);
      toast({
        title: "審核失敗",
        description: "無法處理申請，請稍後重試",
        variant: "destructive"
      });
    } finally {
      setActionLoading(false);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">待審核</Badge>;
      case 'approved':
        return <Badge className="bg-green-50 text-green-700 border-green-200">已核准</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">已退回</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '-';
    return format(new Date(timeString), 'HH:mm', { locale: zhTW });
  };

  // 權限檢查
  if (!currentUser) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center p-6">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">請先登入以查看此頁面</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 relative overflow-hidden">
      {/* 背景層 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/80 via-blue-500/60 to-purple-600/80"></div>
      
      <div className="relative z-10 w-full min-h-screen pt-20 pb-6">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-6">
          {/* 標題區域 */}
          <div className="mb-6 text-center">
            <div className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Clock className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">忘記打卡申請管理</h1>
              </div>
              <p className="text-gray-600">管理員工忘記打卡申請</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">載入申請中...</p>
              </div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl p-8">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">目前沒有申請記錄</h3>
                <p className="text-gray-500">還沒有員工提交忘記打卡申請</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="bg-white/95 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6">
                    {/* 申請狀態和員工信息 */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {request.staff?.name || '未知申請人'}
                            {request.staff_id === currentUser?.id && (
                              <span className="ml-2 text-sm text-blue-600">(您的申請)</span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {request.staff?.department} - {request.staff?.position}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(request.status)}
                        <span className="text-xs text-gray-500">
                          {format(new Date(request.created_at), 'yyyy/MM/dd HH:mm', { locale: zhTW })}
                        </span>
                      </div>
                    </div>

                    {/* 申請詳情 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">申請類型</span>
                        <p className="font-medium">{getMissedTypeText(request.missed_type)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">申請日期</span>
                        <p className="font-medium">
                          {format(new Date(request.request_date), 'yyyy/MM/dd', { locale: zhTW })}
                        </p>
                      </div>
                      {request.requested_check_in_time && (
                        <div>
                          <span className="text-sm text-gray-500">上班時間</span>
                          <p className="font-medium">{formatTime(request.requested_check_in_time)}</p>
                        </div>
                      )}
                      {request.requested_check_out_time && (
                        <div>
                          <span className="text-sm text-gray-500">下班時間</span>
                          <p className="font-medium">{formatTime(request.requested_check_out_time)}</p>
                        </div>
                      )}
                    </div>

                    {/* 申請原因 */}
                    {request.reason && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-500">申請原因</span>
                        <p className="text-sm mt-1">{request.reason}</p>
                      </div>
                    )}

                    {/* 審核按鈕 - 只有有權限的用戶且狀態為待審核時才顯示 */}
                    {request.status === 'pending' && canApproveRequest(request) && (
                      <div className="flex justify-end space-x-2 pt-4 border-t">
                        <Button
                          onClick={() => handleApproval(request.id, 'approved')}
                          disabled={actionLoading}
                          className="bg-green-500 hover:bg-green-600 text-white"
                          size="sm"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          核准
                        </Button>
                        <Button
                          onClick={() => handleApproval(request.id, 'rejected')}
                          disabled={actionLoading}
                          variant="destructive"
                          size="sm"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          拒絕
                        </Button>
                      </div>
                    )}

                    {/* 無權限提示 */}
                    {request.status === 'pending' && !canApproveRequest(request) && request.staff_id !== currentUser?.id && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-500 text-center">
                          您沒有權限審核此申請（需要直屬主管審核）
                        </p>
                      </div>
                    )}

                    {/* 自己的申請提示 */}
                    {request.staff_id === currentUser?.id && request.status === 'pending' && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-blue-600 text-center">
                          您的申請正在等待直屬主管審核
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissedCheckinManagement;
