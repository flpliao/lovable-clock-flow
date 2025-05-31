
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar, Clock } from 'lucide-react';

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
    <div>
      <FormLabel className="flex items-center space-x-2 text-base font-medium mb-3">
        <Eye className="h-5 w-5 text-blue-600" />
        <span>排班預覽</span>
      </FormLabel>
      
      <div className="space-y-4">
        {/* 統計摘要 */}
        <div className="bg-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-800 mb-1">{totalSchedules}</div>
            <div className="text-sm text-blue-600">將建立的排班記錄</div>
          </div>
        </div>

        {/* 選擇的日期 */}
        {selectedDates.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                選擇日期 ({selectedDates.length} 天)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedDates.sort((a, b) => parseInt(a) - parseInt(b)).map((date) => (
                <Badge 
                  key={date} 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-800 border border-blue-200"
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
              <Clock className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                選擇時間段 ({selectedTimeSlots.length} 個)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTimeSlots.map((timeSlot) => (
                <Badge 
                  key={timeSlot} 
                  variant="secondary" 
                  className="bg-purple-100 text-purple-800 border border-purple-200"
                >
                  {timeSlot}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePreview;
