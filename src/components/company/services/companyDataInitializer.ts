
import { Company } from '@/types/company';
import { CompanyRepository } from './companyRepository';

export class CompanyDataInitializer {
  // 依美琦股份有限公司的正確預設資料
  private static getDefaultCompanyData(companyId: string) {
    return {
      id: companyId,
      name: '依美琦股份有限公司',
      registration_number: '53907735',
      address: '台北市中山區建國北路二段145號3樓',
      phone: '02-2542-9999',
      email: 'service@j-image.com.tw',
      website: 'https://web.sharing.tw',
      business_type: '資訊軟體服務業',
      legal_representative: '廖俊雄',
      established_date: '2015-05-27',
      capital: 5000000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

  // 強制確保公司資料存在
  static async ensureCompanyExists(companyId: string): Promise<Company | null> {
    try {
      console.log('🔍 CompanyDataInitializer: 強制確保公司資料存在...', { companyId });
      
      // 先嘗試載入現有資料
      let existingCompany = await CompanyRepository.findById(companyId);
      
      if (existingCompany && this.validateCompanyData(existingCompany)) {
        console.log('✅ CompanyDataInitializer: 找到有效的公司資料:', existingCompany.name);
        return existingCompany;
      }
      
      // 如果資料不存在或無效，強制創建
      console.log('🔧 CompanyDataInitializer: 資料不存在或無效，開始創建...');
      
      const defaultData = this.getDefaultCompanyData(companyId);
      
      // 嘗試刪除舊資料（如果存在）
      try {
        await CompanyRepository.deleteById(companyId);
        console.log('🗑️ CompanyDataInitializer: 已刪除舊資料');
      } catch (deleteError) {
        console.log('ℹ️ CompanyDataInitializer: 無需刪除舊資料');
      }
      
      // 創建新資料
      const newCompany = await CompanyRepository.create(defaultData);
      console.log('✅ CompanyDataInitializer: 成功創建依美琦股份有限公司資料:', newCompany);
      return newCompany;

    } catch (error) {
      console.error('❌ CompanyDataInitializer: 確保公司資料存在時發生錯誤:', error);
      
      // 最後一次嘗試：直接載入任何可能存在的資料
      try {
        const fallbackCompany = await CompanyRepository.findById(companyId);
        if (fallbackCompany) {
          console.log('🔄 CompanyDataInitializer: 找到備用公司資料:', fallbackCompany.name);
          return fallbackCompany;
        }
      } catch (fallbackError) {
        console.error('❌ CompanyDataInitializer: 備用載入也失敗:', fallbackError);
      }
      
      return null;
    }
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
      
      return null;
    }
  }

  // 驗證公司資料完整性
  private static validateCompanyData(company: Company): boolean {
    const requiredData = {
      name: '依美琦股份有限公司',
      registration_number: '53907735',
      legal_representative: '廖俊雄'
    };

    for (const [field, expectedValue] of Object.entries(requiredData)) {
      if (company[field as keyof Company] !== expectedValue) {
        console.log(`⚠️ 欄位 ${field} 不正確: ${company[field as keyof Company]} (期望: ${expectedValue})`);
        return false;
      }
    }

    return true;
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
