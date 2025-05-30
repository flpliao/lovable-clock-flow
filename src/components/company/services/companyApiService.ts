import { Company } from '@/types/company';
import { CompanyRepository } from './companyRepository';
import { CompanyDataInitializer } from './companyDataInitializer';
import { CompanySubscriptionManager } from './companySubscriptionManager';

export class CompanyApiService {
  private static readonly SPECIFIC_COMPANY_ID = '550e8400-e29b-41d4-a716-446655440000';
  private static readonly ADMIN_USER_ID = '550e8400-e29b-41d4-a716-446655440001';

  // 載入公司資料 - 確保載入正確的資料
  static async loadCompany(): Promise<Company | null> {
    console.log('🔍 CompanyApiService: 開始載入公司資料...');
    console.log('🎯 CompanyApiService: 目標公司ID:', this.SPECIFIC_COMPANY_ID);
    
    try {
      // 1. 首先嘗試載入指定ID的公司
      let company = await CompanyRepository.findById(this.SPECIFIC_COMPANY_ID);
      
      if (company && this.validateCompanyData(company)) {
        console.log('✅ CompanyApiService: 成功載入有效公司資料:', company.name);
        return company;
      }

      // 2. 如果沒有有效資料，強制確保資料存在
      console.log('🔧 CompanyApiService: 強制確保公司資料存在...');
      company = await CompanyDataInitializer.ensureCompanyExists(this.SPECIFIC_COMPANY_ID);
      
      if (company) {
        console.log('✅ CompanyApiService: 成功確保公司資料存在:', company.name);
        return company;
      }

      console.log('❌ CompanyApiService: 無法載入或創建公司資料');
      return null;

    } catch (error) {
      console.error('💥 CompanyApiService: 載入公司資料時發生錯誤:', error);
      return null;
    }
  }

  // 強制修復公司資料
  static async forceFixCompanyData(): Promise<Company | null> {
    console.log('🔧 CompanyApiService: 開始強制修復公司資料...');
    
    try {
      // 1. 強制重新創建公司資料
      const company = await CompanyDataInitializer.createDefaultCompany(this.SPECIFIC_COMPANY_ID);
      
      if (company) {
        console.log('✅ CompanyApiService: 強制修復成功:', company.name);
        
        // 2. 驗證修復後的資料
        const validatedCompany = await this.loadCompany();
        return validatedCompany;
      }
      
      return null;
    } catch (error) {
      console.error('❌ CompanyApiService: 強制修復失敗:', error);
      return null;
    }
  }

  // 驗證公司資料完整性和ID匹配
  private static validateCompanyData(company: Company): boolean {
    // 首先檢查ID是否匹配
    if (company.id !== this.SPECIFIC_COMPANY_ID) {
      console.log(`⚠️ CompanyApiService: 公司ID不匹配: ${company.id} (期望: ${this.SPECIFIC_COMPANY_ID})`);
      return false;
    }

    const requiredFields = ['name', 'registration_number', 'address', 'phone', 'email'];
    const expectedValues = {
      name: '依美琦股份有限公司',
      registration_number: '53907735',
      legal_representative: '廖俊雄'
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

    console.log('✅ CompanyApiService: 公司資料驗證通過');
    return true;
  }

  // 更新或新建公司資料
  static async updateCompany(companyData: any, companyId?: string): Promise<Company> {
    try {
      console.log('🔄 CompanyApiService: 準備更新公司資料');
      console.log('🆔 CompanyApiService: 使用公司ID:', companyId || this.SPECIFIC_COMPANY_ID);
      
      const targetCompanyId = companyId || this.SPECIFIC_COMPANY_ID;
      
      // 確保資料中包含正確的ID
      const updatedData = {
        ...companyData,
        id: targetCompanyId
      };

      if (companyId && companyId === this.SPECIFIC_COMPANY_ID) {
        // 更新現有公司資料
        console.log('🔄 CompanyApiService: 更新現有公司資料');
        return await CompanyRepository.update(targetCompanyId, updatedData);
      } else {
        // 新增公司資料，使用指定的ID
        console.log('➕ CompanyApiService: 創建新的公司資料');
        return await CompanyRepository.create(updatedData);
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

  // 取得管理員用戶ID
  static getAdminUserId(): string {
    return this.ADMIN_USER_ID;
  }

  // 檢查資料是否同步
  static isDataSynced(company: Company | null): boolean {
    if (!company) {
      console.log('🔍 CompanyApiService: 同步檢查 - 無公司資料');
      return false;
    }
    
    const isIdCorrect = company.id === this.SPECIFIC_COMPANY_ID;
    const isDataValid = this.validateCompanyData(company);
    
    console.log('🔍 CompanyApiService: 同步檢查結果:');
    console.log('  - 公司ID正確:', isIdCorrect, `(${company.id} === ${this.SPECIFIC_COMPANY_ID})`);
    console.log('  - 資料有效:', isDataValid);
    console.log('  - 整體同步狀態:', isIdCorrect && isDataValid);
    
    return isIdCorrect && isDataValid;
  }

  // 強制重新初始化公司資料
  static async forceReinitialize(): Promise<Company | null> {
    console.log('🔄 CompanyApiService: 強制重新初始化公司資料...');
    console.log('🆔 CompanyApiService: 使用公司ID:', this.SPECIFIC_COMPANY_ID);
    console.log('👤 CompanyApiService: 關聯管理員:', this.ADMIN_USER_ID);
    
    try {
      return await this.forceFixCompanyData();
    } catch (error) {
      console.error('❌ CompanyApiService: 強制重新初始化失敗:', error);
      return null;
    }
  }

  // 驗證用戶是否有權限管理此公司
  static validateUserPermission(userId: string): boolean {
    const hasPermission = userId === this.ADMIN_USER_ID;
    console.log('🔐 CompanyApiService: 權限驗證 - 用戶ID:', userId, '有權限:', hasPermission);
    return hasPermission;
  }
}
