
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { timeOptions } from './constants';

interface TimeSlotSelectorProps {
  selectedTimeSlots: string[];
  onTimeSlotToggle: (timeSlot: string) => void;
}

const TimeSlotSelector = ({ selectedTimeSlots, onTimeSlotToggle }: TimeSlotSelectorProps) => {
  return (
    <div>
      <FormLabel className="text-base font-medium">選擇時間段</FormLabel>
      <div className="mt-3 space-y-3">
        {timeOptions.map(timeOption => (
          <div key={timeOption.value} className="flex items-center space-x-3">
            <Checkbox
              id={`time-${timeOption.value}`}
              checked={selectedTimeSlots.includes(timeOption.value)}
              onCheckedChange={() => onTimeSlotToggle(timeOption.value)}
            />
            <label
              htmlFor={`time-${timeOption.value}`}
              className="text-sm cursor-pointer flex-1"
            >
              {timeOption.label}
            </label>
          </div>
        ))}
        {selectedTimeSlots.length > 0 && (
          <div className="mt-3 p-2 bg-green-50 rounded text-sm text-green-700">
            已選擇 {selectedTimeSlots.length} 個時間段
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlotSelector;
