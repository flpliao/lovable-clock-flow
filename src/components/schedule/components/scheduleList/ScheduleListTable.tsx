
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/useToast';
import { Edit, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import EditScheduleInListDialog from './EditScheduleInListDialog';

type ScheduleViewType = 'my' | 'subordinates' | 'all';

interface ScheduleListTableProps {
  schedules: any[];
  activeView: ScheduleViewType;
  getUserName: (userId: string) => string;
  onDeleteSchedule: (scheduleId: string) => Promise<void>;
  onUpdateSchedule?: (scheduleId: string, updates: any) => Promise<void>;
  isAdmin: boolean;
}

const ScheduleListTable: React.FC<ScheduleListTableProps> = ({
  schedules,
  activeView,
  getUserName,
  onDeleteSchedule,
  onUpdateSchedule,
  isAdmin
}) => {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return `星期${days[date.getDay()]}`;
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  const handleScheduleDelete = async (scheduleId: string) => {
    setDeleting(scheduleId);
    try {
      await onDeleteSchedule(scheduleId);
      toast({
        title: "排班已刪除",
        description: "排班記錄已成功刪除",
      });
    } catch (error) {
      console.error('刪除排班失敗:', error);
      toast({
        title: "刪除失敗",
        description: "無法刪除排班記錄，請稍後重試",
        variant: "destructive"
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleEditClick = (schedule: any) => {
    setEditingSchedule(schedule);
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setEditingSchedule(null);
  };

  const handleScheduleUpdate = async (scheduleId: string, updates: any) => {
    try {
      if (onUpdateSchedule) {
        await onUpdateSchedule(scheduleId, updates);
        toast({
          title: "排班已更新",
          description: "排班記錄已成功更新",
        });
      }
    } catch (error) {
      console.error('更新排班失敗:', error);
      toast({
        title: "更新失敗",
        description: "無法更新排班記錄，請稍後重試",
        variant: "destructive"
      });
      throw error;
    }
  };

  return (
    <>
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg overflow-hidden">
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader className="sticky top-0 bg-white/20 backdrop-blur-xl">
              <TableRow className="border-white/20 hover:bg-white/5">
                <TableHead className="text-white/90 font-semibold">日期</TableHead>
                <TableHead className="text-white/90 font-semibold">星期</TableHead>
                {activeView !== 'my' && <TableHead className="text-white/90 font-semibold">員工姓名</TableHead>}
                <TableHead className="text-white/90 font-semibold">班別名稱</TableHead>
                <TableHead className="text-white/90 font-semibold">時間</TableHead>
                <TableHead className="text-white/90 font-semibold">備註</TableHead>
                {isAdmin && <TableHead className="text-white/90 font-semibold">操作</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule: any) => (
                <TableRow key={schedule.id} className="border-white/20 hover:bg-white/5 transition-colors duration-200">
                  <TableCell className="text-white/90 font-medium">{formatDate(schedule.workDate)}</TableCell>
                  <TableCell className="text-white/90 font-medium">{formatDayOfWeek(schedule.workDate)}</TableCell>
                  {activeView !== 'my' && (
                    <TableCell className="text-white/80">
                      {getUserName(schedule.userId) || '未知員工'}
                    </TableCell>
                  )}
                  <TableCell className="text-white/90 font-medium">{schedule.timeSlot}</TableCell>
                  <TableCell className="text-white/80">
                    {formatTimeRange(schedule.startTime, schedule.endTime)}
                  </TableCell>
                  <TableCell className="text-white/80">
                    {schedule.notes || '-'}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                          onClick={() => handleEditClick(schedule)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                              disabled={deleting === schedule.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>確認刪除排班記錄</AlertDialogTitle>
                              <AlertDialogDescription>
                                您確定要刪除這筆排班記錄嗎？刪除後將無法復原。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleScheduleDelete(schedule.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                確認刪除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      {/* Edit Dialog */}
      <EditScheduleInListDialog
        isOpen={isEditDialogOpen}
        onClose={handleEditClose}
        schedule={editingSchedule}
        getUserName={getUserName}
        onUpdate={handleScheduleUpdate}
      />
    </>
  );
};

export default ScheduleListTable;
