
import React from 'react';
import { CheckCircle, XCircle, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

interface OvertimeRequestWithApplicant {
  id: string;
  staff_id: string;
  overtime_date: string;
  start_time: string;
  end_time: string;
  hours: number;
  overtime_type: string;
  compensation_type: string;
  reason: string;
  status: string;
  created_at: string;
  approval_level?: number;
  current_approver?: string;
  staff?: {
    name: string;
    department: string;
    position: string;
  };
}

interface OvertimeApprovalTabProps {
  overtimeRequests: OvertimeRequestWithApplicant[];
  onApproval: (requestId: string, action: 'approved' | 'rejected', reason?: string) => void;
}

const OvertimeApprovalTab: React.FC<OvertimeApprovalTabProps> = ({
  overtimeRequests,
  onApproval
}) => {
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
                <h3 className="text-lg font-semibold text-white">申請人員：{request.staff?.name}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-white/70">加班日期</span>
                  <div className="text-white font-medium">{request.overtime_date}</div>
                </div>
                <div>
                  <span className="text-white/70">加班時間</span>
                  <div className="text-white font-medium">
                    {new Date(request.start_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(request.end_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div>
                  <span className="text-white/70">加班時數</span>
                  <div className="text-white font-medium">{request.hours} 小時</div>
                </div>
                <div>
                  <span className="text-white/70">申請時間</span>
                  <div className="text-white font-medium">
                    {format(new Date(request.created_at), 'MM/dd HH:mm')}
                  </div>
                </div>
              </div>

              {request.reason && (
                <div className="mt-3 p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-white/80" />
                    <span className="text-white/70 text-sm">加班原因</span>
                  </div>
                  <p className="text-white text-sm">{request.reason}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 lg:ml-6">
              <Button
                onClick={() => onApproval(request.id, 'approved')}
                className="bg-green-500 hover:bg-green-600 text-white border-0"
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                核准
              </Button>
              <Button
                onClick={() => onApproval(request.id, 'rejected', '主管拒絕')}
                variant="destructive"
                size="sm"
              >
                <XCircle className="h-4 w-4 mr-2" />
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
