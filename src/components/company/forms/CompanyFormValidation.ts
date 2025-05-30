
import { Company } from '@/types/company';

export class CompanyFormValidation {
  private toast: any;

  constructor(toast: any) {
    this.toast = toast;
  }

  validateForm(editedCompany: Partial<Company>): boolean {
    console.log('🔍 CompanyFormValidation: 開始驗證表單資料:', editedCompany);
    
    const requiredFields = [
      { field: 'name', name: '公司名稱' },
      { field: 'registration_number', name: '統一編號' },
      { field: 'legal_representative', name: '法定代表人' },
      { field: 'business_type', name: '營業項目' },
      { field: 'address', name: '公司地址' },
      { field: 'phone', name: '公司電話' },
      { field: 'email', name: '公司Email' }
    ];

    // 檢查必填欄位
    for (const { field, name } of requiredFields) {
      const value = editedCompany[field as keyof Company];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        console.log(`❌ CompanyFormValidation: 缺少必填欄位: ${name}`);
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
      console.log('❌ CompanyFormValidation: 統一編號格式錯誤:', registrationNumber);
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
      console.log('❌ CompanyFormValidation: Email格式錯誤:', email);
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
        console.log('❌ CompanyFormValidation: 資本額格式錯誤:', editedCompany.capital);
        this.toast({
          title: "格式錯誤",
          description: "資本額必須為正數",
          variant: "destructive"
        });
        return false;
      }
    }

    console.log('✅ CompanyFormValidation: 所有驗證通過');
    return true;
  }

  // 新增：驗證個別欄位的方法
  validateField(field: string, value: any): { isValid: boolean; message?: string } {
    switch (field) {
      case 'registration_number':
        const regNumber = (value || '').toString().trim();
        if (!/^\d{8}$/.test(regNumber)) {
          return { isValid: false, message: '統一編號必須為8位數字' };
        }
        break;
      
      case 'email':
        const email = (value || '').trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return { isValid: false, message: '請輸入有效的電子郵件地址' };
        }
        break;
      
      case 'capital':
        if (value !== null && value !== undefined) {
          const capital = Number(value);
          if (isNaN(capital) || capital < 0) {
            return { isValid: false, message: '資本額必須為正數' };
          }
        }
        break;
    }
    
    return { isValid: true };
  }
}
