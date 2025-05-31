
import { usePayrollData } from './payroll/usePayrollData';
import { usePayrollOperations } from './payroll/usePayrollOperations';
import { usePayrollApproval } from './payroll/usePayrollApproval';
import { useSalaryStructureOperations } from './payroll/useSalaryStructureOperations';

export const usePayrollManagement = () => {
  const {
    payrolls,
    salaryStructures,
    leaveTypes,
    stats,
    isLoading,
    setIsLoading,
    loadPayrolls,
    loadSalaryStructures,
    loadStats,
    refreshAll
  } = usePayrollData();

  const {
    createPayroll,
    updatePayroll,
    deletePayroll
  } = usePayrollOperations(loadPayrolls, loadStats, setIsLoading);

  const {
    approvePayroll,
    rejectPayroll,
    markAsPaid
  } = usePayrollApproval(loadPayrolls, loadStats, setIsLoading);

  const {
    createSalaryStructure,
    updateSalaryStructure,
    deleteSalaryStructure
  } = useSalaryStructureOperations(loadSalaryStructures, setIsLoading);

  return {
    // 資料
    payrolls,
    salaryStructures,
    leaveTypes,
    stats,
    isLoading,
    
    // 薪資記錄操作
    createPayroll,
    updatePayroll,
    deletePayroll,
    
    // 核准和發放操作
    approvePayroll,
    rejectPayroll,
    markAsPaid,
    
    // 薪資結構操作
    createSalaryStructure,
    updateSalaryStructure,
    deleteSalaryStructure,
    
    // 重新載入
    refresh: refreshAll
  };
};
