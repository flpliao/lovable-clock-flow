import { useToast } from '@/hooks/use-toast';
import { useCurrentUser } from '@/hooks/useStores';
import { CreateTimeSlot, TimeSlot, timeSlotService } from '@/services/timeSlotService';
import { useEffect, useState } from 'react';

export const useTimeSlotOperations = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const currentUser = useCurrentUser();

  const loadTimeSlots = async () => {
    try {
      setLoading(true);
      const data = await timeSlotService.getAllTimeSlots();
      setTimeSlots(data);
    } catch (error) {
      console.error('Failed to load time slots:', error);
      toast({
        title: "載入失敗",
        description: error instanceof Error ? error.message : "載入時間段失敗",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddTimeSlot = async (timeSlotData: Omit<CreateTimeSlot, 'created_by'>) => {
    if (!currentUser) return;

    try {
      const createData: CreateTimeSlot = {
        ...timeSlotData,
        created_by: currentUser.id,
      };
      await timeSlotService.createTimeSlot(createData);
      toast({
        title: "新增成功",
        description: "時間段已成功新增",
      });
      loadTimeSlots();
    } catch (error) {
      console.error('Failed to add time slot:', error);
      toast({
        title: "新增失敗",
        description: error instanceof Error ? error.message : "新增時間段失敗",
        variant: "destructive",
      });
    }
  };

  const handleEditTimeSlot = async (id: string, updates: Partial<CreateTimeSlot>) => {
    try {
      await timeSlotService.updateTimeSlot(id, updates);
      toast({
        title: "更新成功",
        description: "時間段已成功更新",
      });
      loadTimeSlots();
    } catch (error) {
      console.error('Failed to update time slot:', error);
      toast({
        title: "更新失敗",
        description: error instanceof Error ? error.message : "更新時間段失敗",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTimeSlot = async (id: string) => {
    if (!confirm('確定要刪除這個時間段嗎？')) return;

    try {
      await timeSlotService.deleteTimeSlot(id);
      toast({
        title: "刪除成功",
        description: "時間段已成功刪除",
      });
      loadTimeSlots();
    } catch (error) {
      console.error('Failed to delete time slot:', error);
      toast({
        title: "刪除失敗",
        description: error instanceof Error ? error.message : "刪除時間段失敗",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadTimeSlots();
  }, []);

  return {
    timeSlots,
    loading,
    handleAddTimeSlot,
    handleEditTimeSlot,
    handleDeleteTimeSlot,
  };
};
