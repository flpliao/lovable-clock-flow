
import { useTimeSlotOperations } from '@/components/timeslot/hooks/useTimeSlotOperations';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/useToast';
import { Calendar, Clock, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useScheduleOperations } from '../../hooks/useScheduleOperations';

interface EditScheduleInListDialogProps {
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
  onUpdate: (scheduleId: string, updates: { timeSlot?: string; startTime?: string; endTime?: string; workDate?: string; userId?: string }) => Promise<void>;
}

const EditScheduleInListDialog = ({
  isOpen,
  onClose,
  schedule,
  getUserName,
  onUpdate
}: EditScheduleInListDialogProps) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(schedule?.timeSlot || '');
  const [selectedDate, setSelectedDate] = useState(schedule?.workDate || '');
  const [selectedUserId, setSelectedUserId] = useState(schedule?.userId || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { timeSlots } = useTimeSlotOperations();
  const { getAvailableStaff } = useScheduleOperations();

  const availableStaff = getAvailableStaff();

  useEffect(() => {
    if (schedule) {
      setSelectedTimeSlot(schedule.timeSlot);
      setSelectedDate(schedule.workDate);
      setSelectedUserId(schedule.userId);
    }
  }, [schedule]);

  const handleUpdate = async () => {
    if (!schedule || !selectedTimeSlot || !selectedDate || !selectedUserId) return;
    
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

      // 如果員工有變更，也更新員工
      if (selectedUserId !== schedule.userId) {
        updates.userId = selectedUserId;
      }

      console.log('EditScheduleInListDialog - Updating schedule:', {
        scheduleId: schedule.id,
        updates
      });

      await onUpdate(schedule.id, updates);
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
            <Label className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              員工
            </Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger>
                <SelectValue placeholder="選擇員工" />
              </SelectTrigger>
              <SelectContent>
                {availableStaff.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditScheduleInListDialog;
