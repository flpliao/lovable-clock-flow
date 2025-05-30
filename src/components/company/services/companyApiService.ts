
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/company';

export class CompanyApiService {
  static async loadCompany(): Promise<Company | null> {
    console.log('🔍 CompanyApiService: 開始從資料庫查詢公司資料...');
    
    try {
      // 使用更明確的查詢方式，確保能正確載入資料
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('❌ CompanyApiService: 查詢公司資料錯誤:', error);
        throw error;
      }
      
      if (data) {
        console.log('✅ CompanyApiService: 成功從資料庫載入公司資料:', data);
        // 確保資料格式正確
        return {
          ...data,
          created_at: data.created_at,
          updated_at: data.updated_at
        } as Company;
      } else {
        console.log('⚠️ CompanyApiService: 資料庫中沒有找到公司資料');
        return null;
      }
    } catch (error) {
      console.error('💥 CompanyApiService: 載入公司資料時發生錯誤:', error);
      throw error; // 重新拋出錯誤，讓前端能正確處理
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

  // 監聽公司資料變更的方法
  static subscribeToCompanyChanges(callback: (company: Company | null) => void) {
    console.log('👂 CompanyApiService: 開始監聽公司資料變更...');
    
    const channel = supabase
      .channel('company-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'companies'
        },
        (payload) => {
          console.log('🔔 CompanyApiService: 收到公司資料變更通知:', payload);
          
          if (payload.eventType === 'DELETE') {
            callback(null);
          } else {
            callback(payload.new as Company);
          }
        }
      )
      .subscribe();

    return channel;
  }
}
