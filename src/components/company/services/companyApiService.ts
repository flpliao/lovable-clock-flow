
import { Company } from '@/types/company';
import { CompanyRepository } from './companyRepository';
import { CompanySubscriptionManager } from './companySubscriptionManager';

export class CompanyApiService {
  // 使用正確的公司名稱和ID查詢
  private static readonly COMPANY_NAME = '依美琦股份有限公司';
  private static readonly COMPANY_REGISTRATION_NUMBER = '53907735';

  // 強制從後台載入並同步公司資料
  static async forceSyncFromBackend(): Promise<Company | null> {
    console.log('🔄 CompanyApiService: 強制從後台同步依美琦股份有限公司資料...');
    
    try {
      // 1. 先查詢所有現有的公司資料
      const allCompanies = await CompanyRepository.listAll();
      console.log('📋 CompanyApiService: 後台所有公司資料:', allCompanies);

      // 2. 尋找依美琦相關的公司資料
      let targetCompany = allCompanies.find(company => 
        company.name.includes('依美琦') || 
        company.registration_number === this.COMPANY_REGISTRATION_NUMBER ||
        company.legal_representative === '廖俊雄'
      );

      if (targetCompany) {
        console.log('✅ CompanyApiService: 找到後台依美琦公司資料:', targetCompany);
        
        // 3. 強制更新為標準格式
        const standardizedData = this.standardizeCompanyData(targetCompany);
        
        // 4. 更新到資料庫
        const updatedCompany = await CompanyRepository.update(targetCompany.id, standardizedData);
        console.log('✅ CompanyApiService: 成功同步並標準化公司資料:', updatedCompany);
        
        return updatedCompany;
      } else {
        // 5. 如果找不到，創建標準的依美琦公司資料
        console.log('⚠️ CompanyApiService: 後台沒有找到依美琦資料，創建標準資料...');
        const standardCompanyData = this.createStandardCompanyData();
        const newCompany = await CompanyRepository.create(standardCompanyData);
        console.log('✅ CompanyApiService: 成功創建標準依美琦公司資料:', newCompany);
        
        return newCompany;
      }
    } catch (error) {
      console.error('❌ CompanyApiService: 強制同步失敗:', error);
      throw error;
    }
  }

  // 標準化公司資料
  private static standardizeCompanyData(company: Company): any {
    return {
      name: this.COMPANY_NAME,
      registration_number: this.COMPANY_REGISTRATION_NUMBER,
      legal_representative: '廖俊雄',
      address: company.address || '台北市中山區建國北路二段92號',
      phone: company.phone || '02-2501-2345',
      email: company.email || 'info@emeici.com.tw',
      website: company.website || 'https://www.emeici.com.tw',
      business_license: company.business_license || this.COMPANY_REGISTRATION_NUMBER,
      tax_id: company.tax_id || this.COMPANY_REGISTRATION_NUMBER,
      establishment_date: company.establishment_date || '2000-01-01',
      capital: company.capital || 10000000,
      employee_count: company.employee_count || 50,
      industry: company.industry || '化妝品零售業',
      description: company.description || '專業化妝品零售連鎖企業',
      updated_at: new Date().toISOString()
    };
  }

  // 創建標準的依美琦公司資料
  private static createStandardCompanyData(): any {
    return {
      name: this.COMPANY_NAME,
      registration_number: this.COMPANY_REGISTRATION_NUMBER,
      legal_representative: '廖俊雄',
      address: '台北市中山區建國北路二段92號',
      phone: '02-2501-2345',
      email: 'info@emeici.com.tw',
      website: 'https://www.emeici.com.tw',
      business_license: this.COMPANY_REGISTRATION_NUMBER,
      tax_id: this.COMPANY_REGISTRATION_NUMBER,
      establishment_date: '2000-01-01',
      capital: 10000000,
      employee_count: 50,
      industry: '化妝品零售業',
      description: '專業化妝品零售連鎖企業'
    };
  }

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

  // 檢查資料是否已同步
  static isDataSynced(company: Company): boolean {
    if (!company) return false;
    
    // 檢查關鍵資料是否符合依美琦股份有限公司
    const hasCorrectName = company.name === this.COMPANY_NAME;
    const hasCorrectRegistrationNumber = company.registration_number === this.COMPANY_REGISTRATION_NUMBER;
    const hasCorrectAddress = company.address && company.address.includes('台北市中山區建國北路');
    const hasCorrectRepresentative = company.legal_representative === '廖俊雄';
    
    const syncScore = [hasCorrectName, hasCorrectRegistrationNumber, hasCorrectAddress, hasCorrectRepresentative].filter(Boolean).length;
    
    // 至少需要3個條件符合才算同步
    return syncScore >= 3;
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
