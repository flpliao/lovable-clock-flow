import { useToast } from '@/components/ui/use-toast';
import { useIsAdmin } from '@/hooks/useStores';
import { Department } from '../types';

export const useDepartmentOperations = () => {
  const { toast } = useToast();
  const isAdmin = useIsAdmin();

  const checkEditPermission = (department: Department): boolean => {
    if (!isAdmin) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯部門/門市",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  return {
    checkEditPermission,
    isAdmin
  };
};
