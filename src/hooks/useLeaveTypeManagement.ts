import { useToast } from '@/hooks/useToast';
import type { LeaveType } from '@/types/leaveType';
import { useCallback, useEffect } from 'react';
import { useLeaveType } from './useLeaveType';

export function useLeaveTypeManagement() {
  const { toast } = useToast();
  const {
    leaveTypes,
    isLoading,
    loadLeaveTypes: loadFromStore,
    handleCreateLeaveType,
    handleUpdateLeaveType,
    handleDeleteLeaveType,
    handleSyncDefaults,
  } = useLeaveType();

  const loadLeaveTypes = useCallback(async () => {
    await loadFromStore();
  }, [loadFromStore]);

  const handleSave = async (data: Partial<LeaveType>, selectedLeaveType: LeaveType | null) => {
    if (selectedLeaveType) {
      return await handleUpdateLeaveType(selectedLeaveType.slug, data);
    } else {
      return await handleCreateLeaveType(data);
    }
  };

  const handleDelete = async (leaveType: LeaveType) => {
    if (leaveType.is_system_default) {
      toast({
        title: '無法刪除',
        description: '系統預設假別無法刪除，但可以停用',
        variant: 'destructive',
      });
      return false;
    }

    return await handleDeleteLeaveType(leaveType.slug);
  };

  useEffect(() => {
    loadLeaveTypes();
  }, [loadLeaveTypes]);

  return {
    leaveTypes,
    isLoading,
    loadLeaveTypes,
    handleSave,
    handleDelete,
    handleSyncDefaults,
  };
}
