import { LeaveTypeService } from '@/services/leaveTypeService';
import useLeaveTypeStore from '@/stores/leaveTypeStore';
import { LeaveType } from '@/types/leaveType';
import { showError } from '@/utils/toast';

export const useLeaveType = () => {
  const { leaveTypes, setLeaveTypes, addLeaveType, setLeaveType, removeLeaveType } =
    useLeaveTypeStore();

  // 載入所有請假類型
  const loadLeaveTypes = async () => {
    if (leaveTypes.length > 0) return;

    try {
      const fetchedLeaveTypes = await LeaveTypeService.getAllLeaveTypes();
      setLeaveTypes(fetchedLeaveTypes);
      return fetchedLeaveTypes;
    } catch (error) {
      showError(error.message);
    }
  };

  // 新增請假類型
  const handleCreateLeaveType = async (
    leaveTypeData: Omit<LeaveType, 'id' | 'slug' | 'created_at' | 'updated_at'>
  ) => {
    try {
      const newLeaveType = await LeaveTypeService.createLeaveType(leaveTypeData);
      addLeaveType(newLeaveType);
    } catch (error) {
      showError(error.message);
    }
  };

  // 更新請假類型
  const handleUpdateLeaveType = async (slug: string, leaveTypeData: Partial<LeaveType>) => {
    try {
      const updatedLeaveType = await LeaveTypeService.updateLeaveType(slug, leaveTypeData);
      setLeaveType(slug, updatedLeaveType);
    } catch (error) {
      showError(error.message);
    }
  };

  // 刪除請假類型
  const handleDeleteLeaveType = async (slug: string) => {
    try {
      await LeaveTypeService.deleteLeaveType(slug);
      removeLeaveType(slug);
      return true;
    } catch (error) {
      showError(error.message);
      return false;
    }
  };

  return {
    // 狀態
    leaveTypes,

    // 操作
    loadLeaveTypes,
    handleCreateLeaveType,
    handleUpdateLeaveType,
    handleDeleteLeaveType,
  };
};
