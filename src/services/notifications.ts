import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/components/notifications/NotificationItem';

interface DbNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  is_read: boolean;
  leave_request_id?: string;
  announcement_id?: string;
  action_required?: boolean;
}

export class NotificationDatabaseOperations {
  // 載入通知
  static async loadNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        throw error;
      }

      const formattedNotifications: Notification[] = (data || []).map(
        (notification: DbNotification) => ({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type as Notification['type'],
          createdAt: notification.created_at,
          isRead: notification.is_read,
          data: {
            leaveRequestId: notification.leave_request_id,
            announcementId: notification.announcement_id,
            actionRequired: notification.action_required,
          },
        })
      );

      return formattedNotifications;
    } catch (error) {
      console.error('載入通知失敗:', error);
      return [];
    }
  }

  // 新增通知
  static async addNotification(
    userId: string,
    notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>
  ): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          leave_request_id: notification.data?.leaveRequestId,
          announcement_id: notification.data?.announcementId,
          action_required: notification.data?.actionRequired || false,
          is_read: false,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data.id;
    } catch (error) {
      console.error('新增通知失敗:', error);
      return '';
    }
  }

  // 標記通知為已讀
  static async markNotificationAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('標記通知為已讀失敗:', error);
      return false;
    }
  }

  // 標記所有通知為已讀
  static async markAllNotificationsAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('標記所有通知為已讀失敗:', error);
      return false;
    }
  }

  // 清空所有通知
  static async clearAllNotifications(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('notifications').delete().eq('user_id', userId);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('清空所有通知失敗:', error);
      return false;
    }
  }
}
