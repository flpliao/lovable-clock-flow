
import { supabase } from '@/integrations/supabase/client';

export class PayrollStatsService {
  // 統計相關
  static async getPayrollStats() {
    console.log('📊 獲取薪資統計...');

    const { data, error } = await supabase
      .from('payrolls')
      .select('status, gross_salary, net_salary');

    if (error) {
      console.error('❌ 獲取薪資統計失敗:', error);
      throw error;
    }

    const stats = {
      total: data?.length || 0,
      pending: data?.filter(p => p.status === 'draft').length || 0,
      approved: data?.filter(p => p.status === 'approved').length || 0,
      paid: data?.filter(p => p.status === 'paid').length || 0,
      totalGross: data?.reduce((sum, p) => sum + (p.gross_salary || 0), 0) || 0,
      totalNet: data?.reduce((sum, p) => sum + (p.net_salary || 0), 0) || 0
    };

    console.log('✅ 薪資統計獲取成功:', stats);
    return stats;
  }
}
