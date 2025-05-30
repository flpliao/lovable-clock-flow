
import { Company } from '@/types/company';
import { useToast } from '@/hooks/use-toast';

export const useCompanyFormValidation = () => {
  const { toast } = useToast();

  const validateForm = (data: Partial<Company>): boolean => {
    if (!data.name?.trim()) {
      toast({
        title: "驗證失敗",
        description: "公司名稱不能為空",
        variant: "destructive"
      });
      return false;
    }

    if (!data.registration_number?.trim()) {
      toast({
        title: "驗證失敗",
        description: "統一編號不能為空",
        variant: "destructive"
      });
      return false;
    }

    if (!data.legal_representative?.trim()) {
      toast({
        title: "驗證失敗",
        description: "法定代表人不能為空",
        variant: "destructive"
      });
      return false;
    }

    if (!data.business_type?.trim()) {
      toast({
        title: "驗證失敗",
        description: "營業項目不能為空",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  return { validateForm };
};
