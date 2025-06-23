
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: schedule.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const getTimeSlotColor = (timeSlot: string) => {
    switch (timeSlot) {
      case '早班':
        return 'bg-blue-500/60 hover:bg-blue-500/80';
      case '中班':
        return 'bg-green-500/60 hover:bg-green-500/80';
      case '晚班':
        return 'bg-purple-500/60 hover:bg-purple-500/80';
      case '夜班':
        return 'bg-indigo-500/60 hover:bg-indigo-500/80';
      default:
        return 'bg-gray-500/60 hover:bg-gray-500/80';
    }
  };

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
        text-xs p-2 rounded text-white cursor-pointer transition-all
        ${getTimeSlotColor(schedule.timeSlot)}
        ${hasConflict ? 'ring-2 ring-red-400' : ''}
        ${isDragging ? 'opacity-50 scale-95' : ''}
        backdrop-blur-sm
      `}
    >
      <div className="font-medium truncate">
        {getUserName(schedule.userId)}
      </div>
      <div className="text-white/80 truncate">
        {schedule.timeSlot}
      </div>
      <div className="text-white/70 text-[10px] truncate">
        {schedule.startTime} - {schedule.endTime}
      </div>
      {hasConflict && (
        <div className="text-red-200 text-[10px] mt-1">
          ⚠️ 衝突
        </div>
      )}
    </div>
  );
};

export default DraggableScheduleCard;
