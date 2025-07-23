import { useCurrentUser, useIsAdmin } from '@/hooks/useStores';
import { useToast } from '@/hooks/useToast';
import { staffService } from '@/services/staffService';
import { NewStaff, Staff } from '../types';
import { useStaffValidation } from './useStaffValidation';

export const useStaffAddOperation = (
  staffList: Staff[],
  setStaffList: (staffList: Staff[]) => void
) => {
  const { toast } = useToast();
  const isAdmin = useIsAdmin();
  const currentUser = useCurrentUser();
  const { validateNewStaff, getErrorMessage } = useStaffValidation();

  const addStaff = async (newStaff: NewStaff): Promise<boolean> => {
    console.log('🚀 useStaffAddOperation: 開始新增員工流程', newStaff);

    // 資料驗證
    const validationError = validateNewStaff(newStaff);
    if (validationError) {
      console.error('❌ 驗證失敗:', validationError);
      toast({
        title: '資料不完整',
        description: validationError,
        variant: 'destructive',
      });
      return false;
    }

    // 確保單位 ID 是有效的 UUID 格式
    if (
      !newStaff.branch_id ||
      newStaff.branch_id === 'placeholder-value' ||
      newStaff.branch_id === '' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(newStaff.branch_id)
    ) {
      console.error('❌ 單位 ID 格式無效:', newStaff.branch_id);
      toast({
        title: '單位選擇錯誤',
        description: '請選擇有效的單位',
        variant: 'destructive',
      });
      return false;
    }

    // 確保必要欄位有預設值，並清理資料
    const staffData: NewStaff = {
      name: newStaff.name.trim(),
      position: newStaff.position,
      department: newStaff.department,
      branch_id: newStaff.branch_id,
      branch_name: newStaff.branch_name.trim(),
      contact: newStaff.contact.trim(),
      role_id: newStaff.role_id || 'user',
      supervisor_id:
        newStaff.supervisor_id && newStaff.supervisor_id !== ''
          ? newStaff.supervisor_id
          : undefined,
      username: newStaff.username?.trim() || undefined,
      email: newStaff.email?.trim() || undefined,
    };

    console.log('📋 處理後的員工資料:', staffData);

    try {
      const data = await staffService.addStaff(staffData);

      // 更新本地狀態
      setStaffList([...staffList, data]);

      toast({
        title: '新增成功',
        description: `已成功新增員工「${data.name}」`,
      });

      console.log('✅ 員工新增完成:', data);
      return true;
    } catch (error) {
      console.error('❌ 新增員工失敗:', error);

      const errorMessage = getErrorMessage(error);
      console.error('❌ 錯誤訊息:', errorMessage);

      toast({
        title: '新增失敗',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    }
  };

  return { addStaff };
};
