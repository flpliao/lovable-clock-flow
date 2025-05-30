
import { Company } from '@/types/company';
import { CompanyRepository } from './companyRepository';

export class CompanyDataInitializer {
  // 依美琦股份有限公司的正確預設資料 - 與後台完全匹配
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

  // 創建新公司 - 用於手動建立
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
