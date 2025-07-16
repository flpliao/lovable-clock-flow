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
import { Trash2, RefreshCw, Clock } from 'lucide-react';
import { ExtendedCheckInRecord } from '@/stores/attendanceRecordStore';
import { formatDate, formatTime } from '@/utils/checkInUtils';

interface AttendanceRecordTableProps {
  records: ExtendedCheckInRecord[];
  loading: boolean;
  canDeleteRecords: boolean;
  onDeleteRecord: (recordId: string) => void;
}

const AttendanceRecordTable: React.FC<AttendanceRecordTableProps> = ({
  records,
  loading,
  canDeleteRecords,
  onDeleteRecord,
}) => {
  // 獲取員工姓名
  const getStaffName = (record: ExtendedCheckInRecord) => {
    return record.staff?.name || '未知員工';
  };

  // 獲取員工部門
  const getStaffDepartment = (record: ExtendedCheckInRecord) => {
    return record.staff?.department || '未知部門';
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-white/60" />
        <p className="text-white/80 font-medium drop-shadow-md text-lg">正在載入打卡記錄...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/30 shadow-lg">
          <Clock className="w-10 h-10 text-white/60" />
        </div>
        <p className="text-white/80 font-semibold text-lg drop-shadow-md">
          沒有找到符合條件的打卡記錄
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
              <TableHead className="text-white/90 font-semibold">日期</TableHead>
              <TableHead className="text-white/90 font-semibold">時間</TableHead>
              <TableHead className="text-white/90 font-semibold">員工姓名</TableHead>
              <TableHead className="text-white/90 font-semibold">部門</TableHead>
              <TableHead className="text-white/90 font-semibold">動作</TableHead>
              <TableHead className="text-white/90 font-semibold">狀態</TableHead>
              <TableHead className="text-white/90 font-semibold">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.map((record: ExtendedCheckInRecord) => (
              <TableRow key={record.id} className="border-white/20 hover:bg-white/5">
                <TableCell className="text-white/90">{formatDate(record.timestamp)}</TableCell>
                <TableCell className="text-white/90">{formatTime(record.timestamp)}</TableCell>
                <TableCell className="text-white/90">{getStaffName(record)}</TableCell>
                <TableCell className="text-white/80">{getStaffDepartment(record)}</TableCell>
                <TableCell>
                  <span
                    className={`font-semibold ${
                      record.action === 'check-in' ? 'text-green-300' : 'text-blue-300'
                    }`}
                  >
                    {record.action === 'check-in' ? '上班打卡' : '下班打卡'}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-500/80 text-white border-green-400/50 backdrop-blur-xl">
                    成功
                  </Badge>
                </TableCell>
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
                                className="bg-red-500/20 border-red-400/30 text-red-300 hover:bg-red-500/30"
                                disabled={!canDeleteRecords}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>確認刪除</AlertDialogTitle>
                                <AlertDialogDescription>
                                  您確定要刪除這筆打卡記錄嗎？此操作無法復原。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>取消</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDeleteRecord(record.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  刪除
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {canDeleteRecords ? '刪除此打卡記錄' : '權限不足：需要出勤記錄刪除權限'}
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

export default AttendanceRecordTable;
