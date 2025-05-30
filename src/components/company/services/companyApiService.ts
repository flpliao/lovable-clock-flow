
import { Company } from '@/types/company';
import { CompanyRepository } from './companyRepository';
import { CompanySubscriptionManager } from './companySubscriptionManager';

export class CompanyApiService {
  // 使用正確的公司名稱和ID查詢
  private static readonly COMPANY_NAME = '依美琦股份有限公司';
  private static readonly COMPANY_REGISTRATION_NUMBER = '53907735';

  // 載入公司資料 - 優先使用名稱和統一編號查詢
  static async loadCompany(): Promise<Company | null> {
    console.log('🔍 CompanyApiService: 開始載入依美琦股份有限公司資料...');
    
    try {
      // 先嘗試按名稱查詢
      let company = await CompanyRepository.findByName(this.COMPANY_NAME);
      
      if (!company) {
        // 如果按名稱找不到，嘗試按統一編號查詢
        console.log('🔍 CompanyApiService: 按名稱找不到，嘗試按統一編號查詢...');
        company = await CompanyRepository.findByRegistrationNumber(this.COMPANY_REGISTRATION_NUMBER);
      }

      if (!company) {
        // 如果都找不到，查詢所有公司並找出依美琦
        console.log('🔍 CompanyApiService: 查詢所有公司資料...');
        company = await CompanyRepository.findFirstMatchingCompany();
      }

      if (company && this.validateCompanyData(company)) {
        console.log('✅ CompanyApiService: 成功載入依美琦股份有限公司資料:', company.name);
        return company;
      }

      console.log('⚠️ CompanyApiService: 無法載入依美琦股份有限公司資料');
      return null;

    } catch (error) {
      console.error('💥 CompanyApiService: 載入公司資料時發生錯誤:', error);
      return null;
    }
  }

  // 驗證公司資料
  private static validateCompanyData(company: Company): boolean {
    // 檢查關鍵欄位
    const requiredFields = ['name', 'registration_number', 'address', 'phone', 'email'];
    
    for (const field of requiredFields) {
      if (!company[field as keyof Company]) {
        console.log(`⚠️ CompanyApiService: 缺少必填欄位: ${field}`);
        return false;
      }
    }

    // 檢查是否為依美琦相關資料
    const isCorrectCompany = 
      company.name.includes('依美琦') || 
      company.registration_number === this.COMPANY_REGISTRATION_NUMBER ||
      company.legal_representative === '廖俊雄';

    if (!isCorrectCompany) {
      console.log(`⚠️ CompanyApiService: 資料不符合依美琦股份有限公司`);
      return false;
    }

    console.log('✅ CompanyApiService: 公司資料驗證通過');
    return true;
  }

  // 更新公司資料
  static async updateCompany(companyData: any, companyId?: string): Promise<Company> {
    try {
      console.log('🔄 CompanyApiService: 準備更新公司資料');
      
      if (companyId) {
        // 更新現有公司
        return await CompanyRepository.update(companyId, companyData);
      } else {
        // 創建新公司
        return await CompanyRepository.create(companyData);
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

  // 強制重新載入公司資料
  static async forceReload(): Promise<Company | null> {
    console.log('🔄 CompanyApiService: 強制重新載入公司資料...');
    return await this.loadCompany();
  }

  // 檢查用戶權限
  static validateUserPermission(userName: string): boolean {
    // 允許廖俊雄和管理員編輯
    const hasPermission = userName === '廖俊雄' || userName === 'admin';
    console.log('🔐 CompanyApiService: 權限驗證 - 用戶:', userName, '有權限:', hasPermission);
    return hasPermission;
  }
}
