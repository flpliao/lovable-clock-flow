
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
            branch_name
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

      const formattedData = (data || []).map(item => ({
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
                          <h3 className="font-semibold text-gray-800 text-lg">{request.staff?.name || '未知員工'}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Building2 className="h-4 w-4" />
                            <span>{request.staff?.department || '未知部門'}</span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>

                    {/* 申請詳情 */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-500" />
                          <span className="font-medium text-gray-700">申請類型：</span>
                          <Badge variant="outline" className="bg-orange-50 text-orange-700">
                            {getMissedTypeText(request.missed_type)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-gray-700">申請日期：</span>
                          <span className="text-gray-600">
                            {format(new Date(request.request_date), 'yyyy年MM月dd日', { locale: zhTW })}
                          </span>
                        </div>

                        {request.requested_check_in_time && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-green-500" />
                            <span className="font-medium text-gray-700">上班時間：</span>
                            <span className="text-gray-600">{formatTime(request.requested_check_in_time)}</span>
                          </div>
                        )}

                        {request.requested_check_out_time && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-red-500" />
                            <span className="font-medium text-gray-700">下班時間：</span>
                            <span className="text-gray-600">{formatTime(request.requested_check_out_time)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 申請原因 */}
                    <div className="mb-4">
                      <p className="font-medium text-gray-700 mb-2">申請原因：</p>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-gray-700">{request.reason}</p>
                      </div>
                    </div>

                    {/* 申請時間 */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Clock className="h-4 w-4" />
                      <span>申請時間：{format(new Date(request.created_at), 'yyyy/MM/dd HH:mm', { locale: zhTW })}</span>
                    </div>

                    {/* 審核按鈕 */}
                    {request.status === 'pending' && (isAdmin() || isManager()) && (
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              審核申請
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md mx-4">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-orange-500" />
                                審核忘記打卡申請
                              </DialogTitle>
                            </DialogHeader>
                            
                            {selectedRequest && (
                              <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <h4 className="font-medium mb-3 text-gray-800">申請詳情</h4>
                                  <div className="text-sm space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">員工：</span>
                                      <span className="font-medium">{selectedRequest.staff?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">類型：</span>
                                      <span className="font-medium">{getMissedTypeText(selectedRequest.missed_type)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">日期：</span>
                                      <span className="font-medium">
                                        {format(new Date(selectedRequest.request_date), 'yyyy/MM/dd', { locale: zhTW })}
                                      </span>
                                    </div>
                                    <div className="pt-2 border-t">
                                      <span className="text-gray-600">原因：</span>
                                      <p className="mt-1 text-gray-800">{selectedRequest.reason}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">審核意見（選填）</label>
                                  <Textarea
                                    placeholder="請輸入審核意見..."
                                    value={approvalComment}
                                    onChange={(e) => setApprovalComment(e.target.value)}
                                    rows={3}
                                    className="resize-none"
                                  />
                                </div>
                                
                                <div className="flex gap-2 pt-4">
                                  <Button
                                    variant="outline"
                                    onClick={() => handleApproval(selectedRequest.id, 'rejected')}
                                    disabled={actionLoading}
                                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    {actionLoading ? '處理中...' : '退回'}
                                  </Button>
                                  <Button
                                    onClick={() => handleApproval(selectedRequest.id, 'approved')}
                                    disabled={actionLoading}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {actionLoading ? '處理中...' : '核准'}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}

                    {/* 已審核顯示結果 */}
                    {request.status !== 'pending' && request.approval_comment && (
                      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">審核意見：</p>
                        <p className="text-sm text-gray-600">{request.approval_comment}</p>
                        {request.approval_date && (
                          <p className="text-xs text-gray-500 mt-2">
                            審核時間：{format(new Date(request.approval_date), 'yyyy/MM/dd HH:mm', { locale: zhTW })}
                          </p>
                        )}
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
