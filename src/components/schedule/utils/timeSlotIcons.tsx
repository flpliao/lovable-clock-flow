
import React from 'react';
import { Sun, Sunset, Moon, Clock } from 'lucide-react';

// 時間段圖示映射
export const getTimeSlotIcon = (timeSlotName: string) => {
  const name = timeSlotName.toLowerCase();
  
  if (name.includes('早班') || name.includes('morning') || name.includes('09:')) {
    return {
      icon: <Sun className="h-3 w-3 sm:h-4 sm:w-4" />,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
      label: '早'
    };
  }
  
  if (name.includes('中班') || name.includes('afternoon') || name.includes('13:')) {
    return {
      icon: <Sunset className="h-3 w-3 sm:h-4 sm:w-4" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-100',
      label: '中'
    };
  }
  
  if (name.includes('晚班') || name.includes('night') || name.includes('21:')) {
    return {
      icon: <Moon className="h-3 w-3 sm:h-4 sm:w-4" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      label: '晚'
    };
  }
  
  // 默認圖示
  return {
    icon: <Clock className="h-3 w-3 sm:h-4 sm:w-4" />,
    color: 'text-gray-500',
    bgColor: 'bg-gray-100',
    label: '班'
  };
};

// 時間段圖示組件
interface TimeSlotIconProps {
  timeSlotName: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const TimeSlotIcon: React.FC<TimeSlotIconProps> = ({ 
  timeSlotName, 
  showLabel = false,
  size = 'md'
}) => {
  const { icon, color, bgColor, label } = getTimeSlotIcon(timeSlotName);
  
  const sizeClasses = {
    sm: 'h-5 w-5 text-xs',
    md: 'h-6 w-6 text-xs',
    lg: 'h-8 w-8 text-sm'
  };
  
  return (
    <div className={`inline-flex items-center justify-center rounded-full ${bgColor} ${sizeClasses[size]}`}>
      <span className={color}>
        {showLabel ? label : icon}
      </span>
    </div>
  );
};
