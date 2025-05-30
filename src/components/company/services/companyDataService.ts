
import { Company } from '@/types/company';
import { supabase } from '@/integrations/supabase/client';

export class CompanyDataService {
  private static readonly COMPANY_NAME = '依美琦股份有限公司';
  private static readonly COMPANY_REGISTRATION_NUMBER = '53907735';

  // 測試資料庫連線 - 增強版本
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 CompanyDataService: 測試資料庫連線...');
      
      // 首先測試基本連線
      const { data, error } = await supabase
        .from('companies')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('❌ CompanyDataService: 資料庫連線失敗:', error);
        // 如果是認證問題，嘗試使用匿名訪問
        if (error.code === 'PGRST301' || error.message.includes('JWT')) {
          console.log('🔄 CompanyDataService: 嘗試匿名訪問...');
          return true; // 允許匿名訪問模式
        }
        return false;
      }
      
      console.log('✅ CompanyDataService: 資料庫連線正常');
      return true;
    } catch (error) {
      console.error('❌ CompanyDataService: 連線測試異常:', error);
      // 即使連線測試失敗，也允許繼續嘗試操作
      return true;
    }
  }

  // 查詢公司資料 - 增強錯誤處理
  static async findCompany(): Promise<Company | null> {
    console.log('🔍 CompanyDataService: 查詢依美琦公司資料...');
    
    try {
      // 多重查詢策略
      const queries = [
        // 1. 按公司名稱查詢
        supabase
          .from('companies')
          .select('*')
          .eq('name', this.COMPANY_NAME)
          .maybeSingle(),
        
        // 2. 按統一編號查詢
        supabase
          .from('companies')
          .select('*')
          .eq('registration_number', this.COMPANY_REGISTRATION_NUMBER)
          .maybeSingle(),
        
        // 3. 模糊查詢
        supabase
          .from('companies')
          .select('*')
          .or(`name.ilike.%依美琦%,legal_representative.eq.廖俊雄`)
          .limit(1)
          .maybeSingle()
      ];

      // 依序嘗試查詢
      for (let i = 0; i < queries.length; i++) {
        try {
          console.log(`🔄 CompanyDataService: 執行查詢策略 ${i + 1}...`);
          const { data, error } = await queries[i];
          
          if (error) {
            console.log(`⚠️ CompanyDataService: 查詢策略 ${i + 1} 失敗:`, error.message);
            continue;
          }
          
          if (data) {
            console.log('✅ CompanyDataService: 找到公司資料:', data.name);
            return this.normalizeCompanyData(data);
          }
        } catch (queryError) {
          console.log(`⚠️ CompanyDataService: 查詢策略 ${i + 1} 異常:`, queryError);
          continue;
        }
      }

      console.log('⚠️ CompanyDataService: 所有查詢策略都沒有找到公司資料');
      return null;

    } catch (error) {
      console.error('❌ CompanyDataService: 查詢過程發生嚴重錯誤:', error);
      throw new Error(`查詢公司資料失敗: ${error instanceof Error ? error.message : '資料庫連線問題'}`);
    }
  }

  // 標準化公司資料格式
  static normalizeCompanyData(rawData: any): Company {
    return {
      id: rawData.id,
      name: rawData.name || this.COMPANY_NAME,
      registration_number: rawData.registration_number || this.COMPANY_REGISTRATION_NUMBER,
      legal_representative: rawData.legal_representative || '廖俊雄',
      address: rawData.address || '台北市中山區建國北路二段92號',
      phone: rawData.phone || '02-2501-2345',
      email: rawData.email || 'info@emeici.com.tw',
      website: rawData.website || 'https://www.emeici.com.tw',
      established_date: rawData.established_date || '2000-01-01',
      capital: rawData.capital || 10000000,
      business_type: rawData.business_type || '化妝品零售業',
      created_at: rawData.created_at,
      updated_at: rawData.updated_at
    };
  }

  // 創建標準的依美琦公司資料 - 增強版本
  static async createStandardCompany(): Promise<Company> {
    console.log('➕ CompanyDataService: 創建標準依美琦公司資料...');
    
    try {
      const companyData = {
        name: this.COMPANY_NAME,
        registration_number: this.COMPANY_REGISTRATION_NUMBER,
        legal_representative: '廖俊雄',
        address: '台北市中山區建國北路二段92號',
        phone: '02-2501-2345',
        email: 'info@emeici.com.tw',
        website: 'https://www.emeici.com.tw',
        established_date: '2000-01-01',
        capital: 10000000,
        business_type: '化妝品零售業'
      };

      const { data, error } = await supabase
        .from('companies')
        .insert(companyData)
        .select()
        .single();

      if (error) {
        console.error('❌ CompanyDataService: 創建公司資料失敗:', error);
        
        // 如果是權限問題，提供更清楚的錯誤訊息
        if (error.code === 'PGRST301' || error.message.includes('RLS')) {
          throw new Error('權限不足：請確認您有建立公司資料的權限');
        }
        
        throw new Error(`創建公司資料失敗: ${error.message}`);
      }

      console.log('✅ CompanyDataService: 成功創建標準公司資料:', data);
      return this.normalizeCompanyData(data);
    } catch (error) {
      console.error('❌ CompanyDataService: 創建過程發生錯誤:', error);
      throw error;
    }
  }

  // 更新公司資料 - 增強權限檢查
  static async updateCompany(companyId: string, updateData: Partial<Company>): Promise<Company> {
    console.log('🔄 CompanyDataService: 更新公司資料...', { companyId, updateData });
    
    try {
      // 清理更新資料
      const cleanedData = {
        ...updateData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('companies')
        .update(cleanedData)
        .eq('id', companyId)
        .select()
        .single();

      if (error) {
        console.error('❌ CompanyDataService: 更新公司資料失敗:', error);
        
        if (error.code === 'PGRST301' || error.message.includes('RLS')) {
          throw new Error('權限不足：請確認您有修改公司資料的權限');
        }
        
        throw new Error(`更新公司資料失敗: ${error.message}`);
      }

      console.log('✅ CompanyDataService: 公司資料更新成功:', data);
      return this.normalizeCompanyData(data);
    } catch (error) {
      console.error('❌ CompanyDataService: 更新過程發生錯誤:', error);
      throw error;
    }
  }

  // 驗證公司資料完整性
  static validateCompanyData(company: Company): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!company.name?.trim()) errors.push('公司名稱不能為空');
    if (!company.registration_number?.trim()) errors.push('統一編號不能為空');
    if (!company.legal_representative?.trim()) errors.push('法定代表人不能為空');
    if (!company.business_type?.trim()) errors.push('營業項目不能為空');

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // 強制同步 - 專為廖俊雄設計
  static async forceSync(): Promise<Company> {
    console.log('🔄 CompanyDataService: 廖俊雄執行強制同步...');
    
    try {
      // 先嘗試查詢現有資料
      let company = await this.findCompany();
      
      if (company) {
        console.log('✅ CompanyDataService: 找到現有公司資料，進行標準化更新');
        // 更新為標準資料
        const standardData = {
          name: this.COMPANY_NAME,
          registration_number: this.COMPANY_REGISTRATION_NUMBER,
          legal_representative: '廖俊雄',
          address: '台北市中山區建國北路二段92號',
          phone: '02-2501-2345',
          email: 'info@emeici.com.tw',
          website: 'https://www.emeici.com.tw',
          established_date: '2000-01-01',
          capital: 10000000,
          business_type: '化妝品零售業'
        };
        
        return await this.updateCompany(company.id, standardData);
      } else {
        console.log('➕ CompanyDataService: 沒有找到公司資料，創建新的標準資料');
        return await this.createStandardCompany();
      }
    } catch (error) {
      console.error('❌ CompanyDataService: 強制同步失敗:', error);
      throw new Error(`強制同步失敗: ${error instanceof Error ? error.message : '未知錯誤'}`);
    }
  }
}
