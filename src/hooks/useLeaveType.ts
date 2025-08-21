import {
  createLeaveType,
  deleteLeaveType,
  getAllLeaveTypes,
  updateLeaveType,
} from '@/services/leaveTypeService';
import useLeaveTypeStore from '@/stores/leaveTypeStore';
import { LeaveType } from '@/types/leaveType';

export const useLeaveType = () => {
  const { leaveTypes, setLeaveTypes, addLeaveType, setLeaveType, removeLeaveType } =
    useLeaveTypeStore();

  // 載入所有請假類型
  const loadLeaveTypes = async () => {
    if (leaveTypes.length > 0) return;

    const fetchedLeaveTypes = await getAllLeaveTypes();
    setLeaveTypes(fetchedLeaveTypes);
    return fetchedLeaveTypes;
  };

  // 新增請假類型
  const handleCreateLeaveType = async (
    leaveTypeData: Omit<LeaveType, 'id' | 'slug' | 'created_at' | 'updated_at'>
  ) => {
    const newLeaveType = await createLeaveType(leaveTypeData);
    addLeaveType(newLeaveType);
  };

  // 更新請假類型
  const handleUpdateLeaveType = async (slug: string, leaveTypeData: Partial<LeaveType>) => {
    const updatedLeaveType = await updateLeaveType(slug, leaveTypeData);
    setLeaveType(slug, updatedLeaveType);
  };

  // 刪除請假類型
  const handleDeleteLeaveType = async (slug: string) => {
    const success = await deleteLeaveType(slug);

    if (success) {
      removeLeaveType(slug);
    }

    return success;
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
