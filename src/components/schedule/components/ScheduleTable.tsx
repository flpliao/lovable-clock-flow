
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, User } from 'lucide-react';
import { TimeSlotIcon } from '../utils/timeSlotIcons';

interface ScheduleTableProps {
  shiftsForSelectedDate: any[];
  getUserName: (userId: string) => string;
  getUserRelation: (userId: string) => string;
  canDeleteSchedule: (schedule: any) => boolean;
  onRemoveSchedule: (id: string) => void;
  selectedDateNav: Date;
}

const ScheduleTable = ({
  shiftsForSelectedDate,
  getUserName,
  getUserRelation,
  canDeleteSchedule,
  onRemoveSchedule,
  selectedDateNav,
}: ScheduleTableProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          <span>
            {selectedDateNav.toLocaleDateString('zh-TW', { 
              month: 'long', 
              day: 'numeric',
              weekday: 'short'
            })} 排班
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3">
        {shiftsForSelectedDate.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <User className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm sm:text-base">此日期沒有排班記錄</p>
          </div>
        ) : (
          shiftsForSelectedDate.map((shift) => (
            <div 
              key={shift.id} 
              className="flex items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                {/* 時間段圖示 */}
                <div className="flex-shrink-0">
                  <TimeSlotIcon 
                    timeSlotName={shift.timeSlot} 
                    size="md"
                  />
                </div>
                
                {/* 員工信息 */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm sm:text-base text-gray-900 truncate">
                      {getUserName(shift.userId)}
                    </span>
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 hidden sm:inline-flex"
                    >
                      {getUserRelation(shift.userId)}
                    </Badge>
                  </div>
                  
                  {/* 手機版顯示時間段名稱 */}
                  <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:hidden">
                    {shift.timeSlot}
                  </div>
                  
                  {/* 桌面版顯示時間段名稱 */}
                  <div className="hidden sm:block text-sm text-gray-600 mt-1">
                    {shift.timeSlot}
                  </div>
                </div>
              </div>
              
              {/* 刪除按鈕 */}
              {canDeleteSchedule(shift) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveSchedule(shift.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 ml-2 flex-shrink-0"
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleTable;
