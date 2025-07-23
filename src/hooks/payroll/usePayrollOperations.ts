
import { useToast } from '@/hooks/useToast';
import { PayrollService } from '@/services/payrollService';

export const usePayrollOperations = (
  loadPayrolls: () => Promise<void>,
  loadStats: () => Promise<void>,
  setIsLoading: (loading: boolean) => void
) => {
  const { toast } = useToast();

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

  return {
    createPayroll,
    updatePayroll,
    deletePayroll
  };
};
