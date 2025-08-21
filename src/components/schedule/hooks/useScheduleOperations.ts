import { Staff } from '@/components/staff/types';
import { transformFromSupabase } from '@/contexts/scheduling/transformUtils';
import { Schedule } from '@/contexts/scheduling/types';
import { useToast } from '@/hooks/use-toast';
import { useCurrentUser } from '@/hooks/useStores';
import { scheduleService } from '@/services/scheduleService';
import { permissionService } from '@/services/simplifiedPermissionService';
import { useCallback, useEffect, useState } from 'react';

interface UseScheduleOperationsProps {
  staffList: Staff[];
  getSubordinates: (userId: string) => Staff[];
}

export const useScheduleOperations = ({
  staffList,
  getSubordinates,
}: UseScheduleOperationsProps) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(false);
  const currentUser = useCurrentUser();
  const { toast } = useToast();

  // 載入排班資料
  const loadSchedules = useCallback(async () => {
    try {
      setLoading(true);
      console.log('useScheduleOperations - Loading schedules...');
      const supabaseSchedules = await scheduleService.getAllSchedules();
      const transformedSchedules = supabaseSchedules.map(transformFromSupabase);
      console.log('useScheduleOperations - Loaded schedules:', transformedSchedules);
      setSchedules(transformedSchedules);
    } catch (error) {
      console.error('useScheduleOperations - Failed to load schedules:', error);
      toast({
        title: '載入失敗',
        description: '無法載入排班資料',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // 初始載入
  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  // 獲取可查看的員工列表
  const getAvailableStaff = () => {
    if (!currentUser) return [];

    const availableStaff = [];

    // 如果有查看所有排班權限，返回所有員工
    if (permissionService.hasPermission('schedule:view_all')) {
      return staffList;
    }

    // 否則返回自己和下屬
    const selfStaff = staffList.find(staff => staff.id === currentUser.id);
    if (selfStaff) {
      availableStaff.push(selfStaff);
    }

    // 加入下屬員工
    const subordinates = getSubordinates(currentUser.id);
    availableStaff.push(...subordinates);

    return availableStaff;
  };

  // 獲取用戶名稱
  const getUserName = (userId: string) => {
    const user = staffList.find(u => u.id === userId);
    return user ? user.name : '未知員工';
  };

  // 獲取用戶關係標記
  const getUserRelation = (userId: string): string => {
    try {
      if (!currentUser) return '';
      if (!userId) return '';
      if (userId === currentUser.id) return '（自己）';

      const subordinates = getSubordinates(currentUser.id);
      if (subordinates && subordinates.some(s => s.id === userId)) {
        return '（下屬）';
      }

      if (permissionService.hasPermission('schedule:view_all')) {
        return '';
      }

      return '';
    } catch (error) {
      console.error('getUserRelation error:', error);
      return '';
    }
  };

  // 刪除排班
  const handleRemoveSchedule = async (scheduleId: string) => {
    // 檢查刪除權限
    if (!permissionService.hasPermission('schedule:delete')) {
      toast({
        title: '權限不足',
        description: '您沒有權限刪除排班記錄',
        variant: 'destructive',
      });
      return;
    }

    try {
      await scheduleService.deleteSchedule(scheduleId);
      setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
      toast({
        title: '刪除成功',
        description: '排班記錄已刪除',
      });
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      toast({
        title: '刪除失敗',
        description: '無法刪除排班記錄',
        variant: 'destructive',
      });
    }
  };

  // 檢查是否可以刪除排班 - 改為同步函數
  const canDeleteSchedule = (schedule: { userId: string }): boolean => {
    if (!currentUser) return false;

    // 系統管理員可以刪除所有排班
    if (permissionService.hasPermission('schedule:delete')) {
      return true;
    }

    // 主管可以刪除下屬的排班
    const subordinates = getSubordinates(currentUser.id);
    if (subordinates.some(s => s.id === schedule.userId)) {
      return true;
    }

    // 可以刪除自己的排班（如果有相應權限）
    if (schedule.userId === currentUser.id) {
      return true;
    }

    return false;
  };

  // 檢查權限
  const canCreateSchedule =
    permissionService.hasPermission('schedule:create') ||
    getSubordinates(currentUser?.id || '').length > 0;
  const canEditSchedule =
    permissionService.hasPermission('schedule:edit') ||
    getSubordinates(currentUser?.id || '').length > 0;
  const canViewAllSchedules = permissionService.hasPermission('schedule:view_all');
  const hasSubordinates = getSubordinates(currentUser?.id || '').length > 0;

  return {
    schedules,
    loading,
    currentUser,
    getAvailableStaff,
    getUserName,
    getUserRelation,
    handleRemoveSchedule,
    canDeleteSchedule,
    hasSubordinates: hasSubordinates || canViewAllSchedules,
    canCreateSchedule,
    canEditSchedule,
    canViewAllSchedules,
    refreshSchedules: loadSchedules,
  };
};
