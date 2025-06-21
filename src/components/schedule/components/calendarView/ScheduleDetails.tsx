
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

interface ScheduleDetailsProps {
  selectedDate: Date;
  shiftsForSelectedDate: any[];
  canDeleteSchedule: (schedule: any) => boolean;
  onRemoveSchedule: (scheduleId: string) => Promise<void>;
}

const ScheduleDetails: React.FC<ScheduleDetailsProps> = ({
  selectedDate,
  shiftsForSelectedDate,
  canDeleteSchedule,
  onRemoveSchedule,
}) => {
  const { toast } = useToast();
  const { isAdmin } = useUser();

  const handleScheduleDelete = async (scheduleId: string) => {
    try {
      await onRemoveSchedule(scheduleId);
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
    }
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  if (shiftsForSelectedDate.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg p-4">
      <h4 className="text-white font-medium mb-4 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        {selectedDate.toLocaleDateString('zh-TW')} 的排班記錄
      </h4>
      <ScrollArea className="max-h-[300px]">
        <div className="space-y-2">
          {shiftsForSelectedDate.map((shift: any) => (
            <div key={shift.id} className="bg-white/20 rounded-lg p-3 flex items-center justify-between">
              <div className="flex-1">
                <div className="text-white font-medium">{shift.timeSlot}</div>
                <div className="text-white/80 text-sm">
                  {formatTimeRange(shift.startTime, shift.endTime)}
                </div>
                {shift.notes && (
                  <div className="text-white/60 text-xs mt-1">{shift.notes}</div>
                )}
              </div>
              {isAdmin() && canDeleteSchedule(shift) && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                    onClick={() => {
                      toast({
                        title: "編輯功能",
                        description: "編輯功能將在後續版本中實作",
                      });
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
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
                          onClick={() => handleScheduleDelete(shift.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          確認刪除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ScheduleDetails;
