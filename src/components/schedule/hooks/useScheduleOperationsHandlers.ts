import { useToast } from '@/hooks/useToast';
import { CreateSchedule, scheduleService } from '@/services/scheduleService';

interface UseScheduleOperationsHandlersProps {
  onScheduleUpdated?: () => void;
  onScheduleRemoved?: () => void;
}

export const useScheduleOperationsHandlers = ({
  onScheduleUpdated,
  onScheduleRemoved,
}: UseScheduleOperationsHandlersProps = {}) => {
  const { toast } = useToast();

  const handleUpdateSchedule = async (scheduleId: string, updates: Partial<CreateSchedule>) => {
    try {
      await scheduleService.updateSchedule(scheduleId, updates);
      toast({
        title: '更新成功',
        description: '排班記錄已更新',
      });
      if (onScheduleUpdated) {
        onScheduleUpdated();
      }
    } catch (error) {
      console.error('Failed to update schedule:', error);
      toast({
        title: '更新失敗',
        description: '無法更新排班記錄',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveSchedule = async (scheduleId: string) => {
    try {
      await scheduleService.deleteSchedule(scheduleId);
      toast({
        title: '刪除成功',
        description: '排班記錄已刪除',
      });
      if (onScheduleRemoved) {
        onScheduleRemoved();
      }
    } catch (error) {
      console.error('Failed to remove schedule:', error);
      toast({
        title: '刪除失敗',
        description: '無法刪除排班記錄',
        variant: 'destructive',
      });
    }
  };

  return {
    handleUpdateSchedule,
    handleRemoveSchedule,
  };
};
