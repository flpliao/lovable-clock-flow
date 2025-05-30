
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
        return company;
      }

      // 2. 如果找不到，創建新的預設公司資料
      console.log('🔧 CompanyApiService: 找不到指定公司，開始創建預設資料...');
      company = await CompanyDataInitializer.createDefaultCompany(this.SPECIFIC_COMPANY_ID);
      
      if (company) {
        console.log('✅ CompanyApiService: 成功創建並載入預設公司資料:', company.name);
        return company;
      }

      // 3. 如果創建失敗，嘗試載入任何可用的公司
      console.log('🔄 CompanyApiService: 創建失敗，嘗試載入任何可用公司...');
      company = await CompanyRepository.findFirstAvailable();
      
      if (company) {
        console.log('✅ CompanyApiService: 載入到替代公司資料:', company.name);
        return company;
      }

      console.log('❌ CompanyApiService: 完全找不到公司資料');
      return null;

    } catch (error) {
      console.error('💥 CompanyApiService: 載入公司資料時發生錯誤:', error);
      
      // 最後的備用方案
      try {
        console.log('🔄 CompanyApiService: 執行最終備用方案...');
        return await CompanyRepository.findFirstAvailable();
      } catch (fallbackError) {
        console.error('💥 CompanyApiService: 所有載入方案都失敗:', fallbackError);
        return null;
      }
    }
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
    return company?.id === this.SPECIFIC_COMPANY_ID;
  }
}
