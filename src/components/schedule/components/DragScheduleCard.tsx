
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
        bg-white/90 backdrop-blur-md rounded-xl p-3 mb-2 cursor-grab active:cursor-grabbing 
        transition-all duration-300 border border-white/30 shadow-lg hover:shadow-xl
        ${hasConflict 
          ? 'bg-red-50/90 border-red-200/60 text-red-800' 
          : 'hover:bg-white/95 hover:border-white/50'
        }
        ${isDragging ? 'opacity-50 shadow-2xl scale-105' : 'hover:scale-[1.02]'}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <TimeSlotIcon 
            timeSlotName={schedule.timeSlot} 
            size="sm" 
          />
          <span className="font-medium truncate text-sm text-gray-800">
            {getUserName(schedule.userId)}
          </span>
        </div>
      </div>
      
      <div className="text-xs font-medium text-gray-600 mb-1">
        {displayTime}
      </div>
      
      {getUserRelation(schedule.userId) && (
        <div className="text-xs text-gray-500">
          {getUserRelation(schedule.userId)}
        </div>
      )}
    </div>
  );
};

export default DragScheduleCard;
