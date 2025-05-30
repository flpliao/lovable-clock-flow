
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/company';

export class CompanyApiService {
  // 載入公司資料 - 優先載入指定ID，不存在則創建
  static async loadCompany(): Promise<Company | null> {
    console.log('🔍 CompanyApiService: 開始從資料庫查詢公司資料...');
    
    try {
      const specificCompanyId = '550e8400-e29b-41d4-a716-446655440000';
      console.log('🎯 CompanyApiService: 優先載入指定ID的公司資料:', specificCompanyId);
      
      // 先嘗試查詢指定ID的公司資料
      const { data: specificCompany, error: specificError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', specificCompanyId)
        .maybeSingle();

      if (!specificError && specificCompany) {
        console.log('✅ CompanyApiService: 成功載入指定ID的公司資料:', specificCompany);
        return specificCompany as Company;
      }

      // 如果指定ID不存在，創建預設公司資料
      console.log('🔧 CompanyApiService: 指定ID不存在，創建預設公司資料...');
      const defaultCompanyData = {
        id: specificCompanyId,
        name: '依美琦股份有限公司',
        registration_number: '53907735',
        address: '台北市中山區建國北路二段145號3樓',
        phone: '02-2507-3456',
        email: 'info@yimeichi.com.tw',
        website: 'https://yimeichi.com.tw',
        business_type: '化妝品批發業、化妝品零售業、美容服務業',
        legal_representative: '王美琦',
        established_date: '2015-03-15',
        capital: 5000000,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: newCompany, error: insertError } = await supabase
        .from('companies')
        .insert(defaultCompanyData)
        .select()
        .single();

      if (insertError) {
        console.error('❌ CompanyApiService: 創建預設公司資料失敗:', insertError);
        // 如果創建失敗，嘗試載入第一個可用的公司
        return await this.loadFirstAvailableCompany();
      }

      console.log('✅ CompanyApiService: 成功創建預設公司資料:', newCompany);
      return newCompany as Company;

    } catch (error) {
      console.error('💥 CompanyApiService: 載入公司資料時發生錯誤:', error);
      return await this.loadFirstAvailableCompany();
    }
  }

  // 載入第一個可用的公司作為備用方案
  private static async loadFirstAvailableCompany(): Promise<Company | null> {
    try {
      console.log('🔄 CompanyApiService: 載入第一個可用的公司...');
      const { data: firstCompany, error: firstError } = await supabase
        .from('companies')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (firstError) {
        console.error('❌ CompanyApiService: 查詢第一個公司資料錯誤:', firstError);
        return null;
      }
      
      if (firstCompany) {
        console.log('✅ CompanyApiService: 成功載入第一個公司資料:', firstCompany);
        return firstCompany as Company;
      } else {
        console.log('⚠️ CompanyApiService: 資料庫中沒有任何公司資料');
        return null;
      }
    } catch (error) {
      console.error('💥 CompanyApiService: 載入第一個公司資料時發生錯誤:', error);
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

  // 改善即時監聽功能
  static subscribeToCompanyChanges(callback: (company: Company | null) => void) {
    console.log('👂 CompanyApiService: 開始監聽公司資料變更...');
    
    try {
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
    } catch (error) {
      console.error('❌ CompanyApiService: 設定即時監聽失敗:', error);
      return {
        unsubscribe: () => console.log('空的 channel，無需取消訂閱')
      };
    }
  }
}
