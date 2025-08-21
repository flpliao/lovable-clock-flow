import { RequestStatus } from '@/constants/requestStatus';
import { LeaveRequest } from '@/types/leaveRequest';
import { formatDate } from '@/utils/dateUtils';
import { AlertCircle, Calendar, CheckCircle, Clock, FileText, XCircle } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { Button } from '../ui/button';

// 狀態配置對象
const statusConfig = {
  approved: {
    icon: <CheckCircle className="h-5 w-5 text-green-400" />,
    title: '已核准',
    description: '請假申請已通過主管審核',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-400/30',
  },
  rejected: {
    icon: <XCircle className="h-5 w-5 text-red-400" />,
    title: '已退回',
    description: '請假申請已被主管退回',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-400/30',
  },
  pending: {
    icon: <AlertCircle className="h-5 w-5 text-yellow-400" />,
    title: '審核中',
    description: '請假申請已送交主管，等待審核',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-400/30',
  },
  cancelled: {
    icon: <XCircle className="h-5 w-5 text-gray-400" />,
    title: '已取消',
    description: '請假申請已被取消',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-400/30',
  },
  default: {
    icon: <AlertCircle className="h-5 w-5 text-gray-400" />,
    title: '狀態未知',
    description: '請假申請狀態不明',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-400/30',
  },
};

interface LeaveRequestItemProps {
  leaveRequest: LeaveRequest;
  onCancel?: (slug: string) => void; // 改為同步函數，只負責觸發確認
}

export function LeaveRequestItem({ leaveRequest, onCancel }: LeaveRequestItemProps) {
  const statusInfo = statusConfig[leaveRequest.status] || statusConfig.default;

  return (
    <div className="backdrop-blur-xl border border-white/30 rounded-2xl p-4 transition-all duration-200 bg-violet-400 relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-white/80" />
          <span className="font-semibold text-white drop-shadow-sm text-lg">
            {leaveRequest.leave_type?.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={leaveRequest.status} />
        </div>
      </div>

      <div className="space-y-3 text-base text-white/90">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5" />
          <span className="font-medium">
            {formatDate(leaveRequest.start_date)} - {formatDate(leaveRequest.end_date)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5" />
          <span className="font-medium">{Math.round(leaveRequest.duration_hours)} 小時</span>
        </div>

        {/* 審核狀態詳細資訊 */}
        <div className="flex items-center gap-3 mt-4 p-3 bg-white/10 rounded-lg">
          {statusInfo.icon}
          <div>
            <div className="text-white font-semibold text-sm">{statusInfo.title}</div>
            {statusInfo.description && (
              <div className="text-white/80 text-sm mt-1">{statusInfo.description}</div>
            )}
          </div>
        </div>

        {leaveRequest.reason && (
          <div className="mt-3 p-3 bg-white/10 rounded-lg">
            <p className="text-sm text-white/90 font-medium">請假原因：{leaveRequest.reason}</p>
          </div>
        )}
      </div>

      {/* 取消按鈕 - 靠右對齊 */}
      {leaveRequest.status === RequestStatus.PENDING && onCancel && (
        <div className="flex justify-end mt-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onCancel(leaveRequest.slug)}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            取消申請
          </Button>
        </div>
      )}
    </div>
  );
}

export default LeaveRequestItem;
