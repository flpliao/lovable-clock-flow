
import { Notification } from '@/components/notifications/NotificationItem';
import { NotificationDatabaseOperations } from './notificationDatabaseOperations';

export class NotificationBulkOperations {
  /**
   * 批量創建通知 - 使用數據庫函數
   */
  static async createBulkNotifications(
    userIds: string[],
    notificationTemplate: Omit<Notification, 'id' | 'createdAt' | 'isRead'>
  ): Promise<boolean> {
    try {
      console.log('Creating bulk notifications for users:', userIds.length, 'template:', notificationTemplate);

      if (userIds.length === 0) {
        console.log('No users to notify');
        return true;
      }

      // 使用數據庫函數逐個創建通知
      let successCount = 0;
      
      for (const userId of userIds) {
        try {
          console.log(`Creating notification for user: ${userId}`);
          const notificationId = await NotificationDatabaseOperations.addNotification(userId, notificationTemplate);
          
          if (notificationId) {
            successCount++;
            console.log(`✓ Notification created for user ${userId}: ${notificationId}`);
          } else {
            console.error(`✗ Failed to create notification for user ${userId}`);
          }
          
          // 添加小延遲以避免過快請求
          await new Promise(resolve => setTimeout(resolve, 50));
        } catch (error) {
          console.error(`Error creating notification for user ${userId}:`, error);
        }
      }
      
      console.log(`Bulk notifications completed: ${successCount}/${userIds.length} successful`);
      return successCount > 0;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      return false;
    }
  }
}
