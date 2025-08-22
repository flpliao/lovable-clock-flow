import {
  createLeaveType,
  deleteLeaveType,
  getAllLeaveTypes,
  updateLeaveType,
} from '@/services/leaveTypeService';
import useLeaveTypeStore from '@/stores/leaveTypeStore';
import { LeaveType } from '@/types/leaveType';
import { showError, showSuccess } from '@/utils/toast';

import { useCallback, useEffect } from 'react';

export const useLeaveType = () => {
  const {
    leaveTypes,
    isLoading,
    isLoaded,
    error,
    setLeaveTypes,
    addLeaveType,
    setLeaveType,
    removeLeaveType,
    setLoading,
    setError,
    getLeaveTypeBySlug,
    getPaidLeaveTypes,
    getLeaveTypesRequiringAttachment,
    getLeaveTypeByName,
    getActiveLeaveTypes,
  } = useLeaveTypeStore();

  // 載入所有請假類型（避免重複請求）
  const loadLeaveTypes = useCallback(
    async (forceReload = false) => {
      // 如果已經載入且不是強制重新載入，則跳過
      if (isLoaded && !forceReload) return leaveTypes;

      // 如果正在載入中，則跳過
      if (isLoading) return leaveTypes;

      setLoading(true);
      setError(null);

      try {
        const fetchedLeaveTypes = await getAllLeaveTypes();
        setLeaveTypes(fetchedLeaveTypes);
        return fetchedLeaveTypes;
      } catch (error) {
        setError(error.message);
        showError(error.message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [isLoaded, isLoading, leaveTypes, setLoading, setError, setLeaveTypes]
  );

  // 新增請假類型
  const handleCreateLeaveType = async (leaveTypeData: Partial<LeaveType>): Promise<boolean> => {
    try {
      const newLeaveType = await createLeaveType(leaveTypeData);
      addLeaveType(newLeaveType);
      showSuccess('請假類型建立成功');
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  // 更新請假類型
  const handleUpdateLeaveType = async (
    slug: string,
    leaveTypeData: Partial<LeaveType>
  ): Promise<boolean> => {
    try {
      const updatedLeaveType = await updateLeaveType(slug, leaveTypeData);
      setLeaveType(slug, updatedLeaveType);
      showSuccess('請假類型更新成功');
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  // 刪除請假類型
  const handleDeleteLeaveType = async (slug: string): Promise<boolean> => {
    try {
      await deleteLeaveType(slug);
      removeLeaveType(slug);
      showSuccess('請假類型刪除成功');
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  // 管理方法 - 統一的儲存處理（新增或更新）
  const handleSave = async (data: Partial<LeaveType>, selectedLeaveType: LeaveType | null) => {
    if (selectedLeaveType) {
      return await handleUpdateLeaveType(selectedLeaveType.slug, data);
    } else {
      return await handleCreateLeaveType(data);
    }
  };

  // 管理方法 - 刪除處理
  const handleDelete = async (leaveType: LeaveType) => {
    return await handleDeleteLeaveType(leaveType.slug);
  };

  // 自動載入請假類型
  useEffect(() => {
    loadLeaveTypes();
  }, [loadLeaveTypes]);

  return {
    // 狀態
    leaveTypes,
    isLoading,
    isLoaded,
    error,

    // 查詢方法
    getLeaveTypeBySlug,
    getPaidLeaveTypes,
    getLeaveTypesRequiringAttachment,
    getLeaveTypeByName,
    getActiveLeaveTypes,

    // 操作方法
    loadLeaveTypes,
    handleCreateLeaveType,
    handleUpdateLeaveType,
    handleDeleteLeaveType,

    // 管理方法
    handleSave,
    handleDelete,
  };
};
