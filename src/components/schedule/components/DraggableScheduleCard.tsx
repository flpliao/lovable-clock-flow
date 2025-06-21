
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { TimeSlotIcon } from '../utils/timeSlotIcons';

interface DraggableScheduleCardProps {
  schedule: {
    id: string;
    userId: string;
    timeSlot: string;
    workDate: string;
  };
  getUserName: (userId: string) => string;
  getUserRelation: (userId: string) => string;
  hasConflict: boolean;
  isSelected?: boolean;
  onClick: () => void;
}

const DraggableScheduleCard = ({
  schedule,
  getUserName,
  getUserRelation,
  hasConflict,
  isSelected,
  onClick
}: DraggableScheduleCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: schedule.id,
    data: schedule,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1000 : 'auto',
    opacity: isDragging ? 0.8 : 1,
  } : undefined;

  const getTimeSlotColor = (timeSlot: string) => {
    if (timeSlot.includes('早班') || timeSlot.includes('Morning')) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    if (timeSlot.includes('中班') || timeSlot.includes('Afternoon')) return 'bg-blue-100 border-blue-300 text-blue-800';
    if (timeSlot.includes('晚班') || timeSlot.includes('Evening')) return 'bg-purple-100 border-purple-300 text-purple-800';
    if (timeSlot.includes('夜班') || timeSlot.includes('Night')) return 'bg-gray-100 border-gray-300 text-gray-800';
    return 'bg-green-100 border-green-300 text-green-800';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`
        relative cursor-move p-2 rounded-lg border transition-all duration-200
        ${getTimeSlotColor(schedule.timeSlot)}
        ${isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'}
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        touch-manipulation
      `}
    >
      {hasConflict && (
        <div className="absolute -top-1 -right-1">
          <AlertTriangle className="h-4 w-4 text-red-500 fill-red-100" />
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0">
          <TimeSlotIcon timeSlotName={schedule.timeSlot} size="sm" />
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium truncate">
            {getUserName(schedule.userId)}
          </div>
          <div className="text-xs opacity-80 truncate sm:hidden">
            {schedule.timeSlot}
          </div>
        </div>
      </div>
      
      {/* 桌面版顯示班別名稱 */}
      <div className="hidden sm:block text-xs mt-1 opacity-80">
        {schedule.timeSlot}
      </div>
    </div>
  );
};

export default DraggableScheduleCard;
