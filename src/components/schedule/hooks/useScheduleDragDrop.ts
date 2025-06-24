
import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useToast } from '@/hooks/use-toast';
import { validateDragOperation, getScheduleConflicts, DragScheduleItem } from '../utils/dragUtils';

interface UseScheduleDragDropProps {
  schedules: any[];
  selectedStaffId?: string;
  onUpdateSchedule: (id: string, updates: any) => Promise<void>;
  onRefreshSchedules?: () => Promise<void>;
}

export const useScheduleDragDrop = ({
  schedules,
  selectedStaffId,
  onUpdateSchedule,
  onRefreshSchedules
}: UseScheduleDragDropProps) => {
  const { toast } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
        delay: 100,
      },
    })
  );

  // Filter schedules if specific staff is selected
  const filteredSchedules = selectedStaffId 
    ? schedules.filter(schedule => schedule.userId === selectedStaffId)
    : schedules;

  // Convert to drag format
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

  const hasScheduleConflict = (userId: string, date: string) => {
    return false;
  };

  const handleDragStart = ({ active }: any) => {
    console.log('🚀 開始拖拽排班:', active.id);
    setActiveId(active.id);
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    console.log('🎯 拖拽結束:', { activeId: active.id, overId: over?.id });
    
    setActiveId(null);

    if (!over) {
      console.log('❌ 沒有有效的放置目標');
      return;
    }

    const draggedSchedule = dragSchedules.find(s => s.id === active.id);
    if (!draggedSchedule) {
      console.log('❌ 找不到被拖拽的排班');
      return;
    }

    // 獲取目標日期
    let targetDate = over.data?.current?.date || over.data?.current?.dateStr;
    
    // 處理不同格式的目標日期
    if (typeof targetDate === 'string') {
      targetDate = new Date(targetDate);
    }
    
    if (!targetDate || isNaN(targetDate.getTime())) {
      console.log('❌ 無效的目標日期');
      toast({
        title: "移動失敗",
        description: "無效的目標日期",
        variant: "destructive",
      });
      return;
    }

    const newWorkDate = format(targetDate, 'yyyy-MM-dd');
    console.log('📅 目標日期:', newWorkDate, '原始日期:', draggedSchedule.workDate);
    
    // 檢查是否真的需要移動
    if (newWorkDate === draggedSchedule.workDate) {
      console.log('ℹ️ 排班日期沒有變化，無需更新');
      return;
    }

    try {
      console.log('📝 開始更新排班日期...', {
        scheduleId: draggedSchedule.id,
        newWorkDate,
        originalDate: draggedSchedule.workDate
      });

      // 調用更新函數
      await onUpdateSchedule(draggedSchedule.id, {
        workDate: newWorkDate
      });
      
      // 立即刷新排班數據以確保UI同步
      if (onRefreshSchedules) {
        console.log('🔄 刷新排班數據...');
        await onRefreshSchedules();
      }
      
      toast({
        title: "排班已移動",
        description: `已將排班移動到 ${format(targetDate, 'MM月dd日', { locale: zhTW })}`,
      });
      
      console.log('✅ 排班移動成功');
    } catch (error) {
      console.error('❌ 排班移動失敗:', error);
      toast({
        title: "移動失敗",
        description: error instanceof Error ? error.message : "無法更新排班，請稍後再試",
        variant: "destructive",
      });
    }
  };

  const activeSchedule = activeId ? dragSchedules.find(s => s.id === activeId) : null;

  return {
    sensors,
    dragSchedules,
    hasScheduleConflict,
    handleDragStart,
    handleDragEnd,
    activeSchedule
  };
};
