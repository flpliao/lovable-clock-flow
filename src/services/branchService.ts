import { supabase } from '@/integrations/supabase/client';
import { Branch } from '@/types/company';

export class branchService {
  /**
   * 從 Supabase 讀取全部營業處資料，僅取 id 與 name 欄位
   */
  static async loadBranches(): Promise<Branch[]> {
    console.log('🏬 branchService: 載入 branches ...');

    const { data, error } = await supabase
      .from('branches')
      .select('id, name')
      .order('name', { ascending: true });

    if (error) {
      console.error('❌ branchService: 載入失敗', error);
      throw new Error(`載入營業處失敗: ${error.message}`);
    }

    console.log(`✅ branchService: 取得 ${data?.length || 0} 筆 branches`);
    return (data || []) as Branch[];
  }
}
