import { useState, useEffect } from 'react';
import { PayrollService } from '@/services/payrollService';
import { useToast } from '@/hooks/use-toast';
import type { Payroll, SalaryStructure, LeaveType } from '@/types/hr';

export const usePayrollManagement = () => {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [salaryStructures, setSalaryStructures] = useState<any[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // 模擬當前用戶資訊（實際應用中應從用戶上下文獲取）
  const currentUser = {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: '廖俊雄'
  };

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

  // 新增薪資記錄
  const createPayroll = async (payrollData: any) => {
    try {
      setIsLoading(true);
      await PayrollService.createPayroll(payrollData);
      toast({
        title: '成功',
        description: '薪資記錄已新增',
      });
      await loadPayrolls();
      await loadStats();
    } catch (error) {
      console.error('新增薪資記錄失敗:', error);
      toast({
        title: '新增失敗',
        description: '無法新增薪資記錄',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 更新薪資記錄
  const updatePayroll = async (id: string, updates: any) => {
    try {
      setIsLoading(true);
      await PayrollService.updatePayroll(id, updates);
      toast({
        title: '成功',
        description: '薪資記錄已更新',
      });
      await loadPayrolls();
      await loadStats();
    } catch (error) {
      console.error('更新薪資記錄失敗:', error);
      toast({
        title: '更新失敗',
        description: '無法更新薪資記錄',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 刪除薪資記錄
  const deletePayroll = async (id: string) => {
    try {
      setIsLoading(true);
      await PayrollService.deletePayroll(id);
      toast({
        title: '成功',
        description: '薪資記錄已刪除',
      });
      await loadPayrolls();
      await loadStats();
    } catch (error) {
      console.error('刪除薪資記錄失敗:', error);
      toast({
        title: '刪除失敗',
        description: '無法刪除薪資記錄',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 核准薪資記錄
  const approvePayroll = async (payrollId: string, comment?: string) => {
    try {
      setIsLoading(true);
      await PayrollService.approvePayroll(payrollId, currentUser.id, currentUser.name, comment);
      toast({
        title: '成功',
        description: '薪資記錄已核准',
      });
      await loadPayrolls();
      await loadStats();
    } catch (error) {
      console.error('核准薪資記錄失敗:', error);
      toast({
        title: '核准失敗',
        description: '無法核准薪資記錄',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 拒絕薪資記錄
  const rejectPayroll = async (payrollId: string, comment: string) => {
    try {
      setIsLoading(true);
      await PayrollService.rejectPayroll(payrollId, currentUser.id, currentUser.name, comment);
      toast({
        title: '成功',
        description: '薪資記錄已拒絕',
      });
      await loadPayrolls();
      await loadStats();
    } catch (error) {
      console.error('拒絕薪資記錄失敗:', error);
      toast({
        title: '拒絕失敗',
        description: '無法拒絕薪資記錄',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 標記為已發放
  const markAsPaid = async (payrollId: string, paymentData: any) => {
    try {
      setIsLoading(true);
      await PayrollService.markAsPaid(payrollId, currentUser.id, currentUser.name, paymentData);
      toast({
        title: '成功',
        description: '薪資已標記為發放',
      });
      await loadPayrolls();
      await loadStats();
    } catch (error) {
      console.error('標記發放失敗:', error);
      toast({
        title: '發放失敗',
        description: '無法標記薪資為已發放',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 新增薪資結構
  const createSalaryStructure = async (structureData: any) => {
    try {
      setIsLoading(true);
      await PayrollService.createSalaryStructure(structureData);
      toast({
        title: '成功',
        description: '薪資結構已新增',
      });
      await loadSalaryStructures();
    } catch (error) {
      console.error('新增薪資結構失敗:', error);
      toast({
        title: '新增失敗',
        description: '無法新增薪資結構',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 更新薪資結構
  const updateSalaryStructure = async (id: string, updates: any) => {
    try {
      setIsLoading(true);
      await PayrollService.updateSalaryStructure(id, updates);
      toast({
        title: '成功',
        description: '薪資結構已更新',
      });
      await loadSalaryStructures();
    } catch (error) {
      console.error('更新薪資結構失敗:', error);
      toast({
        title: '更新失敗',
        description: '無法更新薪資結構',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 刪除薪資結構
  const deleteSalaryStructure = async (id: string) => {
    try {
      setIsLoading(true);
      await PayrollService.deleteSalaryStructure(id);
      toast({
        title: '成功',
        description: '薪資結構已刪除',
      });
      await loadSalaryStructures();
    } catch (error) {
      console.error('刪除薪資結構失敗:', error);
      toast({
        title: '刪除失敗',
        description: '無法刪除薪資結構',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayrolls();
    loadSalaryStructures();
    loadLeaveTypes();
    loadStats();
  }, []);

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
    refresh: () => {
      loadPayrolls();
      loadSalaryStructures();
      loadStats();
    }
  };
};
