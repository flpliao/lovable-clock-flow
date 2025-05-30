
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
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以刪除員工",
        variant: "destructive"
      });
      return false;
    }

    if (!currentUser?.id) {
      toast({
        title: "未登入",
        description: "請先登入後再操作",
        variant: "destructive"
      });
      return false;
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
