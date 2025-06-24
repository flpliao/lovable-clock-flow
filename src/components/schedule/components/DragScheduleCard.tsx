
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { TimeSlotIcon } from '../utils/timeSlotIcons';
import { useTimeSlotOperations } from '@/components/timeslot/hooks/useTimeSlotOperations';

interface DragScheduleCardProps {
  schedule: any;
  getUserName: (userId: string) => string;
  getUserRelation: (userId: string) => string;
  hasConflict: boolean;
  onClick: () => void;
}

const DragScheduleCard = ({
  schedule,
  getUserName,
  getUserRelation,
  hasConflict,
  onClick
}: DragScheduleCardProps) => {
  const { timeSlots } = useTimeSlotOperations();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: schedule.id,
    data: {
      schedule: schedule
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1000 : 'auto',
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
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`
        text-xs p-2 rounded-lg mb-1 cursor-grab active:cursor-grabbing transition-all duration-200 border shadow-sm backdrop-blur-sm
        ${hasConflict 
          ? 'bg-red-100/80 border-red-200/60 text-red-800' 
          : 'bg-cyan-100/70 border-cyan-200/50 text-gray-800 hover:bg-cyan-100/80 hover:shadow-md hover:border-cyan-200/70'
        }
        ${isDragging ? 'opacity-50 shadow-2xl scale-105' : 'hover:scale-102'}
      `}
    >
      <div className="flex items-center justify-between mb-1">
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
      
      <div className="text-xs text-gray-700 mb-1 truncate">
        {displayTime}
      </div>
      
      {getUserRelation(schedule.userId) && (
        <div className="text-xs text-cyan-700">
          {getUserRelation(schedule.userId)}
        </div>
      )}
    </div>
  );
};

export default DragScheduleCard;
