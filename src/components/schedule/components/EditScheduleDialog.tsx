
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Clock, Trash2, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  timeSlots: Array<{
    id: string;
    name: string;
    start_time: string;
    end_time: string;
  }>;
  getUserName: (userId: string) => string;
  onUpdate: (scheduleId: string, updates: { timeSlot: string; startTime: string; endTime: string }) => void;
  onDelete: (scheduleId: string) => void;
}

const EditScheduleDialog = ({
  isOpen,
  onClose,
  schedule,
  timeSlots,
  getUserName,
  onUpdate,
  onDelete
}: EditScheduleDialogProps) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(schedule?.timeSlot || '');
  const { toast } = useToast();

  const handleUpdate = () => {
    if (!schedule || !selectedTimeSlot) return;
    
    const timeSlot = timeSlots.find(ts => ts.name === selectedTimeSlot);
    if (!timeSlot) return;

    onUpdate(schedule.id, {
      timeSlot: timeSlot.name,
      startTime: timeSlot.start_time,
      endTime: timeSlot.end_time
    });
    
    toast({
      title: "更新成功",
      description: "排班已更新",
    });
    onClose();
  };

  const handleDelete = () => {
    if (!schedule) return;
    
    if (confirm('確定要刪除這個排班嗎？')) {
      onDelete(schedule.id);
      toast({
        title: "刪除成功",
        description: "排班已刪除",
      });
      onClose();
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
            <span>•</span>
            <span>{new Date(schedule.workDate).toLocaleDateString('zh-TW', { 
              month: 'long', 
              day: 'numeric',
              weekday: 'short'
            })}</span>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">班別類型</label>
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
            <Button onClick={handleUpdate} className="flex-1">
              儲存變更
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
