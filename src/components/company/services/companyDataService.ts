
import { Company } from '@/types/company';
import { supabase } from '@/integrations/supabase/client';

export class CompanyDataService {
  private static readonly COMPANY_NAME = '依美琦股份有限公司';
  private static readonly COMPANY_REGISTRATION_NUMBER = '53907735';

  // 測試資料庫連線
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 CompanyDataService: 測試資料庫連線...');
      
      const { error } = await supabase
        .from('companies')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('❌ CompanyDataService: 資料庫連線失敗:', error);
        return false;
      }
      
      console.log('✅ CompanyDataService: 資料庫連線正常');
      return true;
    } catch (error) {
      console.error('❌ CompanyDataService: 連線測試異常:', error);
      return false;
    }
  }

  // 查詢公司資料
  static async findCompany(): Promise<Company | null> {
    console.log('🔍 CompanyDataService: 查詢依美琦公司資料...');
    
    try {
      // 按公司名稱查詢
      let { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('name', this.COMPANY_NAME)
        .maybeSingle();
      
      if (error) {
        console.log('⚠️ CompanyDataService: 按名稱查詢失敗，嘗試按統一編號查詢');
        
        // 按統一編號查詢
        const result = await supabase
          .from('companies')
          .select('*')
          .eq('registration_number', this.COMPANY_REGISTRATION_NUMBER)
          .maybeSingle();
        
        data = result.data;
        error = result.error;
      }
      
      if (error) {
        console.error('❌ CompanyDataService: 查詢公司資料失敗:', error);
        throw new Error(`查詢公司資料失敗: ${error.message}`);
      }
      
      if (data) {
        console.log('✅ CompanyDataService: 找到公司資料:', data.name);
        return this.normalizeCompanyData(data);
      }

      console.log('⚠️ CompanyDataService: 未找到公司資料');
      return null;

    } catch (error) {
      console.error('❌ CompanyDataService: 查詢過程發生錯誤:', error);
      throw error;
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

  // 創建標準的依美琦公司資料
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
        throw new Error(`創建公司資料失敗: ${error.message}`);
      }

      console.log('✅ CompanyDataService: 成功創建標準公司資料:', data);
      return this.normalizeCompanyData(data);
    } catch (error) {
      console.error('❌ CompanyDataService: 創建過程發生錯誤:', error);
      throw error;
    }
  }

  // 更新公司資料
  static async updateCompany(companyId: string, updateData: Partial<Company>): Promise<Company> {
    console.log('🔄 CompanyDataService: 更新公司資料...', { companyId, updateData });
    
    try {
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
