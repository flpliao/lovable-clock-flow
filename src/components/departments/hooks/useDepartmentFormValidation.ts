
import { useToast } from '@/components/ui/use-toast';
import { Department, NewDepartment } from '../types';

export const useDepartmentFormValidation = () => {
  const { toast } = useToast();

  const validateNewDepartment = (department: NewDepartment): boolean => {
    if (!department.name || !department.type) {
      toast({
        title: "資料不完整",
        description: "請填寫部門/門市名稱和類型",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateEditDepartment = (department: Department | null): boolean => {
    if (!department || !department.name || !department.type) {
      toast({
        title: "資料不完整",
        description: "請填寫部門/門市名稱和類型",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  return {
    validateNewDepartment,
    validateEditDepartment
  };
};
