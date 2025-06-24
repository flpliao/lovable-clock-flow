
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
}

export const useScheduleDragDrop = ({
  schedules,
  selectedStaffId,
  onUpdateSchedule
}: UseScheduleDragDropProps) => {
  const { toast } = useToast();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Configure drag sensors - 優化拖拽靈敏度
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5像素後開始拖拽
        delay: 100, // 100ms 延遲，避免誤觸
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

  // 簡化衝突檢查 - 可以根據需要啟用
  const conflictUsers = [];

  const hasScheduleConflict = (userId: string, date: string) => {
    // 可以在這裡添加更複雜的衝突檢查邏輯
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
    let targetDate = over.data?.current?.date || over.data?.current?.dateStr;

    if (!draggedSchedule) {
      console.log('❌ 找不到被拖拽的排班');
      return;
    }

    // 處理不同格式的目標日期
    if (typeof targetDate === 'string') {
      targetDate = new Date(targetDate);
    }
    
    if (!targetDate || isNaN(targetDate.getTime())) {
      console.log('❌ 無效的目標日期');
      return;
    }

    const newWorkDate = format(targetDate, 'yyyy-MM-dd');
    console.log('📅 目標日期:', newWorkDate, '原始日期:', draggedSchedule.workDate);
    
    // 檢查是否真的需要移動
    if (newWorkDate !== draggedSchedule.workDate) {
      try {
        console.log('📝 更新排班日期...');
        await onUpdateSchedule(draggedSchedule.id, {
          workDate: newWorkDate
        });
        
        toast({
          title: "排班已移動",
          description: `已將排班移動到 ${format(targetDate, 'MM月dd日', { locale: zhTW })}`,
        });
        
        console.log('✅ 排班移動成功');
      } catch (error) {
        console.error('❌ 排班移動失敗:', error);
        toast({
          title: "移動失敗",
          description: "無法更新排班，請稍後再試",
          variant: "destructive",
        });
      }
    } else {
      console.log('ℹ️ 排班日期沒有變化，無需更新');
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
