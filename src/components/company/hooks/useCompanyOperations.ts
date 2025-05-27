
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Company } from '@/types/company';

interface UseCompanyOperationsProps {
  setCompany: (company: Company | null) => void;
  setIsEditCompanyDialogOpen: (isOpen: boolean) => void;
}

export const useCompanyOperations = ({
  setCompany,
  setIsEditCompanyDialogOpen
}: UseCompanyOperationsProps) => {
  const { toast } = useToast();
  const { isAdmin } = useUser();

  const handleUpdateCompany = (updatedCompany: Company) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯公司資料",
        variant: "destructive"
      });
      return;
    }

    setCompany({ ...updatedCompany, updated_at: new Date().toISOString() });
    setIsEditCompanyDialogOpen(false);
    
    toast({
      title: "更新成功",
      description: "已成功更新公司基本資料"
    });
  };

  return {
    handleUpdateCompany
  };
};
