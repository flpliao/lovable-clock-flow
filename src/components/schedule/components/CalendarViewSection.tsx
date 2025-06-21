
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

interface CalendarViewSectionProps {
  selectedYear: number;
  selectedMonth: number;
  selectedDate: Date;
  daysInMonth: any[];
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onDateClick: (day: any) => void;
  generateYears: () => number[];
  generateMonths: () => Array<{ value: number; label: string }>;
  shiftsForSelectedDate: any[];
  canDeleteSchedule: (schedule: any) => boolean;
  onRemoveSchedule: (scheduleId: string) => Promise<void>;
  currentUser: any;
  setSelectedDate: (date: Date) => void;
  getScheduleCountForDate: (date: Date) => number;
}

const CalendarViewSection = ({
  selectedYear,
  selectedMonth,
  selectedDate,
  daysInMonth,
  onYearChange,
  onMonthChange,
  onDateClick,
  generateYears,
  generateMonths,
  shiftsForSelectedDate,
  canDeleteSchedule,
  onRemoveSchedule,
  currentUser,
  setSelectedDate,
  getScheduleCountForDate,
}: CalendarViewSectionProps) => {
  const { toast } = useToast();
  const { isAdmin } = useUser();

  const handleScheduleDelete = async (scheduleId: string) => {
    try {
      await onRemoveSchedule(scheduleId);
      toast({
        title: "排班已刪除",
        description: "排班記錄已成功刪除",
      });
    } catch (error) {
      console.error('刪除排班失敗:', error);
      toast({
        title: "刪除失敗",
        description: "無法刪除排班記錄，請稍後重試",
        variant: "destructive"
      });
    }
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
  };

  return (
    <div className="space-y-6">
      {/* 年月選擇器 */}
      <div className="flex gap-2">
        <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(parseInt(value))}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {generateYears().map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}年
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedMonth.toString()} onValueChange={(value) => onMonthChange(parseInt(value))}>
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {generateMonths().map((month) => (
              <SelectItem key={month.value} value={month.value.toString()}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 日曆網格 */}
      <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg overflow-hidden">
        {/* 星期標題 */}
        <div className="grid grid-cols-7 border-b border-white/20">
          {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
            <div 
              key={day} 
              className={`text-center text-sm font-medium py-3 text-white/90 ${
                index === 0 || index === 6 ? 'text-red-300' : ''
              }`}
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* 日期網格 */}
        <div className="grid grid-cols-7">
          {daysInMonth.map((day, index) => (
            <div key={index} className="border-r border-b border-white/10 last:border-r-0">
              {day ? (
                <button
                  type="button"
                  onClick={() => onDateClick(day)}
                  className={`w-full min-h-[80px] p-2 flex flex-col items-start justify-start text-sm transition-all hover:bg-white/20 ${
                    selectedDate && day.date && selectedDate.toDateString() === day.date.toDateString()
                      ? 'bg-white/40 text-white font-bold backdrop-blur-xl'
                      : day.isWeekend
                      ? 'text-red-300'
                      : 'text-white/90'
                  }`}
                >
                  <span className={`text-sm mb-1 ${
                    selectedDate && day.date && selectedDate.toDateString() === day.date.toDateString() 
                      ? 'font-bold' : ''
                  }`}>
                    {day.label}
                  </span>
                  {day.lunarDay && (
                    <span className={`text-xs mb-1 ${
                      selectedDate && day.date && selectedDate.toDateString() === day.date.toDateString()
                        ? 'text-white/80' 
                        : 'text-white/60'
                    }`}>
                      {day.lunarDay}
                    </span>
                  )}
                  {day.scheduleCount > 0 && (
                    <div className="text-xs bg-blue-500/60 text-white px-1 py-0.5 rounded">
                      {day.scheduleCount}班
                    </div>
                  )}
                </button>
              ) : (
                <div className="w-full min-h-[80px]"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 選中日期的排班詳情 */}
      {shiftsForSelectedDate.length > 0 && (
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg p-4">
          <h4 className="text-white font-medium mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {selectedDate.toLocaleDateString('zh-TW')} 的排班記錄
          </h4>
          <ScrollArea className="max-h-[300px]">
            <div className="space-y-2">
              {shiftsForSelectedDate.map((shift: any) => (
                <div key={shift.id} className="bg-white/20 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-white font-medium">{shift.timeSlot}</div>
                    <div className="text-white/80 text-sm">
                      {formatTimeRange(shift.startTime, shift.endTime)}
                    </div>
                    {shift.notes && (
                      <div className="text-white/60 text-xs mt-1">{shift.notes}</div>
                    )}
                  </div>
                  {isAdmin() && canDeleteSchedule(shift) && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                        onClick={() => {
                          toast({
                            title: "編輯功能",
                            description: "編輯功能將在後續版本中實作",
                          });
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>確認刪除排班記錄</AlertDialogTitle>
                            <AlertDialogDescription>
                              您確定要刪除這筆排班記錄嗎？刪除後將無法復原。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>取消</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleScheduleDelete(shift.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              確認刪除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default CalendarViewSection;
