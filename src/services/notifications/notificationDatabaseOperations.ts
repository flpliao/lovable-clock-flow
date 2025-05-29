
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/components/notifications/NotificationItem';

export class NotificationDatabaseOperations {
  /**
   * Validate and format user ID to ensure it's a valid UUID
   */
  static validateUserId(userId: string): string {
    console.log('Validating user ID in database operations:', userId);
    
    // Check if it's already a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(userId)) {
      console.log('User ID is already valid UUID:', userId);
      return userId;
    }
    
    // If it's a simple string like "1", convert it to a valid UUID format
    if (userId === "1" || userId === "admin") {
      const validUUID = '550e8400-e29b-41d4-a716-446655440001';
      console.log('Converting simple user ID to valid UUID in database operations:', validUUID);
      return validUUID;
    }
    
    console.warn('User ID is not valid UUID format, using fallback in database operations:', userId);
    return '550e8400-e29b-41d4-a716-446655440001';
  }

  /**
   * Load notifications from database for a specific user
   */
  static async loadNotifications(userId: string): Promise<Notification[]> {
    try {
      console.log('Loading notifications for user (原始):', userId);
      
      // Validate user ID
      const validUserId = this.validateUserId(userId);
      console.log('Loading notifications for user (驗證後):', validUserId);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', validUserId)
        .order('created_at', { ascending: false })
        .limit(50); // 限制數量避免載入過多

      if (error) {
        console.error('Error loading notifications:', error);
        return [];
      }

      console.log('Raw notifications data from database:', data);

      if (!data || data.length === 0) {
        console.log('No notifications found for user:', validUserId);
        return [];
      }

      const formattedNotifications: Notification[] = data.map((notification: any) => ({
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
      console.log('Adding notification for user (原始):', userId, 'notification:', notification);
      
      // Validate user ID
      const validUserId = this.validateUserId(userId);
      console.log('Adding notification for user (驗證後):', validUserId);
      
      // Use the database function to create notification
      const { data, error } = await supabase.rpc('create_notification', {
        p_user_id: validUserId,
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
      console.log('Marking notification as read:', notificationId, 'for user (原始):', userId);
      
      // Validate user ID
      const validUserId = this.validateUserId(userId);
      console.log('Marking notification as read for user (驗證後):', validUserId);
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', validUserId);

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

  static async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    try {
      console.log('Marking all notifications as read for user (原始):', userId);
      
      // Validate user ID
      const validUserId = this.validateUserId(userId);
      console.log('Marking all notifications as read for user (驗證後):', validUserId);
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', validUserId)
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

  static async clearAllNotifications(userId: string): Promise<boolean> {
    try {
      console.log('Clearing all notifications for user (原始):', userId);
      
      // Validate user ID
      const validUserId = this.validateUserId(userId);
      console.log('Clearing all notifications for user (驗證後):', validUserId);
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', validUserId);

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
}
