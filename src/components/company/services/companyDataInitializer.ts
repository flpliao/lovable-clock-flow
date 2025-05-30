
import { Company } from '@/types/company';
import { CompanyRepository } from './companyRepository';

export class CompanyDataInitializer {
  // 依美琦股份有限公司的預設資料
  private static getDefaultCompanyData(companyId: string) {
    return {
      id: companyId,
      name: '依美琦股份有限公司',
      registration_number: '53907735',
      address: '台北市中山區建國北路二段145號3樓',
      phone: '02-2507-3456',
      email: 'info@yimeichi.com.tw',
      website: 'https://yimeichi.com.tw',
      business_type: '化妝品批發業、化妝品零售業、美容服務業',
      legal_representative: '王美琦',
      established_date: '2015-03-15',
      capital: 5000000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  // 創建預設的依美琦股份有限公司資料
  static async createDefaultCompany(companyId: string): Promise<Company | null> {
    try {
      console.log('🔧 CompanyDataInitializer: 創建依美琦股份有限公司資料...');
      
      const defaultCompanyData = this.getDefaultCompanyData(companyId);
      console.log('📝 CompanyDataInitializer: 準備插入資料:', defaultCompanyData);

      const newCompany = await CompanyRepository.create(defaultCompanyData);
      console.log('✅ CompanyDataInitializer: 成功創建依美琦股份有限公司資料:', newCompany);
      return newCompany;

    } catch (error: any) {
      console.error('💥 CompanyDataInitializer: 創建預設公司資料時發生錯誤:', error);
      
      // 如果因為ID衝突等原因失敗，嘗試載入現有資料
      if (error.code === '23505') { // 唯一性約束違反
        console.log('🔄 CompanyDataInitializer: ID已存在，嘗試重新載入...');
        
        try {
          const existingCompany = await CompanyRepository.findById(companyId);
          if (existingCompany) {
            console.log('✅ CompanyDataInitializer: 找到現有公司資料:', existingCompany);
            return existingCompany;
          }
        } catch (loadError) {
          console.error('❌ CompanyDataInitializer: 載入現有資料也失敗:', loadError);
        }
      }
      
      // 如果都失敗了，嘗試載入第一個可用的公司
      try {
        return await CompanyRepository.findFirstAvailable();
      } catch (fallbackError) {
        console.error('❌ CompanyDataInitializer: 載入備用公司資料也失敗:', fallbackError);
        return null;
      }
    }
  }
}
