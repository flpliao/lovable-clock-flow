import { companyService } from '@/services/companyService';
import { useCompanyStore } from '@/stores/companyStore';

// hook：自動載入公司資料
export function useCompany() {
  const { company, setCompany } = useCompanyStore();

  // 取得公司資料並存入 store
  const loadCompany = async () => {
    const data = await companyService.findCompany();
    setCompany(data);
  };

  return {
    company,
    loadCompany: loadCompany,
    refresh: loadCompany,
  };
}
