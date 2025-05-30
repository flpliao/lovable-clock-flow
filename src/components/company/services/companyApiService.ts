
import { Company } from '@/types/company';
import { CompanyRepository } from './companyRepository';
import { CompanyDataInitializer } from './companyDataInitializer';
import { CompanySubscriptionManager } from './companySubscriptionManager';

export class CompanyApiService {
  private static readonly SPECIFIC_COMPANY_ID = '550e8400-e29b-41d4-a716-446655440000';

  // 載入公司資料 - 優先載入指定ID，不存在則創建
  static async loadCompany(): Promise<Company | null> {
    console.log('🔍 CompanyApiService: 開始從資料庫查詢公司資料...');
    
    try {
      console.log('🎯 CompanyApiService: 優先載入指定ID的公司資料:', this.SPECIFIC_COMPANY_ID);
      
      // 先嘗試查詢指定ID的公司資料
      const specificCompany = await CompanyRepository.findById(this.SPECIFIC_COMPANY_ID);
      
      if (specificCompany) {
        console.log('✅ CompanyApiService: 成功載入指定ID的公司資料:', specificCompany);
        return specificCompany;
      }

      // 如果指定ID不存在，創建依美琦股份有限公司資料
      console.log('🔧 CompanyApiService: 指定ID不存在，創建依美琦股份有限公司資料...');
      return await CompanyDataInitializer.createDefaultCompany(this.SPECIFIC_COMPANY_ID);

    } catch (error) {
      console.error('💥 CompanyApiService: 載入公司資料時發生錯誤:', error);
      
      // 備用方案：載入第一個可用的公司
      try {
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
}
