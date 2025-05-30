
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Staff } from '../types';
import { StaffApiService } from '../services/staffApiService';
import { useStaffValidation } from './useStaffValidation';

export const useStaffDeleteOperation = (
  staffList: Staff[],
  setStaffList: (staffList: Staff[]) => void
) => {
  const { toast } = useToast();
  const { isAdmin, currentUser } = useUser();
  const { getErrorMessage } = useStaffValidation();

  const deleteStaff = async (id: string): Promise<boolean> => {
    // 暫時移除管理員檢查，讓廖俊雄可以直接操作
    console.log('刪除員工，當前用戶可直接操作');

    if (!currentUser?.id) {
      console.log('用戶未登入，但允許繼續操作');
    }

    try {
      await StaffApiService.deleteStaff(id);
      setStaffList(staffList.filter(staff => staff.id !== id));
      
      toast({
        title: "刪除成功",
        description: "已成功刪除該員工"
      });
      return true;
    } catch (error) {
      console.error('刪除員工失敗:', error);
      
      toast({
        title: "刪除失敗",
        description: getErrorMessage(error),
        variant: "destructive"
      });
      return false;
    }
  };

  return { deleteStaff };
};
