
import { useToast } from '@/hooks/useToast';
import { PayrollService } from '@/services/payrollService';

export const useSalaryStructureOperations = (
  loadSalaryStructures: () => Promise<void>,
  setIsLoading: (loading: boolean) => void
) => {
  const { toast } = useToast();

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

  return {
    createSalaryStructure,
    updateSalaryStructure,
    deleteSalaryStructure
  };
};
