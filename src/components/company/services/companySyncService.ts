
import { Company } from '@/types/company';
import { CompanyDataService } from './companyDataService';

export interface SyncResult {
  success: boolean;
  company?: Company;
  error?: string;
  action: 'found' | 'created' | 'updated' | 'failed';
}

export class CompanySyncService {
  // 強制同步公司資料
  static async forceSyncCompany(): Promise<SyncResult> {
    console.log('🔄 CompanySyncService: 開始強制同步公司資料...');
    
    try {
      // 1. 測試資料庫連線
      const isConnected = await CompanyDataService.testConnection();
      if (!isConnected) {
        return {
          success: false,
          error: '無法連接到資料庫，請檢查網路連線',
          action: 'failed'
        };
      }

      // 2. 查找現有公司資料
      console.log('🔍 CompanySyncService: 查找現有公司資料...');
      let company = await CompanyDataService.findCompany();

      if (company) {
        // 3. 如果找到公司，驗證資料
        console.log('✅ CompanySyncService: 找到現有公司資料:', company.name);
        const validation = CompanyDataService.validateCompanyData(company);
        
        if (!validation.isValid) {
          // 標準化資料
          const standardData = this.getStandardCompanyData();
          try {
            company = await CompanyDataService.updateCompany(company.id, standardData);
            return {
              success: true,
              company,
              action: 'updated'
            };
          } catch (updateError) {
            console.error('❌ CompanySyncService: 更新公司資料失敗:', updateError);
            return {
              success: false,
              error: `更新公司資料失敗: ${updateError instanceof Error ? updateError.message : '未知錯誤'}`,
              action: 'failed'
            };
          }
        }

        return {
          success: true,
          company,
          action: 'found'
        };
      } else {
        // 4. 如果沒有找到公司，創建新的標準資料
        console.log('➕ CompanySyncService: 沒有找到公司資料，創建新的標準資料...');
        try {
          company = await CompanyDataService.createStandardCompany();
          return {
            success: true,
            company,
            action: 'created'
          };
        } catch (createError) {
          console.error('❌ CompanySyncService: 創建公司資料失敗:', createError);
          return {
            success: false,
            error: `創建公司資料失敗: ${createError instanceof Error ? createError.message : '未知錯誤'}`,
            action: 'failed'
          };
        }
      }

    } catch (error) {
      console.error('❌ CompanySyncService: 同步過程發生錯誤:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '同步過程發生未知錯誤',
        action: 'failed'
      };
    }
  }

  // 檢查同步狀態
  static async checkSyncStatus(): Promise<{ isSynced: boolean; company?: Company }> {
    try {
      const company = await CompanyDataService.findCompany();
      
      if (!company) {
        return { isSynced: false };
      }

      const validation = CompanyDataService.validateCompanyData(company);

      return {
        isSynced: validation.isValid,
        company
      };

    } catch (error) {
      console.error('❌ CompanySyncService: 檢查同步狀態失敗:', error);
      return { isSynced: false };
    }
  }

  // 取得標準公司資料
  private static getStandardCompanyData() {
    return {
      name: '依美琦股份有限公司',
      registration_number: '53907735',
      legal_representative: '廖俊雄',
      address: '台北市中山區建國北路二段92號',
      phone: '02-2501-2345',
      email: 'info@emeici.com.tw',
      website: 'https://www.emeici.com.tw',
      established_date: '2000-01-01',
      capital: 10000000,
      business_type: '化妝品零售業'
    };
  }
}
