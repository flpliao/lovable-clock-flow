import {
  bulkCreateEmployeeWorkSchedules,
  createEmployeeWorkSchedule,
  deleteEmployeeWorkSchedule,
  getEmployeeWorkSchedules,
  updateEmployeeWorkSchedule,
} from '@/services/employeeWorkScheduleService';
import { useEmployeeWorkScheduleStore } from '@/stores/employeeWorkScheduleStore';
import { EmployeeWorkSchedule } from '@/types/employeeWorkSchedule';

export const useEmployeeWorkSchedule = () => {
  const { isLoading, setIsLoading, error, setError } = useEmployeeWorkScheduleStore();

  const {
    employeeWorkSchedules,
    setEmployeeWorkSchedules,
    addEmployeeWorkSchedule,
    setEmployeeWorkSchedule,
    removeEmployeeWorkSchedule,
    reset,
    getEmployeeWorkScheduleById,
    getEmployeeWorkSchedulesByEmployeeId,
    getEmployeeWorkSchedulesByDate,
  } = useEmployeeWorkScheduleStore();

  // 載入員工工作排程資料
  const loadEmployeeWorkSchedules = async (month?: string) => {
    setIsLoading(true);
    setError(null);
    const params = month ? { date: month } : undefined;
    const data = await getEmployeeWorkSchedules(params);
    setEmployeeWorkSchedules(data);
    setIsLoading(false);
    return data;
  };

  // 添加員工工作排程
  const handleAddEmployeeWorkSchedule = async (employeeWorkSchedule: EmployeeWorkSchedule) => {
    setIsLoading(true);
    setError(null);
    const savedWorkSchedule = await createEmployeeWorkSchedule(employeeWorkSchedule);
    if (savedWorkSchedule) {
      addEmployeeWorkSchedule(savedWorkSchedule);
      setIsLoading(false);
      return savedWorkSchedule;
    } else {
      setError('新增失敗');
      setIsLoading(false);
    }
  };

  // 批量添加員工工作排程
  const handleBulkAddEmployeeWorkSchedules = async (
    employeeWorkSchedules: EmployeeWorkSchedule[]
  ) => {
    setIsLoading(true);
    setError(null);
    const savedWorkSchedules = await bulkCreateEmployeeWorkSchedules(employeeWorkSchedules);
    if (savedWorkSchedules) {
      savedWorkSchedules.forEach(schedule => addEmployeeWorkSchedule(schedule));
      setIsLoading(false);
      return savedWorkSchedules;
    } else {
      setError('批量新增失敗');
      setIsLoading(false);
    }
  };

  // 更新員工工作排程
  const handleSetEmployeeWorkSchedule = async (
    id: number,
    updates: Partial<EmployeeWorkSchedule>
  ) => {
    setIsLoading(true);
    setError(null);
    const existingSchedule = getEmployeeWorkScheduleById(id);
    if (!existingSchedule) {
      setError('找不到要更新的工作排程');
      setIsLoading(false);
      return;
    }

    const updatedWorkSchedule = await updateEmployeeWorkSchedule(
      existingSchedule.employee_id.toString(),
      updates
    );

    if (updatedWorkSchedule) {
      setEmployeeWorkSchedule(id, updatedWorkSchedule);
      setIsLoading(false);
      return true;
    } else {
      setError('更新失敗');
      setIsLoading(false);
    }
  };

  // 刪除員工工作排程
  const handleDeleteEmployeeWorkSchedule = async (id: number) => {
    setIsLoading(true);
    setError(null);
    const existingSchedule = getEmployeeWorkScheduleById(id);
    if (!existingSchedule) {
      setError('找不到要刪除的工作排程');
      setIsLoading(false);
      return;
    }

    const success = await deleteEmployeeWorkSchedule(existingSchedule.employee_id.toString());
    if (success) {
      removeEmployeeWorkSchedule(id);
      setIsLoading(false);
      return true;
    } else {
      setError('刪除失敗');
      setIsLoading(false);
    }
  };

  // 重置員工工作排程資料
  const handleResetEmployeeWorkSchedules = () => {
    reset();
  };

  return {
    // 狀態
    employeeWorkSchedules,
    isLoading,
    error,

    // 操作方法
    loadEmployeeWorkSchedules,
    handleAddEmployeeWorkSchedule,
    handleBulkAddEmployeeWorkSchedules,
    handleSetEmployeeWorkSchedule,
    handleDeleteEmployeeWorkSchedule,
    handleResetEmployeeWorkSchedules,

    // 查詢方法
    getEmployeeWorkScheduleById,
    getEmployeeWorkSchedulesByEmployeeId,
    getEmployeeWorkSchedulesByDate,

    // 直接操作方法（用於本地狀態管理）
    setEmployeeWorkSchedules,
    addEmployeeWorkSchedule,
    setEmployeeWorkSchedule,
    removeEmployeeWorkSchedule,
    reset,
  };
};
