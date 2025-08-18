import ApprovalButtons from '@/components/common/buttons/ApprovalActionButtons';
import { ApprovalStatus } from '@/constants/approvalStatus';
import { RequestType } from '@/constants/checkInTypes';
import { MissedCheckInRequest } from '@/types/missedCheckInRequest';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { CheckCircle, FileText, User } from 'lucide-react';
import React from 'react';

interface MissedCheckinApprovalTabProps {
  missedCheckinRequests: MissedCheckInRequest[];
  onApproval: (request: MissedCheckInRequest) => void;
  onRejection: (request: MissedCheckInRequest) => void;
}

const MissedCheckinApprovalTab: React.FC<MissedCheckinApprovalTabProps> = ({
  missedCheckinRequests,
  onApproval,
  onRejection,
}) => {
  if (missedCheckinRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white/60" />
        </div>
        <p className="text-white font-medium drop-shadow-sm">目前沒有待審核的忘記打卡申請</p>
        <p className="text-white/80 mt-1 font-medium drop-shadow-sm">
          所有忘記打卡申請都已處理完畢
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {missedCheckinRequests.map(request => (
        <div
          key={request.id || request.slug}
          className="bg-white/10 rounded-2xl p-6 border border-white/20"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <User className="h-5 w-5 text-white/80" />
                <h3 className="text-lg font-semibold text-white">
                  申請人員：{request.employee.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <span className="text-white/70">申請類型</span>
                  <div className="text-white font-medium">
                    {request.request_type === RequestType.CHECK_IN ? '上班打卡' : '下班打卡'}
                  </div>
                </div>
                <div>
                  <span className="text-white/70">申請日期</span>
                  <div className="text-white font-medium">
                    {format(new Date(request.request_date), 'yyyy/MM/dd')}
                  </div>
                </div>
                <div>
                  <span className="text-white/70">打卡時間</span>
                  <div className="text-white font-medium">
                    {dayjs(request.checked_at).format('HH:mm')}
                  </div>
                </div>
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
            </div>

            <ApprovalButtons
              className="lg:ml-6"
              onApprove={() => onApproval(request)}
              onReject={() => onRejection(request)}
              size="sm"
              disabled={request.status !== ApprovalStatus.PENDING}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MissedCheckinApprovalTab;
