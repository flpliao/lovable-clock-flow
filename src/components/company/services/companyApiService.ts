import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/company';

export class CompanyApiService {
  static async loadCompany(): Promise<Company | null> {
    console.log('🔍 CompanyApiService: 開始從資料庫查詢公司資料...');
    
    try {
      // 直接查詢公司資料表，不依賴任何用戶驗證
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        // 如果是沒有資料的錯誤，返回 null 而不是拋出錯誤
        if (error.code === 'PGRST116') {
          console.log('⚠️ CompanyApiService: 資料庫中沒有找到公司資料');
          return null;
        }
        console.error('❌ CompanyApiService: 查詢公司資料錯誤:', error);
        throw error;
      }
      
      console.log('✅ CompanyApiService: 成功從資料庫載入公司資料:', data);
      return data as Company;
    } catch (error) {
      console.error('💥 CompanyApiService: 載入公司資料時發生錯誤:', error);
      // 不要重新拋出錯誤，返回 null 讓前端能正常處理
      return null;
    }
  }

  static async updateCompany(companyData: any, companyId?: string): Promise<Company> {
    try {
      console.log('🔄 CompanyApiService: 準備更新公司資料，ID:', companyId);
      console.log('📋 CompanyApiService: 資料內容:', companyData);
      
      if (companyId) {
        // 更新現有公司資料
        console.log('🔄 CompanyApiService: 更新現有公司資料，ID:', companyId);
        const { data, error } = await supabase
          .from('companies')
          .update({
            ...companyData,
            updated_at: new Date().toISOString()
          })
          .eq('id', companyId)
          .select()
          .single();

        if (error) {
          console.error('❌ CompanyApiService: 更新錯誤:', error);
          throw error;
        }
        console.log('✅ CompanyApiService: 公司資料更新成功:', data);
        return data as Company;
      } else {
        // 新增公司資料
        return await this.insertNewCompany(companyData);
      }
    } catch (error) {
      console.error('❌ CompanyApiService: API 操作失敗:', error);
      throw error;
    }
  }

  private static async insertNewCompany(companyData: any): Promise<Company> {
    console.log('➕ CompanyApiService: 新增公司資料');
    const { data, error } = await supabase
      .from('companies')
      .insert({
        ...companyData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('❌ CompanyApiService: 新增錯誤:', error);
      throw error;
    }
    console.log('✅ CompanyApiService: 公司資料新增成功:', data);
    return data as Company;
  }
}
