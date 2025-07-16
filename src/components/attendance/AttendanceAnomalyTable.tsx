import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { AttendanceAnomalyRecord } from '@/stores/attendanceRecordStore';
import { formatDate } from '@/utils/checkInUtils';

interface AttendanceAnomalyTableProps {
  anomalies: AttendanceAnomalyRecord[];
  loading: boolean;
  canCreateMissedRequests: boolean;
  onMissedCheckinCompensation: (record: AttendanceAnomalyRecord) => void;
}

const AttendanceAnomalyTable: React.FC<AttendanceAnomalyTableProps> = ({
  anomalies,
  loading,
  canCreateMissedRequests,
  onMissedCheckinCompensation,
}) => {
  // 獲取申請狀態顯示
  const getRequestStatusBadge = (record: AttendanceAnomalyRecord) => {
    if (!record.has_missed_request) {
      return <span className="text-gray-500">無</span>;
    }

    switch (record.missed_request_status) {
      case 'pending':
        return <Badge className="bg-yellow-500/80 text-white">審核中</Badge>;
      case 'approved':
        return <Badge className="bg-green-500/80 text-white">已核准</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/80 text-white">已拒絕</Badge>;
      default:
        return <Badge className="bg-gray-500/80 text-white">未知</Badge>;
    }
  };

  // 檢查是否可以進行補登
  const canCompensate = (record: AttendanceAnomalyRecord) => {
    return (
      canCreateMissedRequests &&
      !(record.has_missed_request && record.missed_request_status === 'approved')
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-white/60" />
        <p className="text-white/80 font-medium drop-shadow-md text-lg">正在分析出勤異常...</p>
      </div>
    );
  }

  if (anomalies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/30 shadow-lg">
          <AlertCircle className="w-10 h-10 text-green-400/80" />
        </div>
        <p className="text-white/80 font-semibold text-lg drop-shadow-md">
          沒有發現符合條件的出勤異常
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg overflow-hidden">
      <ScrollArea className="h-[500px]">
        <Table>
          <TableHeader className="sticky top-0 bg-white/20 backdrop-blur-xl">
            <TableRow className="border-white/20">
              <TableHead className="text-white/90 font-semibold">單位</TableHead>
              <TableHead className="text-white/90 font-semibold">姓名</TableHead>
              <TableHead className="text-white/90 font-semibold">日期</TableHead>
              <TableHead className="text-white/90 font-semibold">原因</TableHead>
              <TableHead className="text-white/90 font-semibold">表單申請紀錄</TableHead>
              <TableHead className="text-white/90 font-semibold">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anomalies.map((record: AttendanceAnomalyRecord) => (
              <TableRow key={record.id} className="border-white/20 hover:bg-white/5">
                <TableCell className="text-white/90">{record.department}</TableCell>
                <TableCell className="text-white/90">{record.staff_name}</TableCell>
                <TableCell className="text-white/90">{formatDate(record.date)}</TableCell>
                <TableCell className="text-white/80">{record.description}</TableCell>
                <TableCell>{getRequestStatusBadge(record)}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-blue-500/20 border-blue-400/30 text-blue-300 hover:bg-blue-500/30"
                                disabled={!canCompensate(record)}
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                忘打卡補登
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>確認忘打卡補登</AlertDialogTitle>
                                <AlertDialogDescription>
                                  <div className="space-y-2">
                                    <p>員工：{record.staff_name}</p>
                                    <p>日期：{formatDate(record.date)}</p>
                                    <p>異常原因：{record.description}</p>
                                    {record.schedule && (
                                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-blue-800 font-medium">
                                          將創建忘打卡申請記錄並自動核准：
                                        </p>
                                        {(record.anomaly_type === 'missing_check_in' ||
                                          record.anomaly_type === 'both_missing') && (
                                          <p className="text-sm">
                                            • 申請上班打卡時間：{record.schedule.start_time}
                                          </p>
                                        )}
                                        {(record.anomaly_type === 'missing_check_out' ||
                                          record.anomaly_type === 'both_missing') && (
                                          <p className="text-sm">
                                            • 申請下班打卡時間：{record.schedule.end_time}
                                          </p>
                                        )}
                                        <p className="text-xs text-gray-600 mt-2">
                                          * 將同時在系統中創建對應的打卡記錄
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onMissedCheckinCompensation(record)}
                                  className="bg-blue-500 hover:bg-blue-600"
                                >
                                  確認補登
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {!canCreateMissedRequests
                            ? '權限不足：需要忘打卡申請權限'
                            : record.has_missed_request &&
                                record.missed_request_status === 'approved'
                              ? '已有核准的申請記錄'
                              : '創建忘打卡補登申請'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default AttendanceAnomalyTable;
