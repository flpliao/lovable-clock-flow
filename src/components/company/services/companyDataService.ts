import { Company } from '@/types/company';
import { supabase } from '@/integrations/supabase/client';

export class CompanyDataService {
  private static readonly COMPANY_NAME = '依美琦股份有限公司';
  private static readonly COMPANY_REGISTRATION_NUMBER = '53907735';
  private static readonly COMPANY_ID = '62a619a8-1a66-46f8-8125-4788248e033f';

  // 增強的資料庫連線測試
  static async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🔍 CompanyDataService: 測試資料庫連線...');
      
      // 1. 測試 Supabase 客戶端連線
      const { error: sessionError } = await supabase.auth.getSession();
      if (sessionError && !sessionError.message.includes('session_not_found')) {
        console.error('❌ CompanyDataService: Supabase 客戶端連線失敗:', sessionError);
        return { 
          success: false, 
          error: `Supabase 連線失敗: ${sessionError.message}` 
        };
      }
      
      // 2. 測試資料庫查詢能力
      const { error: queryError } = await supabase
        .from('companies')
        .select('id')
        .limit(1);
      
      if (queryError && !queryError.code?.includes('PGRST116')) {
        console.error('❌ CompanyDataService: 資料庫查詢測試失敗:', queryError);
        return { 
          success: false, 
          error: `資料庫查詢失敗: ${queryError.message}` 
        };
      }
      
      console.log('✅ CompanyDataService: 資料庫連線測試通過');
      return { success: true };
    } catch (error) {
      console.error('❌ CompanyDataService: 連線測試異常:', error);
      return { 
        success: false, 
        error: `連線測試異常: ${error instanceof Error ? error.message : '未知錯誤'}` 
      };
    }
  }

  // 查詢公司資料 - 使用正式 ID
  static async findCompany(): Promise<Company | null> {
    console.log('🔍 CompanyDataService: 查詢依美琦公司資料...');
    
    try {
      // 先測試連線
      const connectionTest = await this.testConnection();
      if (!connectionTest.success) {
        console.warn('⚠️ CompanyDataService: 連線測試失敗，但繼續嘗試查詢:', connectionTest.error);
      }

      // 優先使用正式 ID 查詢
      const { data: companyById, error: idError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', this.COMPANY_ID)
        .maybeSingle();

      if (idError) {
        console.warn('⚠️ CompanyDataService: 按 ID 查詢失敗，嘗試按統一編號查詢:', idError);
      }

      if (companyById) {
        console.log('✅ CompanyDataService: 按正式 ID 找到公司資料:', companyById.name);
        return this.normalizeCompanyData(companyById);
      }

      // 如果按 ID 找不到，則按統一編號查詢
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('registration_number', this.COMPANY_REGISTRATION_NUMBER)
        .maybeSingle();
      
      if (error) {
        console.error('❌ CompanyDataService: 查詢公司資料失敗:', error);
        throw new Error(`查詢公司資料失敗: ${error.message}`);
      }
      
      if (data) {
        console.log('✅ CompanyDataService: 按統一編號找到公司資料:', data.name);
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

  // 創建標準的依美琦公司資料 - 使用正式 ID
  static async createStandardCompany(): Promise<Company> {
    console.log('➕ CompanyDataService: 創建標準依美琦公司資料...');
    
    try {
      // 先檢查是否已存在
      const existingCompany = await this.findCompany();
      if (existingCompany) {
        console.log('✅ CompanyDataService: 公司資料已存在，返回現有資料');
        return existingCompany;
      }

      const companyData = {
        id: this.COMPANY_ID,
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
        // 如果是重複鍵錯誤，嘗試查詢現有資料
        if (error.code === '23505') {
          console.log('🔄 CompanyDataService: 資料已存在，查詢現有資料');
          const existing = await this.findCompany();
          if (existing) {
            return existing;
          }
        }
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

  // 強制同步 - 使用正式 ID
  static async forceSync(): Promise<Company> {
    console.log('🔄 CompanyDataService: 執行強制同步...');
    
    try {
      // 1. 詳細的連線測試
      console.log('🔗 CompanyDataService: 檢查資料庫連線狀態...');
      const connectionTest = await this.testConnection();
      if (!connectionTest.success) {
        console.warn('⚠️ CompanyDataService: 連線測試失敗，但繼續嘗試同步:', connectionTest.error);
      }

      // 2. 查詢現有資料
      let company = await this.findCompany();
      
      if (company) {
        console.log('✅ CompanyDataService: 找到現有公司資料，檢查是否需要更新');
        
        // 檢查資料是否完整
        const validation = this.validateCompanyData(company);
        if (!validation.isValid) {
          console.log('🔄 CompanyDataService: 資料不完整，進行標準化更新');
          
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
          
          company = await this.updateCompany(company.id, standardData);
        }
        
        return company;
      } else {
        console.log('➕ CompanyDataService: 沒有找到公司資料，創建新的標準資料');
        return await this.createStandardCompany();
      }
    } catch (error) {
      console.error('❌ CompanyDataService: 強制同步失敗:', error);
      
      // 提供更詳細的錯誤資訊
      let errorMessage = '強制同步失敗';
      if (error instanceof Error) {
        if (error.message.includes('連線失敗') || error.message.includes('網路')) {
          errorMessage = '資料庫連線問題，請檢查網路連線或重新整理頁面';
        } else if (error.message.includes('PGRST')) {
          errorMessage = 'Supabase API 連線問題，請稍後再試或重新整理頁面';
        } else if (error.message.includes('timeout')) {
          errorMessage = '連線逾時，請檢查網路速度或稍後再試';
        } else {
          errorMessage = `同步失敗: ${error.message}`;
        }
      }
      
      throw new Error(errorMessage);
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

      // 移除不需要的欄位
      delete cleanedData.id;
      delete cleanedData.created_at;

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

  // 獲取正式公司 ID
  static getCompanyId(): string {
    return this.COMPANY_ID;
  }
}
