
import React from 'react';

interface SchedulePreviewProps {
  selectedDates: string[];
  selectedTimeSlots: string[];
  selectedYear: string;
  selectedMonth: string;
}

const SchedulePreview = ({ selectedDates, selectedTimeSlots, selectedYear, selectedMonth }: SchedulePreviewProps) => {
  if (selectedDates.length === 0 || selectedTimeSlots.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-900 mb-2">排班預覽</h4>
      <p className="text-sm text-gray-600">
        將為選定員工在 {selectedYear}年{selectedMonth}月 安排：
      </p>
      <ul className="text-sm text-gray-600 mt-1 ml-4">
        <li>• 工作日期：{selectedDates.length} 天</li>
        <li>• 時間段：{selectedTimeSlots.length} 個</li>
        <li>• 總排班次數：{selectedDates.length * selectedTimeSlots.length} 次</li>
      </ul>
    </div>
  );
};

export default SchedulePreview;
