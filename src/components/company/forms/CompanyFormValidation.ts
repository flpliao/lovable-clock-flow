
import { Company } from '@/types/company';
import { useToast } from '@/hooks/use-toast';

export class CompanyFormValidation {
  private toast: any;

  constructor(toast: any) {
    this.toast = toast;
  }

  validateForm(editedCompany: Partial<Company>): boolean {
    const requiredFields = [
      { field: 'name', name: '公司名稱' },
      { field: 'registration_number', name: '統一編號' },
      { field: 'legal_representative', name: '法定代表人' },
      { field: 'business_type', name: '營業項目' },
      { field: 'address', name: '公司地址' },
      { field: 'phone', name: '公司電話' },
      { field: 'email', name: '公司Email' }
    ];

    for (const { field, name } of requiredFields) {
      const value = editedCompany[field as keyof Company];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        this.toast({
          title: "資料不完整",
          description: `請填寫${name}`,
          variant: "destructive"
        });
        return false;
      }
    }

    // 驗證統一編號格式 (台灣統一編號為8位數字)
    const registrationNumber = (editedCompany.registration_number || '').toString().trim();
    if (!/^\d{8}$/.test(registrationNumber)) {
      this.toast({
        title: "格式錯誤",
        description: "統一編號必須為8位數字",
        variant: "destructive"
      });
      return false;
    }

    // 驗證電子郵件格式
    const email = (editedCompany.email || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.toast({
        title: "格式錯誤",
        description: "請輸入有效的電子郵件地址",
        variant: "destructive"
      });
      return false;
    }

    // 驗證資本額 (如果有填寫的話)
    if (editedCompany.capital !== null && editedCompany.capital !== undefined) {
      const capital = Number(editedCompany.capital);
      if (isNaN(capital) || capital < 0) {
        this.toast({
          title: "格式錯誤",
          description: "資本額必須為正數",
          variant: "destructive"
        });
        return false;
      }
    }

    return true;
  }
}
