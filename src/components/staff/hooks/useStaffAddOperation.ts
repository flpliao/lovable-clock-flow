
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Staff, NewStaff } from '../types';
import { StaffApiService } from '../services/staffApiService';
import { useStaffValidation } from './useStaffValidation';

export const useStaffAddOperation = (
  staffList: Staff[],
  setStaffList: (staffList: Staff[]) => void
) => {
  const { toast } = useToast();
  const { isAdmin, currentUser } = useUser();
  const { validateNewStaff, getErrorMessage } = useStaffValidation();

  const addStaff = async (newStaff: NewStaff): Promise<boolean> => {
    console.log('🚀 useStaffAddOperation: 開始新增員工流程', newStaff);

    // 資料驗證
    const validationError = validateNewStaff(newStaff);
    if (validationError) {
      console.error('❌ 驗證失敗:', validationError);
      toast({
        title: "資料不完整",
        description: validationError,
        variant: "destructive"
      });
      return false;
    }

    // 確保必要欄位有預設值
    const staffData = {
      name: newStaff.name.trim(),
      position: newStaff.position,
      department: newStaff.department,
      branch_id: newStaff.branch_id,
      branch_name: newStaff.branch_name,
      contact: newStaff.contact.trim(),
      role: newStaff.role || 'user',
      role_id: newStaff.role_id || 'user',
      supervisor_id: newStaff.supervisor_id || undefined,
      username: newStaff.username?.trim() || undefined,
      email: newStaff.email?.trim() || undefined
    };

    console.log('📋 處理後的員工資料:', staffData);

    try {
      const data = await StaffApiService.addStaff(staffData);
      
      // 更新本地狀態
      setStaffList([...staffList, data]);
      
      toast({
        title: "新增成功",
        description: `已成功新增員工「${data.name}」`
      });
      
      console.log('✅ 員工新增完成:', data);
      return true;
    } catch (error) {
      console.error('❌ 新增員工失敗:', error);
      
      const errorMessage = getErrorMessage(error);
      console.error('❌ 錯誤訊息:', errorMessage);
      
      toast({
        title: "新增失敗",
        description: errorMessage,
        variant: "destructive"
      });
      return false;
    }
  };

  return { addStaff };
};
