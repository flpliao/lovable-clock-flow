import { Schedule } from '@/contexts/scheduling/types';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { format } from 'date-fns';
import { useCallback, useState } from 'react';

interface DragUpdateParams {
  workDate?: string;
  timeSlot?: string;
  startTime?: string;
  endTime?: string;
}

interface UseDragDropProps {
  schedules: Schedule[];
  onUpdateSchedule: (scheduleId: string, updates: DragUpdateParams) => Promise<void>;
  onRefreshSchedules?: () => Promise<void>;
}

export const useDragDrop = ({
  schedules,
  onUpdateSchedule,
  onRefreshSchedules,
}: UseDragDropProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedScheduleId, setDraggedScheduleId] = useState<string | null>(null);

  // 重置拖拽狀態
  const resetDragState = useCallback(() => {
    setIsDragging(false);
    setDraggedScheduleId(null);
  }, []);

  // 顯示所有排班，不過濾正在拖拽的項目（避免閃爍）
  const filteredSchedules = schedules;

  // 創建拖拽元素
  const makeDraggable = useCallback(
    (element: HTMLElement, scheduleId: string) => {
      console.log('useDragDrop - Making draggable:', scheduleId);

      return draggable({
        element,
        getInitialData: () => ({ scheduleId }),
        onGenerateDragPreview: () => {
          // 使用瀏覽器預設的拖拽預覽
          return {};
        },
        onDragStart: () => {
          console.log('useDragDrop - Drag started:', scheduleId);
          setIsDragging(true);
          setDraggedScheduleId(scheduleId);
        },
        onDrop: () => {
          console.log('useDragDrop - Drag ended:', scheduleId);
          // 延遲重置狀態，確保拖拽動畫完成
          setTimeout(() => {
            resetDragState();
          }, 100);
        },
      });
    },
    [resetDragState]
  );

  // 創建放置目標
  const makeDropTarget = useCallback(
    (element: HTMLElement, date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      console.log('useDragDrop - Making drop target:', dateStr);

      return dropTargetForElements({
        element,
        canDrop: ({ source }) => {
          const scheduleId = source.data.scheduleId as string;
          return scheduleId != null;
        },
        onDragEnter: () => {
          // 添加視覺反饋
          element.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
        },
        onDragLeave: () => {
          // 移除視覺反饋
          element.style.backgroundColor = '';
        },
        onDrop: async ({ source }) => {
          const scheduleId = source.data.scheduleId as string;
          console.log('useDragDrop - Drop detected:', { scheduleId, targetDate: dateStr });

          // 移除視覺反饋
          element.style.backgroundColor = '';

          if (scheduleId) {
            try {
              await onUpdateSchedule(scheduleId, {
                workDate: dateStr,
              });
              console.log('useDragDrop - Update successful');

              // 更新成功後刷新資料
              if (onRefreshSchedules) {
                await onRefreshSchedules();
              }
            } catch (error) {
              console.error('useDragDrop - Update failed:', error);
            }
          }
        },
      });
    },
    [onUpdateSchedule, onRefreshSchedules]
  );

  return {
    isDragging,
    draggedScheduleId,
    filteredSchedules,
    makeDraggable,
    makeDropTarget,
  };
};
