
import React, { useEffect, useState } from 'react';
import { FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { timeSlotService, TimeSlot } from '@/services/timeSlotService';
import { useToast } from '@/hooks/use-toast';

interface TimeSlotSelectorProps {
  selectedTimeSlots: string[];
  onTimeSlotToggle: (timeSlot: string) => void;
}

const TimeSlotSelector = ({ selectedTimeSlots, onTimeSlotToggle }: TimeSlotSelectorProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTimeSlots();
  }, []);

  const loadTimeSlots = async () => {
    try {
      setLoading(true);
      const data = await timeSlotService.getActiveTimeSlots();
      setTimeSlots(data);
    } catch (error) {
      console.error('Failed to load time slots:', error);
      toast({
        title: "載入失敗",
        description: "無法載入時間段選項",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTimeSlotValue = (timeSlot: TimeSlot) => {
    return `${timeSlot.start_time}-${timeSlot.end_time}`;
  };

  return (
    <div>
      <FormLabel className="text-base font-medium">選擇時間段</FormLabel>
      <div className="mt-3 space-y-3">
        {loading ? (
          <div className="text-sm text-gray-500">載入時間段中...</div>
        ) : timeSlots.length === 0 ? (
          <div className="text-sm text-gray-500">暫無可用時間段</div>
        ) : (
          timeSlots.map(timeSlot => {
            const timeSlotValue = getTimeSlotValue(timeSlot);
            return (
              <div key={timeSlot.id} className="flex items-center space-x-3">
                <Checkbox
                  id={`time-${timeSlot.id}`}
                  checked={selectedTimeSlots.includes(timeSlotValue)}
                  onCheckedChange={() => onTimeSlotToggle(timeSlotValue)}
                />
                <label
                  htmlFor={`time-${timeSlot.id}`}
                  className="text-sm cursor-pointer flex-1 flex items-center gap-2"
                >
                  <span>{timeSlot.name}</span>
                  {!timeSlot.requires_checkin && (
                    <Badge variant="secondary" className="text-xs">
                      免打卡
                    </Badge>
                  )}
                </label>
              </div>
            );
          })
        )}
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
