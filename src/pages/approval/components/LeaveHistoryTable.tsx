import StatusBadge from '@/components/common/StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RequestStatus } from '@/constants/requestStatus';
import { LeaveRequest } from '@/types/leaveRequest';
import { formatDate, formatDateTimeSplit } from '@/utils/dateUtils';
import { Calendar, Clock, FileText } from 'lucide-react';
import React from 'react';

interface LeaveHistoryTableProps {
  requests: LeaveRequest[];
  isLoading: boolean;
}

const LeaveHistoryTable: React.FC<LeaveHistoryTableProps> = ({ requests, isLoading }) => {
  const getDateTime = (dateString: string) => {
    const { date, time } = formatDateTimeSplit(dateString);

    return (
      <>
        <div>{date}</div>
        <div className="text-white/60">{time}</div>
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white/80">載入中...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="h-8 w-8 text-white/60" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">尚無請假記錄</h3>
        <p className="text-white/60">目前沒有任何請假申請記錄</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 統計資訊 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/10 rounded-lg p-4 border border-white/20">
          <div className="text-2xl font-bold text-white">{requests.length}</div>
          <div className="text-sm text-white/70">總申請數</div>
        </div>
        <div className="bg-green-500/20 rounded-lg p-4 border border-green-500/30">
          <div className="text-2xl font-bold text-green-400">
            {requests.filter(r => r.status === RequestStatus.APPROVED).length}
          </div>
          <div className="text-sm text-green-300">已核准</div>
        </div>
        <div className="bg-red-500/20 rounded-lg p-4 border border-red-500/30">
          <div className="text-2xl font-bold text-red-400">
            {requests.filter(r => r.status === RequestStatus.REJECTED).length}
          </div>
          <div className="text-sm text-red-300">已拒絕</div>
        </div>
      </div>

      {/* 請假記錄表格 */}
      <div className="bg-white/5 rounded-2xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/20 hover:bg-white/10">
                <TableHead className="text-white/80 font-medium">申請人</TableHead>
                <TableHead className="text-white/80 font-medium">請假類型</TableHead>
                <TableHead className="text-white/80 font-medium">請假期間</TableHead>
                <TableHead className="text-white/80 font-medium">時數</TableHead>
                <TableHead className="text-white/80 font-medium">申請時間</TableHead>
                <TableHead className="text-white/80 font-medium">審核時間</TableHead>
                <TableHead className="text-white/80 font-medium">審核人員</TableHead>
                <TableHead className="text-white/80 font-medium">狀態</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map(request => (
                <TableRow key={request.slug} className="border-white/10 hover:bg-white/10 ">
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-white">
                        {request.employee?.name || '未知'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">
                        {request.leave_type?.name || request.leave_type_code}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Calendar className="h-4 w-4 text-green-400" />
                      <span className="text-white font-medium">
                        {formatDate(request.start_date)} 至 {formatDate(request.end_date)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-400" />
                      <span className="text-white font-medium">{request.duration_hours} 小時</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-white/80">{getDateTime(request.created_at)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-white/80">{getDateTime(request.updated_at)}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-white font-medium">
                      {request.approvals?.[0]?.approver?.name || '系統'}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <StatusBadge status={request.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default LeaveHistoryTable;
