
import { Company } from '@/types/company';
import { CompanyRepository } from './companyRepository';
import { CompanyDataInitializer } from './companyDataInitializer';
import { CompanySubscriptionManager } from './companySubscriptionManager';

export class CompanyApiService {
  private static readonly SPECIFIC_COMPANY_ID = '550e8400-e29b-41d4-a716-446655440000';

  // 載入公司資料 - 確保載入正確的資料
  static async loadCompany(): Promise<Company | null> {
    console.log('🔍 CompanyApiService: 開始載入公司資料...');
    console.log('🎯 CompanyApiService: 目標公司ID:', this.SPECIFIC_COMPANY_ID);
    
    try {
      // 1. 首先嘗試載入指定ID的公司
      let company = await CompanyRepository.findById(this.SPECIFIC_COMPANY_ID);
      
      if (company) {
        console.log('✅ CompanyApiService: 成功載入現有公司資料:', company.name);
        // 驗證資料完整性
        if (this.validateCompanyData(company)) {
          return company;
        } else {
          console.log('⚠️ CompanyApiService: 公司資料不完整，需要更新');
        }
      }

      // 2. 如果找不到或資料不完整，創建新的預設公司資料
      console.log('🔧 CompanyApiService: 創建或更新公司資料...');
      company = await CompanyDataInitializer.ensureCompanyExists(this.SPECIFIC_COMPANY_ID);
      
      if (company) {
        console.log('✅ CompanyApiService: 成功確保公司資料存在:', company.name);
        return company;
      }

      console.log('❌ CompanyApiService: 無法創建或載入公司資料');
      return null;

    } catch (error) {
      console.error('💥 CompanyApiService: 載入公司資料時發生錯誤:', error);
      return null;
    }
  }

  // 驗證公司資料完整性
  private static validateCompanyData(company: Company): boolean {
    const requiredFields = ['name', 'registration_number', 'address', 'phone', 'email'];
    const expectedValues = {
      name: '依美琦股份有限公司',
      registration_number: '53907735',
      address: '台北市中山區建國北路二段145號3樓'
    };

    // 檢查必填欄位
    for (const field of requiredFields) {
      if (!company[field as keyof Company]) {
        console.log(`⚠️ CompanyApiService: 缺少必填欄位: ${field}`);
        return false;
      }
    }

    // 檢查關鍵欄位是否正確
    for (const [field, expectedValue] of Object.entries(expectedValues)) {
      if (company[field as keyof Company] !== expectedValue) {
        console.log(`⚠️ CompanyApiService: 欄位 ${field} 值不正確: ${company[field as keyof Company]} (期望: ${expectedValue})`);
        return false;
      }
    }

    return true;
  }

  // 更新或新建公司資料
  static async updateCompany(companyData: any, companyId?: string): Promise<Company> {
    try {
      console.log('🔄 CompanyApiService: 準備更新公司資料，ID:', companyId);
      console.log('📋 CompanyApiService: 資料內容:', companyData);
      
      if (companyId) {
        // 更新現有公司資料
        return await CompanyRepository.update(companyId, companyData);
      } else {
        // 新增公司資料，使用指定的ID
        const newCompanyData = {
          ...companyData,
          id: this.SPECIFIC_COMPANY_ID
        };
        return await CompanyRepository.create(newCompanyData);
      }
    } catch (error) {
      console.error('❌ CompanyApiService: API 操作失敗:', error);
      throw error;
    }
  }

  // 監聽公司資料變更
  static subscribeToCompanyChanges(callback: (company: Company | null) => void) {
    return CompanySubscriptionManager.subscribeToCompanyChanges(callback);
  }

  // 取得指定的公司ID
  static getTargetCompanyId(): string {
    return this.SPECIFIC_COMPANY_ID;
  }

  // 檢查資料是否同步
  static isDataSynced(company: Company | null): boolean {
    if (!company) return false;
    
    const isIdCorrect = company.id === this.SPECIFIC_COMPANY_ID;
    const isDataValid = this.validateCompanyData(company);
    
    console.log('🔍 CompanyApiService: 同步檢查 - ID正確:', isIdCorrect, '資料有效:', isDataValid);
    return isIdCorrect && isDataValid;
  }

  // 強制重新初始化公司資料
  static async forceReinitialize(): Promise<Company | null> {
    console.log('🔄 CompanyApiService: 強制重新初始化公司資料...');
    try {
      return await CompanyDataInitializer.createDefaultCompany(this.SPECIFIC_COMPANY_ID);
    } catch (error) {
      console.error('❌ CompanyApiService: 強制重新初始化失敗:', error);
      return null;
    }
  }
}
