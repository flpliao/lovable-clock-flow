
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
  /**
   * Validate and format user ID to ensure it's a valid UUID
   */
  const validateUserId = (userId: string): string => {
    console.log('Validating user ID in notification actions:', userId);
    
    // Check if it's already a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(userId)) {
      console.log('User ID is already valid UUID:', userId);
      return userId;
    }
    
    // If it's a simple string like "1", convert it to a valid UUID format
    if (userId === "1" || userId === "admin") {
      const validUUID = '550e8400-e29b-41d4-a716-446655440001';
      console.log('Converting simple user ID to valid UUID in notification actions:', validUUID);
      return validUUID;
    }
    
    console.warn('User ID is not valid UUID format, using fallback in notification actions:', userId);
    return '550e8400-e29b-41d4-a716-446655440001';
  };

  const markAsRead = async (id: string) => {
    if (!currentUserId) return;

    // Validate user ID
    const validUserId = validateUserId(currentUserId);
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

    // Validate user ID
    const validUserId = validateUserId(currentUserId);
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

    // Validate user ID
    const validUserId = validateUserId(currentUserId);
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

    // Validate user ID
    const validUserId = validateUserId(currentUserId);
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
