
import { supabase } from '@/integrations/supabase/client';
import { NotificationDatabaseOperations } from './notificationDatabaseOperations';

export class NotificationDatabaseTesting {
  /**
   * 測試資料庫連接和權限
   */
  static async testDatabaseConnection(userId: string): Promise<boolean> {
    try {
      console.log('Testing database connection for user:', userId);
      
      // 測試讀取權限
      const { data: readTest, error: readError } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (readError) {
        console.error('Read test failed:', readError);
        return false;
      }

      console.log('Read test passed:', readTest);

      // 測試寫入權限 - 使用數據庫函數
      const testNotificationId = await NotificationDatabaseOperations.addNotification(userId, {
        title: '測試通知',
        message: '這是一個測試通知',
        type: 'system',
        data: {
          actionRequired: false
        }
      });

      if (testNotificationId) {
        console.log('Write test passed, notification ID:', testNotificationId);
        
        // 清理測試資料
        try {
          await supabase
            .from('notifications')
            .delete()
            .eq('id', testNotificationId);
        } catch (cleanupError) {
          console.log('Could not cleanup test notification:', cleanupError);
        }
        
        return true;
      } else {
        console.error('Write test failed - no notification ID returned');
        return false;
      }
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}
