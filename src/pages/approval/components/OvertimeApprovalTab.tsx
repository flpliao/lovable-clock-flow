
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Calendar, FileText, Eye, Check, X } from 'lucide-react';
import { format } from 'date-fns';

interface OvertimeApprovalTabProps {
  pendingRequests: any[];
  isLoading: boolean;
  onViewDetail: (request: any) => void;
  onApprove: (requestId: string, comment?: string) => void;
  onReject: (requestId: string, reason: string) => void;
}

const OvertimeApprovalTab: React.FC<OvertimeApprovalTabProps> = ({
  pendingRequests,
  isLoading,
  onViewDetail,
  onApprove,
  onReject
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-white/20 rounded w-32"></div>
                <div className="h-3 bg-white/20 rounded w-48"></div>
              </div>
              <div className="h-8 bg-white/20 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-white/60" />
        </div>
        <p className="text-white font-medium drop-shadow-sm">暫無待審核的加班申請</p>
        <p className="text-white/80 mt-1 font-medium drop-shadow-sm">所有加班申請都已處理完成</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingRequests.map((request) => (
        <div key={request.id} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-200">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium drop-shadow-sm">
                    {request.staff?.name || '未知員工'} - 加班申請
                  </h3>
                  <p className="text-white/70 text-sm drop-shadow-sm">
                    員工編號: {request.staff?.employee_id || 'N/A'}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-orange-500/20 text-orange-100 border-orange-300/30">
                  待審核
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-white/80">
                  <Calendar className="h-4 w-4" />
                  <span>日期: {format(new Date(request.overtime_date), 'yyyy-MM-dd')}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Clock className="h-4 w-4" />
                  <span>時間: {request.start_time} - {request.end_time}</span>
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <User className="h-4 w-4" />
                  <span>時數: {request.hours} 小時</span>
                </div>
              </div>

              {request.reason && (
                <div className="flex items-start gap-2 text-white/80 text-sm">
                  <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>原因: {request.reason}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetail(request)}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40"
              >
                <Eye className="h-4 w-4 mr-1" />
                查看詳情
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onApprove(request.id)}
                className="bg-green-500/20 border-green-300/30 text-green-100 hover:bg-green-500/30 hover:border-green-300/40"
              >
                <Check className="h-4 w-4 mr-1" />
                批准
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(request.id, '需要更多資訊')}
                className="bg-red-500/20 border-red-300/30 text-red-100 hover:bg-red-500/30 hover:border-red-300/40"
              >
                <X className="h-4 w-4 mr-1" />
                拒絕
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OvertimeApprovalTab;
