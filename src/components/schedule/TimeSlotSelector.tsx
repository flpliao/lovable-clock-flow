
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2 } from 'lucide-react';
import { useTimeSlotOperations } from '@/components/timeslot/hooks/useTimeSlotOperations';
import { TimeSlotIcon } from './utils/timeSlotIcons';

interface TimeSlotSelectorProps {
  selectedTimeSlots: string[];
  onTimeSlotToggle: (timeSlot: string) => void;
}

const TimeSlotSelector = ({ selectedTimeSlots, onTimeSlotToggle }: TimeSlotSelectorProps) => {
  const { timeSlots } = useTimeSlotOperations();

  return (
    <div>
      <FormLabel className="flex items-center space-x-2 text-sm sm:text-base font-medium mb-2 sm:mb-3">
        <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
        <span>選擇時間段</span>
      </FormLabel>
      <div className="grid grid-cols-1 gap-2 sm:gap-3">
        {timeSlots.map((timeSlot) => {
          const isSelected = selectedTimeSlots.includes(timeSlot.name);
          return (
            <Button
              key={timeSlot.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              onClick={() => onTimeSlotToggle(timeSlot.name)}
              className={`h-14 sm:h-16 p-3 sm:p-4 border-2 rounded-lg transition-all duration-200 ${
                isSelected
                  ? 'bg-purple-500 border-purple-500 text-white hover:bg-purple-600'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  {/* 時間段圖示 */}
                  <div className="flex-shrink-0">
                    <TimeSlotIcon 
                      timeSlotName={timeSlot.name} 
                      size="md"
                    />
                  </div>
                  
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm sm:text-base">{timeSlot.name}</span>
                    <span className={`text-xs sm:text-sm ${isSelected ? 'text-purple-100' : 'text-gray-500'}`}>
                      {timeSlot.start_time} - {timeSlot.end_time}
                    </span>
                  </div>
                </div>
                
                {isSelected && (
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-white ml-2 flex-shrink-0" />
                )}
              </div>
            </Button>
          );
        })}
      </div>
      
      {selectedTimeSlots.length > 0 && (
        <div className="mt-3 sm:mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-xs sm:text-sm text-purple-700 font-medium">
            已選擇 {selectedTimeSlots.length} 個時間段：
          </div>
          <div className="text-xs sm:text-sm text-purple-600 mt-1">
            {selectedTimeSlots.join('、')}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;
