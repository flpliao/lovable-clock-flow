
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/components/notifications/NotificationItem';

export class NotificationDatabaseService {
  /**
   * Load notifications from database for a specific user
   */
  static async loadNotifications(userId: string): Promise<Notification[]> {
    try {
      console.log('Loading notifications for user:', userId);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading notifications:', error);
        return [];
      }

      console.log('Raw notifications data from database:', data);

      const formattedNotifications: Notification[] = (data || []).map((notification: any) => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type as Notification['type'],
        createdAt: notification.created_at,
        isRead: notification.is_read,
        data: {
          announcementId: notification.announcement_id,
          leaveRequestId: notification.leave_request_id,
          userId: notification.user_id,
          actionRequired: notification.action_required || false
        }
      }));

      console.log('Formatted notifications:', formattedNotifications);
      return formattedNotifications;
    } catch (error) {
      console.error('Error loading notifications:', error);
      return [];
    }
  }

  /**
   * Add a new notification using the database function
   */
  static async addNotification(
    userId: string, 
    notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>
  ): Promise<string> {
    try {
      console.log('Adding notification for user:', userId, 'notification:', notification);
      
      // Use the database function to create notification
      const { data, error } = await supabase.rpc('create_notification', {
        p_user_id: userId,
        p_title: notification.title || '新通知',
        p_message: notification.message || '',
        p_type: notification.type || 'system',
        p_announcement_id: notification.data?.announcementId || null,
        p_leave_request_id: notification.data?.leaveRequestId || null,
        p_action_required: notification.data?.actionRequired || false
      });

      if (error) {
        console.error('Notification creation failed:', error);
        return '';
      }

      console.log('Notification created successfully with ID:', data);
      return data || '';
    } catch (error) {
      console.error('Error adding notification:', error);
      return '';
    }
  }

  /**
   * Mark a single notification as read
   */
  static async markNotificationAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      console.log('Marking notification as read:', notificationId);
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      console.log('Notification marked as read successfully');
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    try {
      console.log('Marking all notifications as read for user:', userId);
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
      }

      console.log('All notifications marked as read successfully');
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  /**
   * Clear all notifications for a user
   */
  static async clearAllNotifications(userId: string): Promise<boolean> {
    try {
      console.log('Clearing all notifications for user:', userId);
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error clearing notifications:', error);
        return false;
      }

      console.log('All notifications cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing notifications:', error);
      return false;
    }
  }

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
          const notificationId = await this.addNotification(userId, notificationTemplate);
          
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
      const testNotificationId = await this.addNotification(userId, {
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
