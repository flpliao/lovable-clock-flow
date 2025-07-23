
import { useToast } from '@/hooks/useToast';
import { PayrollService } from '@/services/payrollService';
import { useEffect, useState } from 'react';

export const usePayrollData = () => {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [salaryStructures, setSalaryStructures] = useState<any[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 載入薪資記錄
  const loadPayrolls = async () => {
    try {
      setIsLoading(true);
      const data = await PayrollService.getPayrolls();
      setPayrolls(data || []);
    } catch (error) {
      console.error('載入薪資記錄失敗:', error);
      toast({
        title: '載入失敗',
        description: '無法載入薪資記錄',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 載入薪資結構
  const loadSalaryStructures = async () => {
    try {
      const data = await PayrollService.getSalaryStructures();
      setSalaryStructures(data || []);
    } catch (error) {
      console.error('載入薪資結構失敗:', error);
      toast({
        title: '載入失敗',
        description: '無法載入薪資結構',
        variant: 'destructive',
      });
    }
  };

  // 載入請假類型
  const loadLeaveTypes = async () => {
    try {
      const data = await PayrollService.getLeaveTypes();
      setLeaveTypes(data || []);
    } catch (error) {
      console.error('載入請假類型失敗:', error);
    }
  };

  // 載入統計資料
  const loadStats = async () => {
    try {
      const data = await PayrollService.getPayrollStats();
      setStats(data);
    } catch (error) {
      console.error('載入統計資料失敗:', error);
    }
  };

  const refreshAll = () => {
    loadPayrolls();
    loadSalaryStructures();
    loadStats();
  };

  useEffect(() => {
    loadPayrolls();
    loadSalaryStructures();
    loadLeaveTypes();
    loadStats();
  }, []);

  return {
    payrolls,
    setPayrolls,
    salaryStructures,
    setSalaryStructures,
    leaveTypes,
    stats,
    isLoading,
    setIsLoading,
    loadPayrolls,
    loadSalaryStructures,
    loadStats,
    refreshAll
  };
};
