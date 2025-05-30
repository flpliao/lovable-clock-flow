
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/company';

export class CompanyRepository {
  // 根據ID查詢公司資料
  static async findById(companyId: string): Promise<Company | null> {
    console.log('🔍 CompanyRepository: 查詢公司資料，ID:', companyId);
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .maybeSingle();

      if (error) {
        console.error('❌ CompanyRepository: 查詢公司資料時發生錯誤:', error);
        return null;
      }

      if (data) {
        console.log('✅ CompanyRepository: 成功查詢到公司資料:', data.name);
      } else {
        console.log('⚠️ CompanyRepository: 未找到指定ID的公司資料');
      }

      return data as Company | null;
    } catch (error) {
      console.error('💥 CompanyRepository: 查詢過程中發生錯誤:', error);
      return null;
    }
  }

  // 查詢第一個可用的公司
  static async findFirstAvailable(): Promise<Company | null> {
    console.log('🔄 CompanyRepository: 查詢第一個可用的公司...');
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('❌ CompanyRepository: 查詢第一個公司資料錯誤:', error);
        return null;
      }
      
      if (data) {
        console.log('✅ CompanyRepository: 成功載入第一個公司資料:', data.name);
      } else {
        console.log('⚠️ CompanyRepository: 資料庫中沒有任何公司資料');
      }

      return data as Company | null;
    } catch (error) {
      console.error('💥 CompanyRepository: 查詢過程中發生錯誤:', error);
      return null;
    }
  }

  // 創建新公司
  static async create(companyData: any): Promise<Company> {
    console.log('➕ CompanyRepository: 創建新公司資料:', companyData);
    
    try {
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
        console.error('❌ CompanyRepository: 創建公司資料失敗:', error);
        throw error;
      }

      console.log('✅ CompanyRepository: 成功創建公司資料:', data);
      return data as Company;
    } catch (error) {
      console.error('💥 CompanyRepository: 創建過程中發生錯誤:', error);
      throw error;
    }
  }

  // 更新公司資料
  static async update(companyId: string, companyData: any): Promise<Company> {
    console.log('🔄 CompanyRepository: 更新公司資料，ID:', companyId);
    
    try {
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
        console.error('❌ CompanyRepository: 更新公司資料失敗:', error);
        throw error;
      }

      console.log('✅ CompanyRepository: 公司資料更新成功:', data);
      return data as Company;
    } catch (error) {
      console.error('💥 CompanyRepository: 更新過程中發生錯誤:', error);
      throw error;
    }
  }

  // 刪除公司資料
  static async deleteById(companyId: string): Promise<boolean> {
    console.log('🗑️ CompanyRepository: 刪除公司資料，ID:', companyId);
    
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) {
        console.error('❌ CompanyRepository: 刪除公司資料失敗:', error);
        throw error;
      }

      console.log('✅ CompanyRepository: 成功刪除公司資料');
      return true;
    } catch (error) {
      console.error('💥 CompanyRepository: 刪除過程中發生錯誤:', error);
      throw error;
    }
  }

  // 強制重新載入指定公司
  static async forceReload(companyId: string): Promise<Company | null> {
    console.log('🔄 CompanyRepository: 強制重新載入公司資料，ID:', companyId);
    
    try {
      // 清除可能的快取
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .maybeSingle();

      if (error) {
        console.error('❌ CompanyRepository: 強制重新載入失敗:', error);
        return null;
      }

      if (data) {
        console.log('✅ CompanyRepository: 強制重新載入成功:', data.name);
      }

      return data as Company | null;
    } catch (error) {
      console.error('💥 CompanyRepository: 強制重新載入過程中發生錯誤:', error);
      return null;
    }
  }
}
