import { useStaffManagementContext } from '@/contexts/StaffManagementContext';
import { useToast } from '@/hooks/use-toast';
import { useCurrentUser, useIsAdmin } from '@/hooks/useStores';
import { useEffect, useState } from 'react';

type ScheduleViewType = 'my' | 'subordinates' | 'all';

const ITEMS_PER_PAGE = 10;

interface UseScheduleListLogicProps {
  schedules: any[];
  onRemoveSchedule: (scheduleId: string) => Promise<void>;
}

export const useScheduleListLogic = ({ schedules, onRemoveSchedule }: UseScheduleListLogicProps) => {
  const currentUser = useCurrentUser();
  const isAdmin = useIsAdmin();
  const { getSubordinates } = useStaffManagementContext();
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
    
    const subordinates = getSubordinates(currentUser.id);
    const subordinateIds = subordinates.map(s => s.id);
    
    switch (view) {
      case 'my':
        return schedules.filter(schedule => schedule.userId === currentUser.id);
      case 'subordinates':
        return schedules.filter(schedule => subordinateIds.includes(schedule.userId));
      case 'all':
        if (isAdmin) {
          return schedules;
        } else {
          // 非管理員可以看到自己和下屬的排班
          return schedules.filter(schedule => 
            schedule.userId === currentUser.id || subordinateIds.includes(schedule.userId)
          );
        }
      default:
        return schedules.filter(schedule => 
          schedule.userId === currentUser.id || subordinateIds.includes(schedule.userId)
        );
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
    const schedule = schedules.find(s => s.id === scheduleId);
    if (!schedule) return;
    
    const subordinates = getSubordinates(currentUser?.id || '');
    const canDelete = isAdmin || 
                     schedule.userId === currentUser?.id || 
                     subordinates.some(s => s.id === schedule.userId);
    
    if (!canDelete) {
      toast({
        title: "權限不足",
        description: "您只能刪除自己或下屬的排班記錄",
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
      case 'subordinates': return '下屬排班記錄（快速查看）';
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
    isAdmin,
    handleRefresh,
    handleScheduleDelete,
    handleViewChange,
    handlePreviousPage,
    handleNextPage,
    getViewTitle,
  };
};
