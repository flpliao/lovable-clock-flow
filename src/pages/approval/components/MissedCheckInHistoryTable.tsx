import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RequestStatus } from '@/constants/requestStatus';
import { MissedCheckInRequest } from '@/types/missedCheckInRequest';
import { formatDate, formatDateTimeSplit } from '@/utils/dateUtils';
import { AlertCircle, Calendar, Clock } from 'lucide-react';
import React from 'react';

interface MissedCheckInHistoryTableProps {
  requests: MissedCheckInRequest[];
  isLoading: boolean;
}

const MissedCheckInHistoryTable: React.FC<MissedCheckInHistoryTableProps> = ({
  requests,
  isLoading,
}) => {
  // 獲取狀態標籤配置
  const getStatusBadge = (status: RequestStatus) => {
    const statusConfig = {
      [RequestStatus.APPROVED]: {
        text: '已核准',
        className: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
      },
      [RequestStatus.REJECTED]: {
        text: '已拒絕',
        className: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
      },
      [RequestStatus.CANCELLED]: {
        text: '已取消',
        className: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
      },
      [RequestStatus.PENDING]: {
        text: '審核中',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
      },
    };

    const config = statusConfig[status] || statusConfig[RequestStatus.PENDING];
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  // 獲取請求類型標籤
  const getRequestTypeLabel = (type: string) => {
    const typeConfig = {
      check_in: {
        text: '上班打卡',
        className: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
      },
      check_out: {
        text: '下班打卡',
        className: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
      },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || {
      text: type,
      className: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return <Badge className={config.className}>{config.text}</Badge>;
  };

  const getDateTime = (dateString: string) => {
    const timeData = formatDateTimeSplit(dateString);
    if (!timeData) return '-';

    return (
      <>
        <div>{timeData.date}</div>
        <div className="text-white/60">{timeData.time}</div>
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
          <AlertCircle className="h-8 w-8 text-white/60" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">尚無忘打卡紀錄</h3>
        <p className="text-white/60">目前沒有任何忘打卡申請紀錄</p>
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

      {/* 忘打卡紀錄表格 */}
      <div className="bg-white/5 rounded-2xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/20 hover:bg-white/10">
                <TableHead className="text-white/80 font-medium">申請人</TableHead>
                <TableHead className="text-white/80 font-medium">打卡類型</TableHead>
                <TableHead className="text-white/80 font-medium">申請日期</TableHead>
                <TableHead className="text-white/80 font-medium">實際打卡時間</TableHead>
                <TableHead className="text-white/80 font-medium">申請時間</TableHead>
                <TableHead className="text-white/80 font-medium">審核時間</TableHead>
                <TableHead className="text-white/80 font-medium">審核人員</TableHead>
                <TableHead className="text-white/80 font-medium">狀態</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map(request => (
                <TableRow key={request.slug} className="border-white/10 hover:bg-white/10">
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="font-medium text-white">
                        {request.employee?.name || '未知'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getRequestTypeLabel(request.request_type)}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Calendar className="h-4 w-4 text-green-400" />
                      <span className="text-white font-medium">
                        {formatDate(request.request_date)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                      <span className="text-white font-medium">
                        {formatDate(request.checked_at)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-white/80">{getDateTime(request.created_at)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-white/80">{getDateTime(request.updated_at)}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors duration-200">
                      查看詳細
                    </button>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {getStatusBadge(request.status)}
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

export default MissedCheckInHistoryTable;
