
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/company';

export class CompanyRepository {
  // 根據公司名稱查詢
  static async findByName(companyName: string): Promise<Company | null> {
    console.log('🔍 CompanyRepository: 按名稱查詢公司資料:', companyName);
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('name', companyName)
        .maybeSingle();

      if (error) {
        console.error('❌ CompanyRepository: 按名稱查詢錯誤:', error);
        return null;
      }

      if (data) {
        console.log('✅ CompanyRepository: 按名稱查詢成功:', data.name);
      } else {
        console.log('⚠️ CompanyRepository: 按名稱找不到公司資料');
      }

      return data as Company | null;
    } catch (error) {
      console.error('💥 CompanyRepository: 按名稱查詢過程中發生錯誤:', error);
      return null;
    }
  }

  // 根據統一編號查詢
  static async findByRegistrationNumber(registrationNumber: string): Promise<Company | null> {
    console.log('🔍 CompanyRepository: 按統一編號查詢公司資料:', registrationNumber);
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('registration_number', registrationNumber)
        .maybeSingle();

      if (error) {
        console.error('❌ CompanyRepository: 按統一編號查詢錯誤:', error);
        return null;
      }

      if (data) {
        console.log('✅ CompanyRepository: 按統一編號查詢成功:', data.name);
      } else {
        console.log('⚠️ CompanyRepository: 按統一編號找不到公司資料');
      }

      return data as Company | null;
    } catch (error) {
      console.error('💥 CompanyRepository: 按統一編號查詢過程中發生錯誤:', error);
      return null;
    }
  }

  // 查詢第一個匹配的公司（模糊查詢）
  static async findFirstMatchingCompany(): Promise<Company | null> {
    console.log('🔄 CompanyRepository: 查詢所有公司並尋找依美琦相關資料...');
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .or('name.ilike.%依美琦%,registration_number.eq.53907735,legal_representative.eq.廖俊雄')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('❌ CompanyRepository: 模糊查詢錯誤:', error);
        return null;
      }
      
      if (data) {
        console.log('✅ CompanyRepository: 模糊查詢找到匹配的公司:', data.name);
      } else {
        console.log('⚠️ CompanyRepository: 模糊查詢沒有找到匹配的公司');
      }

      return data as Company | null;
    } catch (error) {
      console.error('💥 CompanyRepository: 模糊查詢過程中發生錯誤:', error);
      return null;
    }
  }

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

  // 列出所有公司（用於調試）
  static async listAll(): Promise<Company[]> {
    console.log('📋 CompanyRepository: 列出所有公司資料...');
    
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ CompanyRepository: 列出公司資料失敗:', error);
        return [];
      }

      console.log('✅ CompanyRepository: 成功列出公司資料，共', data?.length || 0, '筆');
      return data as Company[] || [];
    } catch (error) {
      console.error('💥 CompanyRepository: 列出公司資料過程中發生錯誤:', error);
      return [];
    }
  }
}
