
import { useState } from 'react';
import { Notification } from '@/components/notifications/NotificationItem';
import { NotificationDatabaseOperations } from '@/services/notifications';
import { toast } from '@/hooks/use-toast';

export const useNotificationActions = (
  currentUserId: string | null,
  notifications: Notification[],
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>,
  refreshNotifications: () => Promise<void>
) => {
  const markAsRead = async (id: string) => {
    if (!currentUserId) return;

    console.log('Marking notification as read with user ID:', currentUserId);

    const success = await NotificationDatabaseOperations.markNotificationAsRead(id, currentUserId);
    if (success) {
      // Update local state immediately
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    if (!currentUserId) return;

    console.log('Marking all notifications as read with user ID:', currentUserId);

    const success = await NotificationDatabaseOperations.markAllNotificationsAsRead(currentUserId);
    if (success) {
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);

      // 移除成功提醒
    }
  };

  const clearNotifications = async () => {
    if (!currentUserId) return;

    console.log('Clearing all notifications with user ID:', currentUserId);

    const success = await NotificationDatabaseOperations.clearAllNotifications(currentUserId);
    if (success) {
      setNotifications([]);
      setUnreadCount(0);
      
      // 移除成功提醒
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<string> => {
    if (!currentUserId) {
      console.log('No current user for adding notification');
      return '';
    }

    console.log('Adding notification with user ID:', currentUserId);

    const notificationId = await NotificationDatabaseOperations.addNotification(currentUserId, notification);
    
    if (notificationId) {
      // Reload notifications to get the latest data
      await refreshNotifications();
      
      // 保留即時通知提醒，但縮短顯示時間
      toast({
        title: notification.title,
        description: notification.message,
        duration: 3000  // 從 5 秒縮短到 3 秒
      });
    }
    
    return notificationId;
  };

  return {
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification
  };
};
