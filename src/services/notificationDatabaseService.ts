
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
   * Add a new notification - 修復版本，確保能正確插入資料
   */
  static async addNotification(
    userId: string, 
    notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>
  ): Promise<string> {
    try {
      console.log('Adding notification for user:', userId, 'notification:', notification);
      
      // 確保資料完整性，直接使用 UUID 格式的 userId
      const notificationData = {
        user_id: userId,
        title: notification.title || '新通知',
        message: notification.message || '',
        type: notification.type || 'system',
        announcement_id: notification.data?.announcementId || null,
        leave_request_id: notification.data?.leaveRequestId || null,
        action_required: notification.data?.actionRequired || false,
        is_read: false,
        created_at: new Date().toISOString()
      };

      console.log('Inserting notification data:', notificationData);
      
      const { data, error } = await supabase
        .from('notifications')
        .insert(notificationData)
        .select()
        .single();

      if (error) {
        console.error('Error adding notification:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return '';
      }

      console.log('Notification added successfully:', data);
      return data?.id || '';
    } catch (error) {
      console.error('Error adding notification:', error);
      return '';
    }
  }

  /**
   * 批量創建通知 - 修復版本，確保能正確批量插入
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

      const notifications = userIds.map(userId => ({
        user_id: userId,
        title: notificationTemplate.title || '新通知',
        message: notificationTemplate.message || '',
        type: notificationTemplate.type || 'system',
        announcement_id: notificationTemplate.data?.announcementId || null,
        leave_request_id: notificationTemplate.data?.leaveRequestId || null,
        action_required: notificationTemplate.data?.actionRequired || false,
        is_read: false,
        created_at: new Date().toISOString()
      }));

      console.log('Bulk inserting notifications:', notifications);

      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)
        .select();

      if (error) {
        console.error('Error creating bulk notifications:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return false;
      }

      console.log('Bulk notifications created successfully:', data?.length);
      return true;
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

      // 測試寫入權限
      const testNotification = {
        user_id: userId,
        title: '測試通知',
        message: '這是一個測試通知',
        type: 'system',
        is_read: false,
        action_required: false,
        created_at: new Date().toISOString()
      };

      const { data: writeTest, error: writeError } = await supabase
        .from('notifications')
        .insert(testNotification)
        .select()
        .single();

      if (writeError) {
        console.error('Write test failed:', writeError);
        return false;
      }

      console.log('Write test passed:', writeTest);

      // 清理測試資料
      if (writeTest?.id) {
        await supabase
          .from('notifications')
          .delete()
          .eq('id', writeTest.id);
      }

      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }
}
