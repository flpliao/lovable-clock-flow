
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/company';

export class CompanyApiService {
  static async loadCompany(): Promise<Company | null> {
    console.log('開始查詢公司資料...');
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('載入公司資料錯誤:', error);
        throw error;
      }
      
      console.log('載入的公司資料:', data);
      return data;
    } catch (error) {
      console.error('載入公司資料失敗:', error);
      throw error;
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
          .update(companyData)
          .eq('id', companyId)
          .select()
          .single();

        if (error) {
          console.error('❌ Supabase 更新錯誤:', error);
          throw new Error(`更新失敗: ${error.message}`);
        }
        return data;
      } else {
        // 新增公司資料
        console.log('➕ 新增公司資料');
        const { data, error } = await supabase
          .from('companies')
          .insert({
            ...companyData,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) {
          console.error('❌ Supabase 新增錯誤:', error);
          throw new Error(`新增失敗: ${error.message}`);
        }
        return data;
      }
    } catch (error) {
      console.error('API 操作失敗:', error);
      throw error;
    }
  }
}
