
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { MissedCheckinRequest } from '@/types/missedCheckin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, User, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

const MissedCheckinManagement = () => {
  const { currentUser, isAdmin, isManager } = useUser();
  const { toast } = useToast();
  const [requests, setRequests] = useState<MissedCheckinRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<MissedCheckinRequest | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // 載入待審核的忘記打卡申請
  const loadRequests = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('missed_checkin_requests')
        .select(`
          *,
          staff:staff_id (
            name,
            department,
            position
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests(data || []);
    } catch (error) {
      console.error('載入申請失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入忘記打卡申請",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && (isAdmin || isManager)) {
      loadRequests();
    }
  }, [currentUser, isAdmin, isManager]);

  // 處理審核
  const handleApproval = async (requestId: string, action: 'approved' | 'rejected') => {
    if (!currentUser) return;

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('missed_checkin_requests')
        .update({
          status: action,
          approved_by: currentUser.id,
          approval_comment: approvalComment,
          approval_date: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: action === 'approved' ? "申請已核准" : "申請已拒絕",
        description: `忘記打卡申請已${action === 'approved' ? '核准' : '拒絕'}`,
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
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getMissedTypeText = (type: string) => {
    switch (type) {
      case 'check_in': return '忘記上班打卡';
      case 'check_out': return '忘記下班打卡';
      case 'both': return '忘記上下班打卡';
      default: return '';
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '-';
    return format(new Date(timeString), 'HH:mm', { locale: zhTW });
  };

  if (!currentUser || (!isAdmin && !isManager)) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center p-6">
            <p className="text-gray-600">您沒有權限查看此頁面</p>
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
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <Card className="bg-white/90 backdrop-blur-xl border border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6" />
                忘記打卡申請管理
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {loading ? (
                <div className="text-center py-8">載入中...</div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  目前沒有待審核的忘記打卡申請
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request: any) => (
                    <Card key={request.id} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">{request.staff?.name}</span>
                              <Badge variant="outline">{request.staff?.department}</Badge>
                              <Badge variant="secondary">{getMissedTypeText(request.missed_type)}</Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-2">
                              <div>
                                <Calendar className="h-4 w-4 inline mr-1" />
                                申請日期: {format(new Date(request.request_date), 'yyyy/MM/dd', { locale: zhTW })}
                              </div>
                              {request.requested_check_in_time && (
                                <div>上班時間: {formatTime(request.requested_check_in_time)}</div>
                              )}
                              {request.requested_check_out_time && (
                                <div>下班時間: {formatTime(request.requested_check_out_time)}</div>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-700 mb-2">
                              <strong>申請原因：</strong>{request.reason}
                            </p>
                            
                            <p className="text-xs text-gray-500">
                              申請時間: {format(new Date(request.created_at), 'yyyy/MM/dd HH:mm', { locale: zhTW })}
                            </p>
                          </div>
                          
                          <div className="flex gap-2 ml-4">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm"
                                  onClick={() => setSelectedRequest(request)}
                                >
                                  審核
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>審核忘記打卡申請</DialogTitle>
                                </DialogHeader>
                                
                                {selectedRequest && (
                                  <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                      <h4 className="font-medium mb-2">申請詳情</h4>
                                      <div className="text-sm space-y-1">
                                        <p><strong>員工：</strong>{selectedRequest.staff?.name}</p>
                                        <p><strong>類型：</strong>{getMissedTypeText(selectedRequest.missed_type)}</p>
                                        <p><strong>日期：</strong>{format(new Date(selectedRequest.request_date), 'yyyy/MM/dd', { locale: zhTW })}</p>
                                        <p><strong>原因：</strong>{selectedRequest.reason}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">審核意見</label>
                                      <Textarea
                                        placeholder="請輸入審核意見（選填)..."
                                        value={approvalComment}
                                        onChange={(e) => setApprovalComment(e.target.value)}
                                        rows={3}
                                      />
                                    </div>
                                    
                                    <div className="flex justify-end gap-2 pt-4">
                                      <Button
                                        variant="outline"
                                        onClick={() => handleApproval(selectedRequest.id, 'rejected')}
                                        disabled={actionLoading}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        拒絕
                                      </Button>
                                      <Button
                                        onClick={() => handleApproval(selectedRequest.id, 'approved')}
                                        disabled={actionLoading}
                                        className="text-green-600 hover:text-green-700"
                                      >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        核准
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MissedCheckinManagement;
