
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
    // 檢查權限
    if (!isAdmin() && currentUser?.name !== '廖俊雄') {
      toast({
        title: "權限不足",
        description: "只有管理員可以刪除員工資料",
        variant: "destructive"
      });
      return false;
    }

    if (!currentUser?.id) {
      toast({
        title: "刪除失敗",
        description: "無法確認用戶身份",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('🗑️ 刪除員工，ID:', id, '操作者:', currentUser.name);
      
      await StaffApiService.deleteStaff(id);
      setStaffList(staffList.filter(staff => staff.id !== id));
      
      toast({
        title: "刪除成功",
        description: "已成功刪除該員工及相關資料"
      });
      return true;
    } catch (error) {
      console.error('❌ 刪除員工失敗:', error);
      
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
