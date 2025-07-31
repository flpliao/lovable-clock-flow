import {
  createLeaveType as createLeaveTypeService,
  deleteLeaveType as deleteLeaveTypeService,
  getAllLeaveTypes,
  updateLeaveType as updateLeaveTypeService,
} from '@/services/leaveTypeService';
import useLeaveTypeStore from '@/stores/leaveTypeStore';
import { LeaveType } from '@/types/leaveType';

export const useLeaveType = () => {
  const {
    leaveTypes,
    setLeaveTypes,
    addLeaveType,
    updateLeaveType: updateStoreLeaveType,
    removeLeaveType: removeStoreLeaveType,
  } = useLeaveTypeStore();

  // 載入所有請假類型
  const loadLeaveTypes = async () => {
    if (leaveTypes.length > 0) return;

    const fetchedLeaveTypes = await getAllLeaveTypes();
    setLeaveTypes(fetchedLeaveTypes);
    return fetchedLeaveTypes;
  };

  // 新增請假類型
  const createLeaveType = async (
    leaveTypeData: Omit<LeaveType, 'id' | 'slug' | 'created_at' | 'updated_at'>
  ) => {
    const newLeaveType = await createLeaveTypeService(leaveTypeData);
    addLeaveType(newLeaveType);
  };

  // 更新請假類型
  const updateLeaveType = async (slug: string, leaveTypeData: Partial<LeaveType>) => {
    const updatedLeaveType = await updateLeaveTypeService(slug, leaveTypeData);
    updateStoreLeaveType(slug, updatedLeaveType);
  };

  // 刪除請假類型
  const deleteLeaveType = async (slug: string) => {
    const success = await deleteLeaveTypeService(slug);

    if (success) {
      removeStoreLeaveType(slug);
    }

    return success;
  };

  return {
    // 狀態
    leaveTypes,

    // 操作
    loadLeaveTypes,
    createLeaveType,
    updateLeaveType,
    deleteLeaveType,
  };
};
