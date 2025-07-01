
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/company';
import { CompanyDataService } from './companyDataService';

export class CompanyApiService {
  private static readonly COMPANY_ID = '550e8400-e29b-41d4-a716-446655440000';
  private static readonly STANDARD_COMPANY_DATA = {
    id: '550e8400-e29b-41d4-a716-446655440000',
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

  // 驗證用戶權限
  static validateUserPermission(role_id: string): boolean {
    console.log('🔑 CompanyApiService: 驗證用戶權限:', role_id);
    return role_id === 'admin';
  }

  // 更新或創建公司資料
  static async updateCompany(companyData: Partial<Company>, existingId?: string): Promise<Company> {
    console.log('🔄 CompanyApiService: 處理公司資料...', { companyData, existingId });

    try {
      // 如果有現有 ID，執行更新
      if (existingId) {
        console.log('🔄 CompanyApiService: 更新現有公司資料，ID:', existingId);
        return await CompanyDataService.updateCompany(existingId, companyData);
      } else {
        // 檢查是否已有正式 ID 的公司資料
        const existingCompany = await CompanyDataService.findCompany();
        
        if (existingCompany) {
          console.log('🔄 CompanyApiService: 找到現有公司資料，執行更新');
          return await CompanyDataService.updateCompany(existingCompany.id, companyData);
        } else {
          console.log('➕ CompanyApiService: 創建新的公司資料');
          return await CompanyDataService.createStandardCompany();
        }
      }
    } catch (error) {
      console.error('❌ CompanyApiService: 處理公司資料失敗:', error);
      throw error;
    }
  }

  // 強制重新載入
  static async forceReload(): Promise<Company | null> {
    console.log('🔄 CompanyApiService: 強制重新載入公司資料...');
    
    try {
      return await CompanyDataService.findCompany();
    } catch (error) {
      console.error('❌ CompanyApiService: 強制重新載入失敗:', error);
      return null;
    }
  }

  // 檢查資料是否已同步
  static isDataSynced(company: Company): boolean {
    if (!company) return false;
    
    // 檢查是否為正式 ID
    if (company.id !== this.COMPANY_ID) return false;
    
    // 檢查關鍵欄位是否匹配標準資料
    return (
      company.name === this.STANDARD_COMPANY_DATA.name &&
      company.registration_number === this.STANDARD_COMPANY_DATA.registration_number &&
      company.legal_representative === this.STANDARD_COMPANY_DATA.legal_representative
    );
  }

  // 訂閱公司資料變更
  static subscribeToCompanyChanges(callback: (company: Company) => void) {
    console.log('🔔 CompanyApiService: 設置公司資料變更監聽...');
    
    const channel = supabase
      .channel('company_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'companies',
          filter: `id=eq.${this.COMPANY_ID}`
        },
        (payload) => {
          console.log('🔔 CompanyApiService: 收到公司資料變更:', payload);
          if (payload.new && typeof payload.new === 'object') {
            callback(payload.new as Company);
          }
        }
      )
      .subscribe();

    return channel;
  }

  // 獲取正式公司 ID
  static getCompanyId(): string {
    return this.COMPANY_ID;
  }
}
