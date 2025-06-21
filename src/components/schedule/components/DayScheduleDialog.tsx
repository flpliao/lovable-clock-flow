
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Clock, Calendar } from 'lucide-react';
import { TimeSlotIcon } from '../utils/timeSlotIcons';

interface DayScheduleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  schedules: Array<{
    id: string;
    userId: string;
    timeSlot: string;
    workDate: string;
    startTime: string;
    endTime: string;
  }>;
  getUserName: (userId: string) => string;
  onScheduleClick: (schedule: any) => void;
}

const DayScheduleDialog = ({
  isOpen,
  onClose,
  date,
  schedules,
  getUserName,
  onScheduleClick
}: DayScheduleDialogProps) => {
  if (!date) return null;

  const getTimeSlotColor = (timeSlot: string) => {
    if (timeSlot.includes('早班') || timeSlot.includes('Morning')) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    if (timeSlot.includes('中班') || timeSlot.includes('Afternoon')) return 'bg-blue-100 border-blue-300 text-blue-800';
    if (timeSlot.includes('晚班') || timeSlot.includes('Evening')) return 'bg-purple-100 border-purple-300 text-purple-800';
    if (timeSlot.includes('夜班') || timeSlot.includes('Night')) return 'bg-gray-100 border-gray-300 text-gray-800';
    return 'bg-green-100 border-green-300 text-green-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {date.toLocaleDateString('zh-TW', { 
              year: 'numeric',
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })} 排班詳情
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {schedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              這一天沒有排班記錄
            </div>
          ) : (
            schedules.map((schedule) => (
              <div
                key={schedule.id}
                onClick={() => {
                  onScheduleClick(schedule);
                  onClose();
                }}
                className={`
                  p-4 rounded-lg border cursor-pointer transition-all duration-200
                  ${getTimeSlotColor(schedule.timeSlot)}
                  hover:shadow-md hover:scale-[1.02]
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TimeSlotIcon timeSlotName={schedule.timeSlot} size="md" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{getUserName(schedule.userId)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3" />
                        <span>{schedule.timeSlot}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {schedule.startTime} - {schedule.endTime}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DayScheduleDialog;
