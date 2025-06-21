
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

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
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

  // Get conflict users
  const conflictUsers = useMemo(() => 
    getScheduleConflicts(dragSchedules), 
    [dragSchedules]
  );

  const hasScheduleConflict = (userId: string, date: string) => {
    return conflictUsers.includes(userId);
  };

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
