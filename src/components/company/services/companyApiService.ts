
import { Company } from '@/types/company';
import { CompanyRepository } from './companyRepository';
import { CompanyDataInitializer } from './companyDataInitializer';
import { CompanySubscriptionManager } from './companySubscriptionManager';

export class CompanyApiService {
  private static readonly SPECIFIC_COMPANY_ID = '550e8400-e29b-41d4-a716-446655440000';

  // 載入公司資料 - 優先載入指定ID，不存在則創建
  static async loadCompany(): Promise<Company | null> {
    console.log('🔍 CompanyApiService: 開始載入公司資料...');
    console.log('🎯 CompanyApiService: 目標公司ID:', this.SPECIFIC_COMPANY_ID);
    
    try {
      // 使用改進的初始化邏輯確保公司資料存在
      const company = await CompanyDataInitializer.ensureCompanyExists(this.SPECIFIC_COMPANY_ID);
      
      if (company) {
        console.log('✅ CompanyApiService: 成功載入/創建公司資料:', company.name);
        return company;
      } else {
        console.log('❌ CompanyApiService: 無法載入或創建公司資料');
        return null;
      }

    } catch (error) {
      console.error('💥 CompanyApiService: 載入公司資料時發生錯誤:', error);
      
      // 備用方案：載入任何可用的公司
      try {
        console.log('🔄 CompanyApiService: 執行備用方案...');
        return await CompanyRepository.findFirstAvailable();
      } catch (fallbackError) {
        console.error('💥 CompanyApiService: 備用方案也失敗:', fallbackError);
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
        // 新增公司資料
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

  // 取得指定的公司ID
  static getTargetCompanyId(): string {
    return this.SPECIFIC_COMPANY_ID;
  }
}
