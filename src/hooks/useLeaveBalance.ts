import { LeaveTypeCode } from '@/constants/leave';
import { getLeaveBalance } from '@/services/leaveTypeService';
import useEmployeeStore from '@/stores/employeeStore';
import useLeaveBalanceStore from '@/stores/leaveBalanceStore';
import useLeaveTypeStore from '@/stores/leaveTypeStore';
import { showError } from '@/utils/toast';

export const useLeaveBalance = () => {
  const {
    balances,
    isLoading,
    error,
    addBalance,
    setLoading,
    setError,
    getCurrentYearBalance,
    getAllBalancesByEmployee,
    getBalanceByLeaveCode,
  } = useLeaveBalanceStore();
  const { employee } = useEmployeeStore();
  const { leaveTypes } = useLeaveTypeStore();

  // 載入特定假別類型的餘額資料
  const loadMyLeaveBalance = async (leaveCode: string) => {
    const leaveType = leaveTypes.find(lt => lt.code === leaveCode);
    if (!leaveType) return;

    if (isLoading) return;
    setLoading(true);
    setError(null);

    try {
      // 取得餘額資料
      const balanceData = await getLeaveBalance(leaveType.slug);

      // 轉換為 store 格式
      const balance = {
        total: balanceData.max_hours_per_year,
        used: balanceData.used_hours,
        remaining: balanceData.remaining_hours,
        year: balanceData.year,
        employee_slug: employee.slug,
        leave_code: balanceData.leave_type.code,
        max_days_per_year: balanceData.max_days_per_year,
        suggestion: balanceData.suggestion,
        seniority_years: balanceData.seniority_years,
      };

      addBalance(balance);
      return balance;
    } catch (error) {
      setError(error.message);
      showError(`載入假別餘額失敗: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 載入特休餘額資料（向後相容）
  const loadMyAnnualLeaveBalance = async () => {
    return await loadMyLeaveBalance(LeaveTypeCode.ANNUAL);
  };

  return {
    // 狀態
    balances,
    isLoading,
    error,

    // 查詢方法
    getCurrentYearBalance,
    getAllBalancesByEmployee,
    getBalanceByLeaveCode,

    // 操作方法
    loadMyLeaveBalance,
    loadMyAnnualLeaveBalance, // 向後相容
  };
};
