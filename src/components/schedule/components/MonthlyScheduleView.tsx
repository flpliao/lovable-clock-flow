
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { DndContext, DragOverlay, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { useToast } from '@/hooks/use-toast';
import DroppableCalendarCell from './DroppableCalendarCell';
import DraggableScheduleCard from './DraggableScheduleCard';
import EditScheduleDialog from './EditScheduleDialog';
import { validateDragOperation, getScheduleConflicts, DragScheduleItem } from '../utils/dragUtils';

interface MonthlyScheduleViewProps {
  selectedDate: Date;
  schedules: any[];
  getUserName: (userId: string) => string;
  selectedStaffId?: string;
  onUpdateSchedule: (id: string, updates: any) => Promise<void>;
  onDeleteSchedule: (id: string) => Promise<void>;
  timeSlots: Array<{
    id: string;
    name: string;
    start_time: string;
    end_time: string;
  }>;
}

const MonthlyScheduleView = ({ 
  selectedDate, 
  schedules, 
  getUserName, 
  selectedStaffId,
  onUpdateSchedule,
  onDeleteSchedule,
  timeSlots = []
}: MonthlyScheduleViewProps) => {
  const { toast } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 如果選擇了特定員工，過濾排班記錄
  const filteredSchedules = selectedStaffId 
    ? schedules.filter(schedule => schedule.userId === selectedStaffId)
    : schedules;

  // 轉換為拖拽格式的排班數據
  const dragSchedules: DragScheduleItem[] = useMemo(() => 
    filteredSchedules.map(schedule => ({
      id: schedule.id,
      userId: schedule.userId,
      workDate: schedule.workDate,
      timeSlot: schedule.timeSlot,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    })), 
    [filteredSchedules]
  );

  // 獲取衝突的用戶ID列表
  const conflictUsers = useMemo(() => 
    getScheduleConflicts(dragSchedules), 
    [dragSchedules]
  );

  // 檢查特定用戶和日期是否有衝突
  const hasScheduleConflict = (userId: string, date: string) => {
    return conflictUsers.includes(userId);
  };

  // 補齊月份開始前的空白天數（讓週日為第一天）
  const startPadding = getDay(monthStart);
  const paddingDays = Array(startPadding).fill(null);
  
  // 創建日期格子數據
  const calendarDays = [
    ...paddingDays,
    ...daysInMonth.map(date => ({
      date,
      label: format(date, 'd'),
      lunarDay: '', // 可以在這裡加入農曆日期邏輯
      isWeekend: getDay(date) === 0 || getDay(date) === 6
    }))
  ];

  const handleDragStart = ({ active }: any) => {
    setActiveId(active.id);
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveId(null);

    if (!over) return;

    const draggedSchedule = dragSchedules.find(s => s.id === active.id);
    const targetDate = over.data.current?.date;

    if (!draggedSchedule || !targetDate) return;

    const validation = validateDragOperation(draggedSchedule, targetDate, dragSchedules);
    
    if (!validation.isValid) {
      toast({
        title: "無法移動排班",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    const newWorkDate = format(targetDate, 'yyyy-MM-dd');
    
    if (newWorkDate !== draggedSchedule.workDate) {
      try {
        await onUpdateSchedule(draggedSchedule.id, {
          workDate: newWorkDate
        });
        
        toast({
          title: "排班已移動",
          description: `已將排班移動到 ${format(targetDate, 'MM月dd日', { locale: zhTW })}`,
        });
      } catch (error) {
        toast({
          title: "移動失敗",
          description: "無法更新排班，請稍後再試",
          variant: "destructive",
        });
      }
    }
  };

  const handleScheduleClick = (schedule: any) => {
    setSelectedSchedule(schedule);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSchedule = async (scheduleId: string, updates: any) => {
    await onUpdateSchedule(scheduleId, updates);
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    await onDeleteSchedule(scheduleId);
  };

  const activeSchedule = activeId ? dragSchedules.find(s => s.id === activeId) : null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            {format(selectedDate, 'yyyy年MM月', { locale: zhTW })} 排班總覽
            {selectedStaffId && (
              <span className="ml-2 text-sm sm:text-base text-gray-600">
                - {getUserName(selectedStaffId)}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={[]}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
              {/* 星期標題 */}
              {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
                <div 
                  key={day} 
                  className={`text-center text-xs sm:text-sm font-medium py-2 border-b border-gray-100 ${
                    index === 0 || index === 6 ? 'text-red-500 bg-red-50' : 'text-gray-700 bg-gray-50'
                  }`}
                >
                  {day}
                </div>
              ))}
              
              {/* 日期格子 */}
              {calendarDays.map((day, index) => (
                <DroppableCalendarCell
                  key={index}
                  day={day}
                  schedules={dragSchedules}
                  getUserName={getUserName}
                  getUserRelation={(userId) => selectedStaffId ? '' : ''}
                  getScheduleConflicts={hasScheduleConflict}
                  onScheduleClick={handleScheduleClick}
                  selectedScheduleId={selectedSchedule?.id}
                />
              ))}
            </div>

            {/* 拖拽預覽 */}
            <DragOverlay>
              {activeSchedule ? (
                <DraggableScheduleCard
                  schedule={activeSchedule}
                  getUserName={getUserName}
                  getUserRelation={() => ''}
                  hasConflict={false}
                  onClick={() => {}}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </CardContent>
      </Card>

      {/* 編輯對話框 */}
      <EditScheduleDialog
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedSchedule(null);
        }}
        schedule={selectedSchedule}
        timeSlots={timeSlots}
        getUserName={getUserName}
        onUpdate={handleUpdateSchedule}
        onDelete={handleDeleteSchedule}
      />
    </>
  );
};

export default MonthlyScheduleView;
