
import { Company } from '@/types/company';
import { supabase } from '@/integrations/supabase/client';

export class CompanyDataService {
  private static readonly COMPANY_NAME = '依美琦股份有限公司';
  private static readonly COMPANY_REGISTRATION_NUMBER = '53907735';

  // 檢查資料庫連線
  static async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase.from('companies').select('id').limit(1);
      return !error;
    } catch (error) {
      console.error('❌ 資料庫連線測試失敗:', error);
      return false;
    }
  }

  // 安全地查詢公司資料
  static async findCompany(): Promise<Company | null> {
    console.log('🔍 CompanyDataService: 開始查詢依美琦公司資料...');
    
    try {
      // 先測試連線
      const isConnected = await this.testConnection();
      if (!isConnected) {
        throw new Error('資料庫連線失敗');
      }

      // 依序嘗試不同的查詢方式
      const searchMethods = [
        () => this.findByName(),
        () => this.findByRegistrationNumber(),
        () => this.findByLegalRepresentative(),
        () => this.findFirst()
      ];

      for (const method of searchMethods) {
        try {
          const result = await method();
          if (result) {
            console.log('✅ CompanyDataService: 找到公司資料:', result.name);
            return result;
          }
        } catch (error) {
          console.warn('⚠️ CompanyDataService: 查詢方法失敗，嘗試下一個方法');
          continue;
        }
      }

      console.log('⚠️ CompanyDataService: 所有查詢方法都失敗，沒有找到公司資料');
      return null;

    } catch (error) {
      console.error('❌ CompanyDataService: 查詢公司資料失敗:', error);
      throw error;
    }
  }

  // 按公司名稱查詢
  private static async findByName(): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('name', this.COMPANY_NAME)
      .maybeSingle();

    if (error) throw error;
    return data as Company | null;
  }

  // 按統一編號查詢
  private static async findByRegistrationNumber(): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('registration_number', this.COMPANY_REGISTRATION_NUMBER)
      .maybeSingle();

    if (error) throw error;
    return data as Company | null;
  }

  // 按法定代表人查詢
  private static async findByLegalRepresentative(): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('legal_representative', '廖俊雄')
      .maybeSingle();

    if (error) throw error;
    return data as Company | null;
  }

  // 查詢第一筆公司資料
  private static async findFirst(): Promise<Company | null> {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data as Company | null;
  }

  // 創建標準的依美琦公司資料
  static async createStandardCompany(): Promise<Company> {
    console.log('➕ CompanyDataService: 創建標準依美琦公司資料...');
    
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
      throw error;
    }

    console.log('✅ CompanyDataService: 成功創建標準公司資料:', data);
    return data as Company;
  }

  // 更新公司資料
  static async updateCompany(companyId: string, updateData: Partial<Company>): Promise<Company> {
    console.log('🔄 CompanyDataService: 更新公司資料...');
    
    const { data, error } = await supabase
      .from('companies')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', companyId)
      .select()
      .single();

    if (error) {
      console.error('❌ CompanyDataService: 更新公司資料失敗:', error);
      throw error;
    }

    console.log('✅ CompanyDataService: 公司資料更新成功:', data);
    return data as Company;
  }

  // 驗證公司資料完整性
  static validateCompanyData(company: Company): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!company.name) errors.push('公司名稱不能為空');
    if (!company.registration_number) errors.push('統一編號不能為空');
    if (!company.legal_representative) errors.push('法定代表人不能為空');
    if (!company.address) errors.push('公司地址不能為空');
    if (!company.phone) errors.push('聯絡電話不能為空');
    if (!company.email) errors.push('電子郵件不能為空');
    if (!company.business_type) errors.push('營業項目不能為空');

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
