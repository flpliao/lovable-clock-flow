
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/company';

export class CompanyApiService {
  static async loadCompany(): Promise<Company | null> {
    console.log('🔍 開始從資料庫查詢公司資料...');
    
    try {
      // 直接查詢第一筆公司資料，不使用 maybeSingle()
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .limit(1);

      if (error) {
        console.error('❌ 查詢公司資料錯誤:', error);
        return null;
      }
      
      console.log('🔍 原始查詢結果:', data);
      
      if (data && data.length > 0) {
        const company = data[0];
        console.log('✅ 成功從資料庫載入公司資料:', company);
        return company;
      } else {
        console.log('⚠️ 資料庫中沒有找到公司資料，查詢結果為空陣列');
        return null;
      }
    } catch (error) {
      console.error('💥 載入公司資料時發生錯誤:', error);
      return null;
    }
  }

  static async updateCompany(companyData: any, companyId?: string): Promise<Company> {
    try {
      console.log('🔄 準備更新公司資料，ID:', companyId);
      console.log('📋 資料內容:', companyData);
      
      if (companyId) {
        // 更新現有公司資料
        console.log('🔄 更新現有公司資料，ID:', companyId);
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
          console.error('❌ Supabase 更新錯誤:', error);
          throw error;
        }
        console.log('✅ 公司資料更新成功:', data);
        return data;
      } else {
        // 新增公司資料
        return await this.insertNewCompany(companyData);
      }
    } catch (error) {
      console.error('❌ API 操作失敗:', error);
      throw error;
    }
  }

  private static async insertNewCompany(companyData: any): Promise<Company> {
    console.log('➕ 新增公司資料');
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
      console.error('❌ Supabase 新增錯誤:', error);
      throw error;
    }
    console.log('✅ 公司資料新增成功:', data);
    return data;
  }
}
