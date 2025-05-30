
import { Company } from '@/types/company';
import { supabase } from '@/integrations/supabase/client';

export class CompanyDataService {
  private static readonly COMPANY_NAME = '依美琦股份有限公司';
  private static readonly COMPANY_REGISTRATION_NUMBER = '53907735';

  // 檢查資料庫連線
  static async testConnection(): Promise<boolean> {
    try {
      console.log('🔍 CompanyDataService: 測試資料庫連線...');
      const { error } = await supabase.from('companies').select('count').limit(1);
      
      if (error) {
        console.error('❌ CompanyDataService: 資料庫連線測試失敗:', error);
        return false;
      }
      
      console.log('✅ CompanyDataService: 資料庫連線正常');
      return true;
    } catch (error) {
      console.error('❌ CompanyDataService: 資料庫連線測試異常:', error);
      return false;
    }
  }

  // 查詢公司資料
  static async findCompany(): Promise<Company | null> {
    console.log('🔍 CompanyDataService: 開始查詢依美琦公司資料...');
    
    try {
      // 先測試連線
      const isConnected = await this.testConnection();
      if (!isConnected) {
        console.error('❌ CompanyDataService: 資料庫連線失敗，無法查詢公司資料');
        throw new Error('資料庫連線失敗');
      }

      // 按公司名稱查詢
      console.log('🔍 CompanyDataService: 按名稱查詢:', this.COMPANY_NAME);
      const { data: companyByName, error: nameError } = await supabase
        .from('companies')
        .select('*')
        .eq('name', this.COMPANY_NAME)
        .maybeSingle();

      if (!nameError && companyByName) {
        console.log('✅ CompanyDataService: 按名稱找到公司資料:', companyByName.name);
        return companyByName as Company;
      }

      // 按統一編號查詢
      console.log('🔍 CompanyDataService: 按統一編號查詢:', this.COMPANY_REGISTRATION_NUMBER);
      const { data: companyByReg, error: regError } = await supabase
        .from('companies')
        .select('*')
        .eq('registration_number', this.COMPANY_REGISTRATION_NUMBER)
        .maybeSingle();

      if (!regError && companyByReg) {
        console.log('✅ CompanyDataService: 按統一編號找到公司資料:', companyByReg.name);
        return companyByReg as Company;
      }

      // 模糊查詢
      console.log('🔍 CompanyDataService: 進行模糊查詢...');
      const { data: allCompanies, error: allError } = await supabase
        .from('companies')
        .select('*')
        .or(`name.ilike.%依美琦%,registration_number.eq.${this.COMPANY_REGISTRATION_NUMBER},legal_representative.eq.廖俊雄`)
        .limit(5);

      if (!allError && allCompanies && allCompanies.length > 0) {
        const targetCompany = allCompanies[0]; // 取第一個匹配的
        console.log('✅ CompanyDataService: 模糊查詢找到公司資料:', targetCompany.name);
        return targetCompany as Company;
      }

      console.log('⚠️ CompanyDataService: 沒有找到任何公司資料');
      return null;

    } catch (error) {
      console.error('❌ CompanyDataService: 查詢公司資料失敗:', error);
      throw error;
    }
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
      return data as Company;
    } catch (error) {
      console.error('❌ CompanyDataService: 創建過程發生錯誤:', error);
      throw error;
    }
  }

  // 更新公司資料
  static async updateCompany(companyId: string, updateData: Partial<Company>): Promise<Company> {
    console.log('🔄 CompanyDataService: 更新公司資料...', { companyId, updateData });
    
    try {
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
        throw new Error(`更新公司資料失敗: ${error.message}`);
      }

      console.log('✅ CompanyDataService: 公司資料更新成功:', data);
      return data as Company;
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
    if (!company.address?.trim()) errors.push('公司地址不能為空');
    if (!company.phone?.trim()) errors.push('聯絡電話不能為空');
    if (!company.email?.trim()) errors.push('電子郵件不能為空');
    if (!company.business_type?.trim()) errors.push('營業項目不能為空');

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
