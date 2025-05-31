
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface DebugInfoProps {
  schedules: any[];
  viewableStaffIds: string[];
  selectedDate: Date;
  shiftsForSelectedDate: any[];
  viewMode: string;
}

const DebugInfo = ({
  schedules,
  viewableStaffIds,
  selectedDate,
  shiftsForSelectedDate,
  viewMode,
}: DebugInfoProps) => {
  if (process.env.NODE_ENV !== 'development') return null;

  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-yellow-800">調試信息</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-yellow-700">
        <div>總排班數量: {schedules.length}</div>
        <div>可查看排班數量: {schedules.filter(s => viewableStaffIds.includes(s.userId)).length}</div>
        <div>選定日期: {selectedDateString}</div>
        <div>該日期排班數量: {shiftsForSelectedDate.length}</div>
        <div>查看模式: {viewMode}</div>
        <div>可查看員工ID: {viewableStaffIds.join(', ')}</div>
        {schedules.length > 0 && (
          <div className="mt-2">
            <div>所有排班日期:</div>
            <div className="text-xs">
              {[...new Set(schedules.map(s => s.workDate))].sort().join(', ')}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DebugInfo;
