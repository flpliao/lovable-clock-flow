import { supabase } from '@/integrations/supabase/client';
import { Branch, NewBranch } from '@/types/company';

export class branchService {
  /**
   * 載入指定公司的所有分支機構
   */
  static async loadBranches(companyId: string): Promise<Branch[]> {
    console.log('🔍 branchService: 載入單位...', companyId);

    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ branchService: 載入單位失敗:', error);
        throw new Error(`載入單位失敗: ${error.message}`);
      }

      console.log('✅ branchService: 載入單位成功:', data?.length || 0, '筆');
      return (data as Branch[]) || [];
    } catch (error) {
      console.error('💥 branchService: 載入單位時發生錯誤:', error);
      throw error;
    }
  }

  /**
   * 新增分支機構
   */
  static async addBranch(companyId: string, branchData: NewBranch): Promise<Branch> {
    console.log('➕ branchService: 新增單位:', branchData);

    try {
      const { data, error } = await supabase
        .from('branches')
        .insert({
          ...branchData,
          company_id: companyId,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ branchService: 新增單位失敗:', error);
        throw new Error(`新增單位失敗: ${error.message}`);
      }

      console.log('✅ branchService: 新增單位成功');
      return data as Branch;
    } catch (error) {
      console.error('💥 branchService: 新增單位時發生錯誤:', error);
      throw error;
    }
  }

  /**
   * 更新分支機構
   */
  static async updateBranch(branchId: string, branchData: Partial<Branch>): Promise<void> {
    console.log('🔄 branchService: 更新單位:', branchId, branchData);

    try {
      const { error } = await supabase
        .from('branches')
        .update({
          ...branchData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', branchId);

      if (error) {
        console.error('❌ branchService: 更新單位失敗:', error);
        throw new Error(`更新單位失敗: ${error.message}`);
      }

      console.log('✅ branchService: 更新單位成功');
    } catch (error) {
      console.error('💥 branchService: 更新單位時發生錯誤:', error);
      throw error;
    }
  }

  /**
   * 刪除分支機構
   */
  static async deleteBranch(branchId: string): Promise<void> {
    console.log('🗑️ branchService: 刪除單位:', branchId);

    try {
      // 檢查是否為其他單位的上層單位
      const { data, error: checkError } = await supabase
        .from('branches')
        .select('id, name')
        .eq('parent_branch_id', branchId);

      const childBranches = data as Branch[];

      if (checkError) {
        throw new Error(`檢查子單位失敗: ${checkError.message}`);
      }

      if (childBranches && childBranches.length > 0) {
        const childNames = (childBranches as { name: string }[])
          .map(branch => branch.name)
          .join('、');
        throw new Error(`無法刪除單位，因為它是以下單位的上層單位：${childNames}`);
      }

      // 執行刪除
      const { error } = await supabase.from('branches').delete().eq('id', branchId);

      if (error) {
        console.error('❌ branchService: 刪除單位失敗:', error);
        throw new Error(`刪除單位失敗: ${error.message}`);
      }

      console.log('✅ branchService: 刪除單位成功');
    } catch (error) {
      console.error('💥 branchService: 刪除單位時發生錯誤:', error);
      throw error;
    }
  }

  /**
   * 從 Supabase 讀取全部單位資料
   */
  static async loadBranchesSimple(): Promise<Branch[]> {
    console.log('🏬 branchService: 載入 branches ...');

    const { data, error } = await supabase
      .from('branches')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ branchService: 載入失敗', error);
      throw new Error(`載入單位失敗: ${error.message}`);
    }

    console.log(`✅ branchService: 取得 ${data?.length || 0} 筆 branches`);
    return (data || []) as Branch[];
  }
}
