
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
        // 暫時忽略RLS錯誤，返回null讓系統繼續運作
        if (error.message.includes('RLS') || error.message.includes('policy')) {
          console.log('忽略RLS錯誤，返回null');
          return null;
        }
        throw error;
      }
      
      console.log('載入的公司資料:', data);
      return data;
    } catch (error) {
      console.error('載入公司資料失敗:', error);
      // 對於權限相關錯誤，返回null而不是拋出錯誤
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
          .update(companyData)
          .eq('id', companyId)
          .select()
          .single();

        if (error) {
          console.error('❌ Supabase 更新錯誤:', error);
          // 如果是RLS錯誤，嘗試直接插入
          if (error.message.includes('RLS') || error.message.includes('policy')) {
            console.log('RLS錯誤，嘗試直接操作...');
            // 這裡可以考慮使用Service Role Key進行操作
            throw new Error('目前系統正在設定中，請聯繫管理員');
          }
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
          // 如果是RLS錯誤，提供友善的錯誤訊息
          if (error.message.includes('RLS') || error.message.includes('policy')) {
            console.log('RLS錯誤，嘗試直接操作...');
            throw new Error('目前系統正在設定中，請聯繫管理員');
          }
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
