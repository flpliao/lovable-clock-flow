
import React from 'react';
import { CheckCircle, XCircle, User, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { OvertimeRequest } from '@/types/overtime';

interface OvertimeApprovalTabProps {
  overtimeRequests: OvertimeRequest[];
  isLoading: boolean;
  onViewDetail: (request: OvertimeRequest) => void;
  onApprove: (request: OvertimeRequest) => Promise<void>;
  onReject: (request: OvertimeRequest) => Promise<void>;
}

const OvertimeApprovalTab: React.FC<OvertimeApprovalTabProps> = ({
  overtimeRequests,
  isLoading,
  onViewDetail,
  onApprove,
  onReject
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/80">載入中...</p>
      </div>
    );
  }

  if (overtimeRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white/60" />
        </div>
        <p className="text-white font-medium drop-shadow-sm">目前沒有待審核的加班申請</p>
        <p className="text-white/80 mt-1 font-medium drop-shadow-sm">所有加班申請都已處理完畢</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {overtimeRequests.map(request => (
        <div key={request.id} className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <User className="h-5 w-5 text-white/80" />
                <h3 className="text-lg font-semibold text-white">申請人員：{request.applicant_name}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-white/70">加班日期</span>
                  <div className="text-white font-medium">{request.overtime_date}</div>
                </div>
                <div>
                  <span className="text-white/70">加班時間</span>
                  <div className="text-white font-medium">
                    {request.start_time} - {request.end_time}
                  </div>
                </div>
                <div>
                  <span className="text-white/70">加班時數</span>
                  <div className="text-white font-medium">{request.hours} 小時</div>
                </div>
                <div>
                  <span className="text-white/70">申請時間</span>
                  <div className="text-white font-medium">
                    {request.created_at ? format(new Date(request.created_at), 'MM/dd HH:mm') : '-'}
                  </div>
                </div>
              </div>

              {request.reason && (
                <div className="mt-3 p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-white/80" />
                    <span className="text-white/70 text-sm">加班原因</span>
                  </div>
                  <p className="text-white text-sm">{request.reason}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 lg:ml-6">
              <Button onClick={() => onViewDetail(request)} className="bg-blue-500 hover:bg-blue-600 text-white border-0" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                詳細審核
              </Button>
              <Button onClick={() => onApprove(request)} className="bg-green-500 hover:bg-green-600 text-white border-0" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                快速核准
              </Button>
              <Button onClick={() => onReject(request)} variant="destructive" size="sm">
                <XCircle className="h-4 w-4 mr-2" />
                快速拒絕
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OvertimeApprovalTab;
