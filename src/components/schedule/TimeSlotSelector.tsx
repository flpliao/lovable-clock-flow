
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
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
      <div className="grid grid-cols-1 gap-3">
        {timeSlots.map((timeSlot) => {
          const isSelected = selectedTimeSlots.includes(timeSlot.name);
          return (
            <Button
              key={timeSlot.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              onClick={() => onTimeSlotToggle(timeSlot.name)}
              className={`h-16 p-4 border-2 rounded-xl transition-all duration-200 ${
                isSelected
                  ? 'bg-white/40 border-white/50 text-black hover:bg-white/50 backdrop-blur-xl'
                  : 'bg-white/20 border-white/30 text-black hover:border-white/50 hover:bg-white/30 backdrop-blur-xl'
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
                    <span className="font-medium text-sm text-black">{timeSlot.name}</span>
                    <span className="text-xs text-black/70">
                      {timeSlot.start_time} - {timeSlot.end_time}
                    </span>
                  </div>
                </div>
                
                {isSelected && (
                  <CheckCircle2 className="h-5 w-5 text-black ml-2 flex-shrink-0" />
                )}
              </div>
            </Button>
          );
        })}
      </div>
      
      {selectedTimeSlots.length > 0 && (
        <div className="mt-4 p-3 bg-white/20 backdrop-blur-xl rounded-xl border border-white/30">
          <div className="text-sm text-black font-medium">
            已選擇 {selectedTimeSlots.length} 個時間段：
          </div>
          <div className="text-sm text-black/80 mt-1">
            {selectedTimeSlots.join('、')}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelector;
