
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, User, FileText, CheckCircle, XCircle } from 'lucide-react';
import type { OvertimeRequest } from '@/types/overtime';
import { useState } from 'react';

interface OvertimeApprovalTabProps {
  overtimeRequests: OvertimeRequest[];
  onApproval: (requestId: string, action: 'approve' | 'reject', comment?: string) => void;
}

const OvertimeApprovalTab: React.FC<OvertimeApprovalTabProps> = ({
  overtimeRequests,
  onApproval
}) => {
  const [selectedRequest, setSelectedRequest] = useState<OvertimeRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approveComment, setApproveComment] = useState('');

  const handleApprove = (request: OvertimeRequest) => {
    onApproval(request.id, 'approve', approveComment);
    setApproveComment('');
    setSelectedRequest(null);
  };

  const handleReject = (request: OvertimeRequest) => {
    if (!rejectReason.trim()) {
      alert('請填寫拒絕原因');
      return;
    }
    onApproval(request.id, 'reject', rejectReason);
    setRejectReason('');
    setSelectedRequest(null);
  };

  if (overtimeRequests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64 text-center">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">暫無待審核的加班申請</h3>
          <p className="text-gray-500">目前沒有需要您審核的加班申請</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {overtimeRequests.map((request) => (
        <Card key={request.id} className="border-l-4 border-l-orange-500">
          <CardContent className="pt-4">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">申請人姓名</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    加班日期：{new Date(request.overtime_date).toLocaleDateString('zh-TW')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    時間：{request.start_time} - {request.end_time} ({request.hours}小時)
                  </span>
                </div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">待審核</Badge>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-1">加班類型</div>
              <div className="font-medium mb-3">{request.overtime_type}</div>
              
              <div className="text-sm text-gray-600 mb-1">加班原因</div>
              <div className="text-sm bg-gray-50 p-3 rounded">{request.reason}</div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setSelectedRequest(request)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    拒絕
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>拒絕加班申請</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">拒絕原因</label>
                      <Textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="請說明拒絕的原因..."
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                        取消
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => selectedRequest && handleReject(selectedRequest)}
                      >
                        確認拒絕
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => setSelectedRequest(request)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    核准
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>核准加班申請</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">審核意見（選填）</label>
                      <Textarea
                        value={approveComment}
                        onChange={(e) => setApproveComment(e.target.value)}
                        placeholder="可填寫審核意見..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                        取消
                      </Button>
                      <Button 
                        className="bg-green-500 hover:bg-green-600"
                        onClick={() => selectedRequest && handleApprove(selectedRequest)}
                      >
                        確認核准
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="text-xs text-gray-500 mt-3">
              申請時間：{new Date(request.created_at).toLocaleString('zh-TW')}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OvertimeApprovalTab;
