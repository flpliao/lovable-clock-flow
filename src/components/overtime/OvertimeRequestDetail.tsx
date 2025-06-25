
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Calendar, FileText, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { OvertimeRequest } from '@/types/overtime';

interface OvertimeRequestDetailProps {
  overtimeRequest: OvertimeRequest;
  isApprover: boolean;
}

const OvertimeRequestDetail: React.FC<OvertimeRequestDetailProps> = ({
  overtimeRequest,
  isApprover
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-400" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-orange-400" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-100 border-green-300/30">已批准</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-100 border-red-300/30">已拒絕</Badge>;
      case 'pending':
        return <Badge className="bg-orange-500/20 text-orange-100 border-orange-300/30">待審核</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-white/10 border border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Clock className="h-4 w-4 text-white" />
          </div>
          加班申請詳情
          {getStatusBadge(overtimeRequest.status)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">申請編號</label>
            <div className="text-white font-mono text-sm">
              {overtimeRequest.id}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">申請狀態</label>
            <div className="flex items-center gap-2">
              {getStatusIcon(overtimeRequest.status)}
              <span className="text-white">{overtimeRequest.status === 'pending' ? '待審核' : overtimeRequest.status === 'approved' ? '已批准' : '已拒絕'}</span>
            </div>
          </div>
        </div>

        {/* Overtime Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">加班日期</label>
            <div className="flex items-center gap-2 text-white">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(overtimeRequest.overtime_date), 'yyyy年MM月dd日')}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">加班時間</label>
            <div className="flex items-center gap-2 text-white">
              <Clock className="h-4 w-4" />
              <span>{overtimeRequest.start_time} - {overtimeRequest.end_time}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">加班時數</label>
            <div className="flex items-center gap-2 text-white font-semibold">
              <User className="h-4 w-4" />
              <span>{overtimeRequest.hours} 小時</span>
            </div>
          </div>
        </div>

        {/* Reason */}
        {overtimeRequest.reason && (
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">加班原因</label>
            <div className="flex items-start gap-2 text-white bg-white/10 rounded-lg p-3">
              <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{overtimeRequest.reason}</span>
            </div>
          </div>
        )}

        {/* Rejection Reason */}
        {overtimeRequest.status === 'rejected' && overtimeRequest.rejection_reason && (
          <div className="space-y-2">
            <label className="text-red-100 text-sm font-medium">拒絕原因</label>
            <div className="bg-red-500/20 border border-red-300/30 rounded-lg p-3">
              <p className="text-red-100">{overtimeRequest.rejection_reason}</p>
            </div>
          </div>
        )}

        {/* Approval Process */}
        {overtimeRequest.approvals && overtimeRequest.approvals.length > 0 && (
          <div className="space-y-3">
            <label className="text-white/80 text-sm font-medium">審核流程</label>
            <div className="space-y-2">
              {overtimeRequest.approvals.map((approval, index) => (
                <div key={approval.id} className="flex items-center gap-3 bg-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/20 text-orange-100 text-sm font-medium">
                    {approval.level}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{approval.approver_name}</div>
                    <div className="text-white/70 text-sm">第 {approval.level} 級審核</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(approval.status)}
                    <span className="text-white text-sm">
                      {approval.status === 'pending' ? '待審核' : approval.status === 'approved' ? '已批准' : '已拒絕'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">申請時間</label>
            <div className="text-white/60 text-sm">
              {format(new Date(overtimeRequest.created_at), 'yyyy-MM-dd HH:mm:ss')}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-white/80 text-sm font-medium">最後更新</label>
            <div className="text-white/60 text-sm">
              {format(new Date(overtimeRequest.updated_at), 'yyyy-MM-dd HH:mm:ss')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OvertimeRequestDetail;
