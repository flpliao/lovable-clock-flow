
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Badge } from '@/components/ui/badge';
import { GripVertical, AlertTriangle } from 'lucide-react';
import { TimeSlotIcon } from '../utils/timeSlotIcons';

interface DraggableScheduleCardProps {
  schedule: any;
  getUserName: (userId: string) => string;
  getUserRelation: (userId: string) => string;
  hasConflict: boolean;
  onClick: () => void;
  isSelected?: boolean;
  isInExtendedMonth?: boolean;
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

  // 模擬請假狀態（實際應該從數據庫獲取）
  const isOnLeave = Math.random() < 0.1; // 10% 機率顯示請假

  // 根據時間段獲取顏色主題
  const getTimeSlotTheme = (timeSlotName: string) => {
    const name = timeSlotName.toLowerCase();
    
    if (name.includes('早班') || name.includes('morning') || name.includes('09:')) {
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-300'
      };
    }
    
    if (name.includes('中班') || name.includes('afternoon') || name.includes('13:')) {
      return {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-300'
      };
    }
    
    if (name.includes('晚班') || name.includes('night') || name.includes('21:')) {
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-300'
      };
    }
    
    return {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-300'
    };
  };

  // 根據不同狀態調整樣式
  const getCardClasses = () => {
    let baseClasses = "text-xs p-1 rounded cursor-pointer transition-all duration-200 flex items-center gap-1";
    
    if (isInExtendedMonth) {
      return `${baseClasses} bg-gray-200 text-gray-600 border border-gray-300`;
    }
    
    if (hasConflict) {
      return `${baseClasses} bg-red-100 text-red-800 border border-red-300`;
    }
    
    if (isSelected) {
      const theme = getTimeSlotTheme(schedule.timeSlot);
      return `${baseClasses} ${theme.bg} ${theme.text} border-2 ${theme.border} ring-2 ring-blue-400`;
    }
    
    const theme = getTimeSlotTheme(schedule.timeSlot);
    return `${baseClasses} ${theme.bg} ${theme.text} border ${theme.border} hover:ring-2 hover:ring-blue-300`;
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
      
      {/* 時間段圖示 */}
      <TimeSlotIcon timeSlotName={schedule.timeSlot} size="sm" />
      
      <div className="flex-1 min-w-0">
        <div className="truncate font-medium flex items-center gap-1">
          {getUserName(schedule.userId)}
          {isOnLeave && (
            <span className="text-red-500 font-bold" title="請假">
              ✖
            </span>
          )}
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
