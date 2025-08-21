import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCurrentUser } from '@/hooks/useStores';
import { supabase } from '@/integrations/supabase/client';
import { sendLeaveStatusNotification } from '@/services/leaveNotificationService';
import { LeaveRequest } from '@/types';
import { getLeaveTypeText } from '@/utils/leaveUtils';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, CheckCircle, Clock, FileText, User, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface LeaveApprovalDetailProps {
  request: LeaveRequest;
  onBack: () => void;
  onApprovalComplete: () => void;
}

const LeaveApprovalDetail: React.FC<LeaveApprovalDetailProps> = ({
  request,
  onBack,
  onApprovalComplete
}) => {
  const currentUser = useCurrentUser();
  const { toast } = useToast();
  const [applicantInfo, setApplicantInfo] = useState<{
    id: string;
    name: string;
    department: string;
    position: string;
    contact: string;
  } | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // 載入申請人詳細資訊
  useEffect(() => {
    const loadApplicantInfo = async () => {
      try {
        const { data: staffData, error } = await supabase
          .from('staff')
          .select('*')
          .eq('id', request.user_id)
          .maybeSingle();

        if (error) {
          console.error('載入申請人資訊失敗:', error);
          return;
        }

        setApplicantInfo(staffData);
      } catch (error) {
        console.error('載入申請人資訊時發生錯誤:', error);
      }
    };

    if (request.user_id) {
      loadApplicantInfo();
    }
  }, [request.user_id]);

  const handleApprove = async () => {
    if (!currentUser) return;

    setIsProcessing(true);
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
          comment: approvalComment || '主管核准'
        })
        .eq('leave_request_id', request.id)
        .eq('approver_id', currentUser.id);

      if (approvalError) {
        console.warn('⚠️ 更新審核記錄失敗:', approvalError);
      }

      // 發送通知給申請人
      if (applicantInfo) {
        await sendLeaveStatusNotification(
          request.user_id,
          applicantInfo.name,
          request.id,
          'approved',
          currentUser.name || '主管',
          approvalComment || '主管核准'
        );
      }

      console.log('✅ 請假申請核准成功');
      toast({
        title: "核准成功",
        description: "請假申請已核准",
      });

      onApprovalComplete();
    } catch (error) {
      console.error('❌ 核准請假申請時發生錯誤:', error);
      toast({
        title: "核准失敗",
        description: "核准請假申請時發生錯誤",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!currentUser || !rejectionReason.trim()) {
      toast({
        title: "請填寫拒絕原因",
        description: "拒絕申請時必須填寫原因",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      console.log('🚀 開始拒絕請假申請:', request.id);

      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: 'rejected',
          rejection_reason: rejectionReason,
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
          comment: rejectionReason
        })
        .eq('leave_request_id', request.id)
        .eq('approver_id', currentUser.id);

      if (approvalError) {
        console.warn('⚠️ 更新審核記錄失敗:', approvalError);
      }

      // 發送通知給申請人
      if (applicantInfo) {
        await sendLeaveStatusNotification(
          request.user_id,
          applicantInfo.name,
          request.id,
          'rejected',
          currentUser.name || '主管',
          rejectionReason
        );
      }

      console.log('✅ 請假申請拒絕成功');
      toast({
        title: "拒絕成功",
        description: "請假申請已拒絕",
        variant: "destructive"
      });

      onApprovalComplete();
    } catch (error) {
      console.error('❌ 拒絕請假申請時發生錯誤:', error);
      toast({
        title: "拒絕失敗",
        description: "拒絕請假申請時發生錯誤",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36">
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 返回按鈕 */}
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回審核列表
          </Button>

          {/* 申請人基本資訊 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white drop-shadow-md mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              申請人資訊
            </h2>
            {applicantInfo ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                <div>
                  <span className="text-white/70">姓名：</span>
                  <span className="font-medium">{applicantInfo.name}</span>
                </div>
                <div>
                  <span className="text-white/70">部門：</span>
                  <span className="font-medium">{applicantInfo.department}</span>
                </div>
                <div>
                  <span className="text-white/70">職位：</span>
                  <span className="font-medium">{applicantInfo.position}</span>
                </div>
                <div>
                  <span className="text-white/70">聯絡方式：</span>
                  <span className="font-medium">{applicantInfo.contact}</span>
                </div>
              </div>
            ) : (
              <p className="text-white/80">載入申請人資訊中...</p>
            )}
          </div>

          {/* 請假詳細資訊 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white drop-shadow-md mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              請假詳情
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
              <div>
                <span className="text-white/70">請假類型：</span>
                <span className="font-medium">{getLeaveTypeText(request.leave_type)}</span>
              </div>
              <div>
                <span className="text-white/70">請假時數：</span>
                <span className="font-medium">{request.hours} 小時</span>
              </div>
              <div>
                <span className="text-white/70">開始日期：</span>
                <span className="font-medium">{format(new Date(request.start_date), 'yyyy/MM/dd')}</span>
              </div>
              <div>
                <span className="text-white/70">結束日期：</span>
                <span className="font-medium">{format(new Date(request.end_date), 'yyyy/MM/dd')}</span>
              </div>
              <div>
                <span className="text-white/70">申請時間：</span>
                <span className="font-medium">{format(new Date(request.created_at), 'yyyy/MM/dd HH:mm')}</span>
              </div>
              <div>
                <span className="text-white/70">申請狀態：</span>
                <span className="font-medium text-yellow-300">待審核</span>
              </div>
            </div>

            {request.reason && (
              <div className="mt-4 p-4 bg-white/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-white/80" />
                  <span className="text-white/70">請假原因</span>
                </div>
                <p className="text-white">{request.reason}</p>
              </div>
            )}
          </div>

          {/* 審核操作 */}
          <div className="backdrop-blur-xl bg-white/20 border border-white/30 rounded-3xl shadow-xl p-6">
            <h2 className="text-xl font-semibold text-white drop-shadow-md mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              審核操作
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">核准意見（選填）</label>
                <Textarea
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="請輸入核准意見..."
                  className="bg-white/10 border-white/30 text-white placeholder-white/50"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">拒絕原因（拒絕時必填）</label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="請輸入拒絕原因..."
                  className="bg-white/10 border-white/30 text-white placeholder-white/50"
                  rows={3}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleApprove}
                  disabled={isProcessing}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white border-0"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? '處理中...' : '核准申請'}
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={isProcessing || !rejectionReason.trim()}
                  variant="destructive"
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {isProcessing ? '處理中...' : '拒絕申請'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveApprovalDetail;
