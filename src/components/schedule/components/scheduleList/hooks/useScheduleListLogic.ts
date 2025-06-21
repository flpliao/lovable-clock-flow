
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

type ScheduleViewType = 'my' | 'subordinates' | 'all';

const ITEMS_PER_PAGE = 10;

interface UseScheduleListLogicProps {
  schedules: any[];
  onRemoveSchedule: (scheduleId: string) => Promise<void>;
}

export const useScheduleListLogic = ({ schedules, onRemoveSchedule }: UseScheduleListLogicProps) => {
  const { currentUser, isAdmin } = useUser();
  const { toast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeView, setActiveView] = useState<ScheduleViewType>('my');
  const [viewSchedules, setViewSchedules] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 根據選擇的視圖過濾排班記錄
  const filterSchedulesByView = (view: ScheduleViewType) => {
    if (!currentUser?.id) return [];
    
    switch (view) {
      case 'my':
        return schedules.filter(schedule => schedule.userId === currentUser.id);
      case 'subordinates':
        return [];
      case 'all':
        return isAdmin() ? schedules : schedules.filter(schedule => schedule.userId === currentUser.id);
      default:
        return schedules.filter(schedule => schedule.userId === currentUser.id);
    }
  };

  useEffect(() => {
    if (mounted && currentUser?.id) {
      const filtered = filterSchedulesByView(activeView);
      setViewSchedules(filtered);
    }
  }, [mounted, currentUser?.id, activeView, schedules]);

  const handleRefresh = async () => {
    if (currentUser?.id && !refreshing) {
      setRefreshing(true);
      try {
        const filtered = filterSchedulesByView(activeView);
        setViewSchedules(filtered);
        toast({
          title: "重新載入成功",
          description: `載入了 ${filtered.length} 筆排班記錄`,
        });
      } catch (error) {
        console.error('重新載入失敗:', error);
        toast({
          title: "重新載入失敗",
          description: "無法重新載入排班記錄",
          variant: "destructive"
        });
      } finally {
        setRefreshing(false);
      }
    }
  };

  const handleScheduleDelete = async (scheduleId: string) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有系統管理員可以刪除排班記錄",
        variant: "destructive"
      });
      return;
    }

    try {
      await onRemoveSchedule(scheduleId);
      const filtered = filterSchedulesByView(activeView);
      setViewSchedules(filtered);
    } catch (error) {
      throw error;
    }
  };

  const handleViewChange = (view: ScheduleViewType) => {
    setActiveView(view);
    setCurrentPage(1);
  };

  // 分頁邏輯
  const totalPages = Math.ceil(viewSchedules.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSchedules = viewSchedules.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const getViewTitle = (view: ScheduleViewType) => {
    switch (view) {
      case 'my': return '我的排班記錄';
      case 'subordinates': return '下屬排班記錄';
      case 'all': return '全部排班記錄';
      default: return '排班記錄';
    }
  };

  return {
    mounted,
    refreshing,
    currentPage,
    activeView,
    viewSchedules,
    currentSchedules,
    totalPages,
    currentUser,
    isAdmin: isAdmin(),
    handleRefresh,
    handleScheduleDelete,
    handleViewChange,
    handlePreviousPage,
    handleNextPage,
    getViewTitle,
  };
};
