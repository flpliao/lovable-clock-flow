
import { supabase } from '@/integrations/supabase/client';
import { Company } from '@/types/company';

export class CompanySubscriptionManager {
  // 監聽公司資料變更
  static subscribeToCompanyChanges(callback: (company: Company | null) => void) {
    console.log('👂 CompanySubscriptionManager: 開始監聽公司資料變更...');
    
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
            console.log('🔔 CompanySubscriptionManager: 收到公司資料變更通知:', payload);
            
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
      console.error('❌ CompanySubscriptionManager: 設定即時監聽失敗:', error);
      return {
        unsubscribe: () => console.log('空的 channel，無需取消訂閱')
      };
    }
  }
}
