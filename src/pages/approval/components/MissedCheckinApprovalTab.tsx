
import React from 'react';
import { CheckCircle, XCircle, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { MissedCheckinRequest } from '@/types/missedCheckin';
import MissedCheckinApprovalProcess from '@/components/check-in/components/MissedCheckinApprovalProcess';

interface MissedCheckinApprovalTabProps {
  missedCheckinRequests: MissedCheckinRequest[];
  onApproval: (requestId: string, action: 'approved' | 'rejected') => void;
}

const MissedCheckinApprovalTab: React.FC<MissedCheckinApprovalTabProps> = ({
  missedCheckinRequests,
  onApproval
}) => {
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

  const formatTime = (timeString?: string) => {
    if (!timeString) return '-';
    return format(new Date(timeString), 'HH:mm');
  };

  if (missedCheckinRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white/60" />
        </div>
        <p className="text-white font-medium drop-shadow-sm">目前沒有待審核的忘記打卡申請</p>
        <p className="text-white/80 mt-1 font-medium drop-shadow-sm">所有忘記打卡申請都已處理完畢</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {missedCheckinRequests.map(request => (
        <div key={request.id} className="bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <User className="h-5 w-5 text-white/80" />
                <h3 className="text-lg font-semibold text-white">申請人員：{request.staff?.name || '未知申請人'}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <span className="text-white/70">申請類型</span>
                  <div className="text-white font-medium">{getMissedTypeText(request.missed_type)}</div>
                </div>
                <div>
                  <span className="text-white/70">申請日期</span>
                  <div className="text-white font-medium">
                    {format(new Date(request.request_date), 'yyyy/MM/dd')}
                  </div>
                </div>
                {request.requested_check_in_time && (
                  <div>
                    <span className="text-white/70">上班時間</span>
                    <div className="text-white font-medium">{formatTime(request.requested_check_in_time)}</div>
                  </div>
                )}
                {request.requested_check_out_time && (
                  <div>
                    <span className="text-white/70">下班時間</span>
                    <div className="text-white font-medium">{formatTime(request.requested_check_out_time)}</div>
                  </div>
                )}
              </div>

              {request.reason && (
                <div className="mb-4 p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-white/80" />
                    <span className="text-white/70 text-sm">申請原因</span>
                  </div>
                  <p className="text-white text-sm">{request.reason}</p>
                </div>
              )}

              {/* 審核過程 */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <MissedCheckinApprovalProcess
                  status={request.status}
                  approvedByName={request.approved_by_name}
                  approvalDate={request.approval_date}
                  approvalComment={request.approval_comment}
                  rejectionReason={request.rejection_reason}
                  missedCheckinApprovalRecords={request.missed_checkin_approval_records}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 lg:ml-6">
              <Button onClick={() => onApproval(request.id, 'approved')} className="bg-green-500 hover:bg-green-600 text-white border-0" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                核准
              </Button>
              <Button onClick={() => onApproval(request.id, 'rejected')} variant="destructive" size="sm">
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

export default MissedCheckinApprovalTab;
