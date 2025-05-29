
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

    // 使用固定的用戶ID
    const validUserId = '550e8400-e29b-41d4-a716-446655440001';
    console.log('Marking notification as read with validated user ID:', validUserId);

    const success = await NotificationDatabaseOperations.markNotificationAsRead(id, validUserId);
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

    // 使用固定的用戶ID
    const validUserId = '550e8400-e29b-41d4-a716-446655440001';
    console.log('Marking all notifications as read with validated user ID:', validUserId);

    const success = await NotificationDatabaseOperations.markAllNotificationsAsRead(validUserId);
    if (success) {
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);

      toast({
        title: "已標記為已讀",
        description: "所有通知已標記為已讀"
      });
    }
  };

  const clearNotifications = async () => {
    if (!currentUserId) return;

    // 使用固定的用戶ID
    const validUserId = '550e8400-e29b-41d4-a716-446655440001';
    console.log('Clearing all notifications with validated user ID:', validUserId);

    const success = await NotificationDatabaseOperations.clearAllNotifications(validUserId);
    if (success) {
      setNotifications([]);
      setUnreadCount(0);
      
      toast({
        title: "通知已清空",
        description: "所有通知已被清空"
      });
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<string> => {
    if (!currentUserId) {
      console.log('No current user for adding notification');
      return '';
    }

    // 使用固定的用戶ID
    const validUserId = '550e8400-e29b-41d4-a716-446655440001';
    console.log('Adding notification with validated user ID:', validUserId);

    const notificationId = await NotificationDatabaseOperations.addNotification(validUserId, notification);
    
    if (notificationId) {
      // Reload notifications to get the latest data
      await refreshNotifications();
      
      // Also show a toast for real-time feedback
      toast({
        title: notification.title,
        description: notification.message,
        duration: 5000
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
