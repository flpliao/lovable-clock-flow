
import { Company } from '@/types/company';
import { CompanyRepository } from './companyRepository';

export class CompanyDataInitializer {
  // 依美琦股份有限公司的正確預設資料
  private static getDefaultCompanyData(companyId: string) {
    return {
      id: companyId,
      name: '依美琦股份有限公司',
      registration_number: '53907735', // 修正為正確的統一編號
      address: '台北市中山區建國北路二段145號3樓', // 修正為正確地址
      phone: '02-2542-9999', // 修正為正確電話
      email: 'service@j-image.com.tw',
      website: 'https://web.sharing.tw',
      business_type: '資訊軟體服務業',
      legal_representative: '廖俊雄',
      established_date: '2015-05-27',
      capital: 5000000, // 確保為正確的資本額數字
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  // 創建預設的依美琦股份有限公司資料
  static async createDefaultCompany(companyId: string): Promise<Company | null> {
    try {
      console.log('🔧 CompanyDataInitializer: 創建依美琦股份有限公司資料...', { companyId });
      
      const defaultCompanyData = this.getDefaultCompanyData(companyId);
      console.log('📝 CompanyDataInitializer: 準備插入資料:', defaultCompanyData);

      const newCompany = await CompanyRepository.create(defaultCompanyData);
      console.log('✅ CompanyDataInitializer: 成功創建依美琦股份有限公司資料:', newCompany);
      return newCompany;

    } catch (error: any) {
      console.error('💥 CompanyDataInitializer: 創建預設公司資料時發生錯誤:', error);
      
      // 如果因為ID衝突等原因失敗，嘗試載入現有資料
      if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('already exists')) {
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
      
      // 最後嘗試載入任何可用的公司資料
      try {
        console.log('🔄 CompanyDataInitializer: 嘗試載入第一個可用的公司...');
        const firstCompany = await CompanyRepository.findFirstAvailable();
        if (firstCompany) {
          console.log('✅ CompanyDataInitializer: 載入到備用公司資料:', firstCompany.name);
          return firstCompany;
        }
      } catch (fallbackError) {
        console.error('❌ CompanyDataInitializer: 載入備用公司資料也失敗:', fallbackError);
      }
      
      return null;
    }
  }

  // 檢查並初始化公司資料
  static async ensureCompanyExists(companyId: string): Promise<Company | null> {
    try {
      console.log('🔍 CompanyDataInitializer: 檢查公司資料是否存在...', { companyId });
      
      // 先嘗試載入現有資料
      const existingCompany = await CompanyRepository.findById(companyId);
      if (existingCompany) {
        console.log('✅ CompanyDataInitializer: 找到現有公司資料:', existingCompany.name);
        return existingCompany;
      }
      
      // 如果不存在，創建新的
      console.log('🏢 CompanyDataInitializer: 公司資料不存在，開始創建...');
      return await this.createDefaultCompany(companyId);
      
    } catch (error) {
      console.error('❌ CompanyDataInitializer: 檢查公司資料時發生錯誤:', error);
      
      // 最後的備用方案：載入任何可用的公司
      try {
        console.log('🔄 CompanyDataInitializer: 執行最終備用方案...');
        return await CompanyRepository.findFirstAvailable();
      } catch (finalError) {
        console.error('❌ CompanyDataInitializer: 所有方案都失敗:', finalError);
        return null;
      }
    }
  }

  // 直接創建新公司 - 用於手動建立
  static async createNewCompany(companyData: any): Promise<Company | null> {
    try {
      console.log('➕ CompanyDataInitializer: 手動創建新公司資料:', companyData);
      
      // 確保所有必要欄位都有值
      const cleanedData = {
        id: companyData.id || crypto.randomUUID(),
        name: companyData.name?.trim() || '',
        registration_number: companyData.registration_number?.trim() || '',
        address: companyData.address?.trim() || '',
        phone: companyData.phone?.trim() || '',
        email: companyData.email?.trim() || '',
        website: companyData.website?.trim() || null,
        business_type: companyData.business_type?.trim() || '',
        legal_representative: companyData.legal_representative?.trim() || '',
        established_date: companyData.established_date || null,
        capital: companyData.capital ? Number(companyData.capital) : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('🧹 CompanyDataInitializer: 清理後的資料:', cleanedData);
      
      const newCompany = await CompanyRepository.create(cleanedData);
      console.log('✅ CompanyDataInitializer: 手動創建公司成功:', newCompany);
      return newCompany;

    } catch (error) {
      console.error('💥 CompanyDataInitializer: 手動創建公司失敗:', error);
      return null;
    }
  }
}
