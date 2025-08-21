import { useCurrentUser, useIsAdmin } from '@/hooks/useStores';
import { useToast } from '@/hooks/useToast';
import { staffService } from '@/services/staffService';
import { UnifiedPermissionService } from '@/services/unifiedPermissionService';
import { Staff } from '../types';
import { useStaffValidation } from './useStaffValidation';

export const useStaffUpdateOperation = (
  staffList: Staff[],
  setStaffList: (staffList: Staff[]) => void
) => {
  const { toast } = useToast();
  const isAdmin = useIsAdmin();
  const currentUser = useCurrentUser();
  const { validateStaffUpdate, getErrorMessage } = useStaffValidation();
  const permissionService = UnifiedPermissionService.getInstance();

  const updateStaff = async (updatedStaff: Staff): Promise<boolean> => {
    if (!isAdmin) {
      toast({
        title: '權限不足',
        description: '只有管理員可以編輯員工資料',
        variant: 'destructive',
      });
      return false;
    }

    if (!currentUser?.id) {
      toast({
        title: '未登入',
        description: '請先登入後再操作',
        variant: 'destructive',
      });
      return false;
    }

    const validationError = validateStaffUpdate(updatedStaff);
    if (validationError) {
      toast({
        title: '資料不完整',
        description: validationError,
        variant: 'destructive',
      });
      return false;
    }

    try {
      console.log('正在更新員工資料:', updatedStaff);

      const updateData = {
        name: updatedStaff.name.trim(),
        position: updatedStaff.position,
        department: updatedStaff.department,
        branch_id: updatedStaff.branch_id,
        branch_name: updatedStaff.branch_name || '',
        contact: updatedStaff.contact.trim(),
        role_id: updatedStaff.role_id || 'user',
        supervisor_id: updatedStaff.supervisor_id || null,
        username: updatedStaff.username || null,
        email: updatedStaff.email || null,
        hire_date: updatedStaff.hire_date || null,
      };

      console.log('準備更新的資料:', updateData);

      const data = await staffService.updateStaff(updatedStaff.id, updateData);

      console.log('更新成功的資料:', data);

      // 立即更新本地狀態
      setStaffList(staffList.map(staff => (staff.id === updatedStaff.id ? data : staff)));

      // 清除權限快取，確保權限變更即時生效
      permissionService.clearCache();

      // 觸發全域權限同步事件，通知其他組件更新
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent('permissionUpdated', {
            detail: {
              operation: 'staffRoleUpdate',
              staffData: data,
              timestamp: Date.now(),
            },
          })
        );
      }, 100);

      toast({
        title: '編輯成功',
        description: `已成功更新員工「${data.name}」的資料`,
      });
      return true;
    } catch (error) {
      console.error('更新員工失敗:', error);

      toast({
        title: '更新失敗',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
      return false;
    }
  };

  return { updateStaff };
};
