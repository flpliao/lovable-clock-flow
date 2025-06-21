
import { useScheduling } from '@/contexts/SchedulingContext';
import { useToast } from '@/hooks/use-toast';

export const useScheduleOperationsHandlers = () => {
  const { updateSchedule, removeSchedule } = useScheduling();
  const { toast } = useToast();

  const handleUpdateSchedule = async (id: string, updates: any) => {
    try {
      await updateSchedule(id, updates);
      toast({
        title: "更新成功",
        description: "排班已更新",
      });
    } catch (error) {
      toast({
        title: "更新失敗",
        description: "無法更新排班，請稍後再試",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await removeSchedule(id);
      toast({
        title: "刪除成功",
        description: "排班已刪除",
      });
    } catch (error) {
      toast({
        title: "刪除失敗",
        description: "無法刪除排班，請稍後再試",
        variant: "destructive",
      });
    }
  };

  return {
    handleUpdateSchedule,
    handleDeleteSchedule
  };
};
