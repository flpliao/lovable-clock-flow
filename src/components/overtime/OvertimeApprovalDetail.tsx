
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Clock, User, Calendar, FileText, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

interface OvertimeApprovalDetailProps {
  request: any;
  onBack: () => void;
  onApprovalComplete: () => void;
}

const OvertimeApprovalDetail: React.FC<OvertimeApprovalDetailProps> = ({
  request,
  onBack,
  onApprovalComplete
}) => {
  const [comment, setComment] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      // Here you would typically call an API to approve the request
      toast({
        title: "批准成功",
        description: "加班申請已批准",
      });
      onApprovalComplete();
    } catch (error) {
      toast({
        title: "操作失敗",
        description: "無法批准加班申請",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "請輸入拒絕原因",
        description: "拒絕申請時必須提供原因",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Here you would typically call an API to reject the request
      toast({
        title: "拒絕成功",
        description: "加班申請已拒絕",
      });
      onApprovalComplete();
    } catch (error) {
      toast({
        title: "操作失敗",
        description: "無法拒絕加班申請",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600 pt-32 md:pt-36 py-[50px]">
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回列表
            </Button>
            <h1 className="text-2xl font-bold text-white drop-shadow-md">加班申請審核</h1>
          </div>

          {/* Request Details */}
          <Card className="backdrop-blur-xl bg-white/20 border border-white/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                加班申請詳情
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-100 border-orange-300/30">
                  {request.status === 'pending' ? '待審核' : request.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Employee Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">申請人</label>
                  <div className="flex items-center gap-2 text-white">
                    <User className="h-4 w-4" />
                    <span>{request.staff?.name || '未知員工'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">員工編號</label>
                  <div className="text-white">
                    {request.staff?.employee_id || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Overtime Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">加班日期</label>
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(request.overtime_date), 'yyyy年MM月dd日')}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">加班時間</label>
                  <div className="flex items-center gap-2 text-white">
                    <Clock className="h-4 w-4" />
                    <span>{request.start_time} - {request.end_time}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">加班時數</label>
                  <div className="text-white font-semibold">
                    {request.hours} 小時
                  </div>
                </div>
              </div>

              {/* Reason */}
              {request.reason && (
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">加班原因</label>
                  <div className="flex items-start gap-2 text-white bg-white/10 rounded-lg p-3">
                    <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{request.reason}</span>
                  </div>
                </div>
              )}

              {/* Approval Actions */}
              {request.status === 'pending' && (
                <div className="space-y-4 pt-4 border-t border-white/20">
                  <h3 className="text-white font-medium">審核操作</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Approve Section */}
                    <div className="space-y-3">
                      <h4 className="text-green-100 font-medium">批准申請</h4>
                      <Textarea
                        placeholder="審核意見（可選）"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                      />
                      <Button
                        onClick={handleApprove}
                        disabled={isProcessing}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        批准申請
                      </Button>
                    </div>

                    {/* Reject Section */}
                    <div className="space-y-3">
                      <h4 className="text-red-100 font-medium">拒絕申請</h4>
                      <Textarea
                        placeholder="拒絕原因（必填）"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                        required
                      />
                      <Button
                        onClick={handleReject}
                        disabled={isProcessing}
                        variant="destructive"
                        className="w-full"
                      >
                        <X className="h-4 w-4 mr-2" />
                        拒絕申請
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OvertimeApprovalDetail;
