
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Clock, Trash2, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTimeSlotOperations } from '@/components/timeslot/hooks/useTimeSlotOperations';

interface EditScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: {
    id: string;
    userId: string;
    workDate: string;
    timeSlot: string;
    startTime: string;
    endTime: string;
  } | null;
  getUserName: (userId: string) => string;
  onUpdate: (scheduleId: string, updates: { timeSlot?: string; startTime?: string; endTime?: string; workDate?: string }) => Promise<void>;
  onDelete: (scheduleId: string) => Promise<void>;
}

const EditScheduleDialog = ({
  isOpen,
  onClose,
  schedule,
  getUserName,
  onUpdate,
  onDelete
}: EditScheduleDialogProps) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(schedule?.timeSlot || '');
  const [selectedDate, setSelectedDate] = useState(schedule?.workDate || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { timeSlots } = useTimeSlotOperations();

  React.useEffect(() => {
    if (schedule) {
      setSelectedTimeSlot(schedule.timeSlot);
      setSelectedDate(schedule.workDate);
    }
  }, [schedule]);

  const handleUpdate = async () => {
    if (!schedule || !selectedTimeSlot || !selectedDate) return;
    
    const timeSlot = timeSlots.find(ts => ts.name === selectedTimeSlot);
    if (!timeSlot) {
      toast({
        title: "錯誤",
        description: "找不到選擇的時間段",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUpdating(true);
      
      const updates: any = {
        timeSlot: timeSlot.name,
        startTime: timeSlot.start_time,
        endTime: timeSlot.end_time
      };

      // 如果日期有變更，也更新日期
      if (selectedDate !== schedule.workDate) {
        updates.workDate = selectedDate;
      }

      console.log('EditScheduleDialog - Updating schedule:', {
        scheduleId: schedule.id,
        updates
      });

      await onUpdate(schedule.id, updates);
      
      toast({
        title: "更新成功",
        description: "排班已更新",
      });
      onClose();
    } catch (error) {
      console.error('更新排班失敗:', error);
      toast({
        title: "更新失敗",
        description: "無法更新排班，請稍後再試",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!schedule) return;
    
    if (confirm('確定要刪除這個排班嗎？')) {
      try {
        await onDelete(schedule.id);
        toast({
          title: "刪除成功",
          description: "排班已刪除",
        });
        onClose();
      } catch (error) {
        console.error('刪除排班失敗:', error);
        toast({
          title: "刪除失敗",
          description: "無法刪除排班，請稍後再試",
          variant: "destructive"
        });
      }
    }
  };

  if (!schedule) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            編輯排班
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{getUserName(schedule.userId)}</span>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              日期
            </Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">班別類型</Label>
            <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
              <SelectTrigger>
                <SelectValue placeholder="選擇班別" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((timeSlot) => (
                  <SelectItem key={timeSlot.id} value={timeSlot.name}>
                    {timeSlot.name} ({timeSlot.start_time} - {timeSlot.end_time})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleUpdate} 
              className="flex-1"
              disabled={isUpdating}
            >
              {isUpdating ? '更新中...' : '儲存變更'}
            </Button>
            <Button variant="destructive" onClick={handleDelete} size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditScheduleDialog;
