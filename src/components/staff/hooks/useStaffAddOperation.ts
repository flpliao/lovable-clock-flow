
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
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以新增員工",
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

    const validationError = validateNewStaff(newStaff);
    if (validationError) {
      toast({
        title: "資料不完整",
        description: validationError,
        variant: "destructive"
      });
      return false;
    }

    try {
      const staffData = {
        name: newStaff.name,
        position: newStaff.position,
        department: newStaff.department,
        branch_id: newStaff.branch_id,
        branch_name: newStaff.branch_name,
        contact: newStaff.contact,
        role: newStaff.role || 'user',
        role_id: newStaff.role_id || 'user',
        supervisor_id: newStaff.supervisor_id || null,
        username: newStaff.username || null,
        email: newStaff.email || null
      };

      const data = await StaffApiService.addStaff(staffData);
      setStaffList([...staffList, data]);
      
      toast({
        title: "新增成功",
        description: `已成功新增員工「${data.name}」`
      });
      return true;
    } catch (error) {
      console.error('新增員工失敗:', error);
      
      toast({
        title: "新增失敗",
        description: getErrorMessage(error),
        variant: "destructive"
      });
      return false;
    }
  };

  return { addStaff };
};
