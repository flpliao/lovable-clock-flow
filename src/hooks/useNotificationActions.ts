
import { useState } from 'react';
import { Notification } from '@/components/notifications/NotificationItem';
import { NotificationDatabaseService } from '@/services/notificationDatabaseService';
import { toast } from '@/hooks/use-toast';

export const useNotificationActions = (
  currentUserId: string | null,
  notifications: Notification[],
  setNotifications: (notifications: Notification[]) => void,
  setUnreadCount: (count: number) => void,
  refreshNotifications: () => Promise<void>
) => {
  const markAsRead = async (id: string) => {
    if (!currentUserId) return;

    const success = await NotificationDatabaseService.markNotificationAsRead(id, currentUserId);
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

    const success = await NotificationDatabaseService.markAllNotificationsAsRead(currentUserId);
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

    const success = await NotificationDatabaseService.clearAllNotifications(currentUserId);
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

    const notificationId = await NotificationDatabaseService.addNotification(currentUserId, notification);
    
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
