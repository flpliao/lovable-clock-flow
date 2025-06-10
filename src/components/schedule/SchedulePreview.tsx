
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

interface SchedulePreviewProps {
  selectedDates: string[];
  selectedTimeSlots: string[];
  selectedYear: string;
  selectedMonth: string;
}

const SchedulePreview = ({ selectedDates, selectedTimeSlots, selectedYear, selectedMonth }: SchedulePreviewProps) => {
  const totalSchedules = selectedDates.length * selectedTimeSlots.length;

  if (selectedDates.length === 0 && selectedTimeSlots.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* 統計摘要 */}
      <div className="bg-white/20 backdrop-blur-xl rounded-xl p-4 border border-white/30">
        <div className="text-center">
          <div className="text-2xl font-bold text-white mb-1">{totalSchedules}</div>
          <div className="text-sm text-white/80">將建立的排班記錄</div>
        </div>
      </div>

      {/* 選擇的日期 */}
      {selectedDates.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="h-4 w-4 text-white/80" />
            <span className="text-sm font-medium text-white/90">
              選擇日期 ({selectedDates.length} 天)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedDates.sort((a, b) => parseInt(a) - parseInt(b)).map((date) => (
              <Badge 
                key={date} 
                className="bg-white/30 text-white border border-white/40 text-xs backdrop-blur-xl"
              >
                {selectedYear}年{selectedMonth}月{date}日
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 選擇的時間段 */}
      {selectedTimeSlots.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-white/80" />
            <span className="text-sm font-medium text-white/90">
              選擇時間段 ({selectedTimeSlots.length} 個)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTimeSlots.map((timeSlot) => (
              <Badge 
                key={timeSlot} 
                className="bg-white/30 text-white border border-white/40 text-xs backdrop-blur-xl"
              >
                {timeSlot}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePreview;
