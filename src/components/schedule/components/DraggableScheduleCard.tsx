
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { TimeSlotIcon } from '../utils/timeSlotIcons';
import { useTimeSlotOperations } from '@/components/timeslot/hooks/useTimeSlotOperations';

interface DraggableScheduleCardProps {
  schedule: any;
  getUserName: (userId: string) => string;
  getUserRelation: (userId: string) => string;
  hasConflict: boolean;
  onClick: () => void;
}

const DraggableScheduleCard = ({
  schedule,
  getUserName,
  getUserRelation,
  hasConflict,
  onClick
}: DraggableScheduleCardProps) => {
  const { timeSlots } = useTimeSlotOperations();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: schedule.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  // 根據時間段名稱找到對應的時間段資料
  const timeSlot = timeSlots.find(ts => ts.name === schedule.timeSlot);
  const displayTime = timeSlot ? `${timeSlot.start_time} - ${timeSlot.end_time}` : schedule.timeSlot;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={`
        text-xs p-1.5 rounded mb-1 cursor-pointer transition-all duration-200 border
        ${hasConflict 
          ? 'bg-red-100 border-red-300 text-red-800' 
          : 'bg-white/90 border-white/20 text-gray-800 hover:bg-white hover:shadow-sm'
        }
        ${isDragging ? 'opacity-50 z-50' : ''}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 min-w-0 flex-1">
          <TimeSlotIcon 
            timeSlotName={schedule.timeSlot} 
            size="sm" 
          />
          <span className="font-medium truncate text-xs">
            {getUserName(schedule.userId)}
          </span>
        </div>
      </div>
      
      <div className="text-xs text-gray-600 mt-0.5 truncate">
        {displayTime}
      </div>
      
      {getUserRelation(schedule.userId) && (
        <div className="text-xs text-blue-600 mt-0.5">
          {getUserRelation(schedule.userId)}
        </div>
      )}
    </div>
  );
};

export default DraggableScheduleCard;
