
import { useToast } from '@/hooks/useToast';
import { PayrollService } from '@/services/payrollService';

// 模擬當前用戶資訊（實際應用中應從用戶上下文獲取）
const currentUser = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  name: '廖俊雄'
};

export const usePayrollApproval = (
  loadPayrolls: () => Promise<void>,
  loadStats: () => Promise<void>,
  setIsLoading: (loading: boolean) => void
) => {
  const { toast } = useToast();

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

  return {
    approvePayroll,
    rejectPayroll,
    markAsPaid
  };
};
