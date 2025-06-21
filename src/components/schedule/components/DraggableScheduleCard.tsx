
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Badge } from '@/components/ui/badge';
import { GripVertical, AlertTriangle } from 'lucide-react';

interface DraggableScheduleCardProps {
  schedule: any;
  getUserName: (userId: string) => string;
  getUserRelation: (userId: string) => string;
  hasConflict: boolean;
  onClick: () => void;
  isSelected?: boolean;
  isInExtendedMonth?: boolean; // 新增：是否在延伸月份中
}

const DraggableScheduleCard = ({
  schedule,
  getUserName,
  getUserRelation,
  hasConflict,
  onClick,
  isSelected = false,
  isInExtendedMonth = false
}: DraggableScheduleCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: schedule.id,
    data: {
      type: 'schedule',
      schedule,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  // 根據不同狀態調整樣式
  const getCardClasses = () => {
    let baseClasses = "text-xs p-1 rounded cursor-pointer transition-all duration-200 flex items-center gap-1";
    
    if (isInExtendedMonth) {
      // 延伸月份中的排班使用較淺的顏色
      return `${baseClasses} bg-gray-200 text-gray-600 border border-gray-300`;
    }
    
    if (hasConflict) {
      return `${baseClasses} bg-red-100 text-red-800 border border-red-300`;
    }
    
    if (isSelected) {
      return `${baseClasses} bg-blue-200 text-blue-800 border-2 border-blue-400`;
    }
    
    return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200`;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${getCardClasses()} ${isDragging ? 'opacity-50 shadow-lg z-10' : ''}`}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-3 w-3 text-gray-400 flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        <div className="truncate font-medium">
          {getUserName(schedule.userId)}
        </div>
        <div className="truncate text-xs opacity-75">
          {schedule.timeSlot}
        </div>
      </div>
      
      {hasConflict && (
        <AlertTriangle className="h-3 w-3 text-red-500 flex-shrink-0" />
      )}
    </div>
  );
};

export default DraggableScheduleCard;
