
import { useState, useEffect, useCallback } from 'react';
import { Notification } from '@/components/notifications/NotificationItem';
import { useUser } from '@/contexts/UserContext';
import { NotificationDatabaseOperations } from '@/services/notifications';
import { NotificationRealtimeService } from '@/services/notificationRealtimeService';
import { useNotificationActions } from '@/hooks/useNotificationActions';

export const useNotifications = () => {
  const { currentUser } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load notifications from database
  const loadNotifications = useCallback(async () => {
    if (!currentUser) {
      console.log('No current user, clearing notifications');
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    console.log('=== 開始載入通知 ===');
    console.log('Loading notifications for user:', currentUser.id, 'Name:', currentUser.name);
    setIsLoading(true);

    try {
      const formattedNotifications = await NotificationDatabaseOperations.loadNotifications(currentUser.id);
      const unread = formattedNotifications.filter(n => !n.isRead).length;
      
      console.log('Raw loaded notifications:', formattedNotifications);
      console.log('Unread count:', unread);
      
      setNotifications(formattedNotifications);
      setUnreadCount(unread);
      console.log(`通知載入完成 - 用戶: ${currentUser.name}, 總計: ${formattedNotifications.length}, 未讀: ${unread}`);
      console.log('=== 通知載入完成 ===');
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  // Load notifications when user changes
  useEffect(() => {
    if (currentUser) {
      console.log('User changed, loading notifications for:', currentUser.id, currentUser.name);
      loadNotifications();
    } else {
      console.log('No user, clearing notifications');
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [currentUser, loadNotifications]);

  // Set up real-time subscription for notifications
  useEffect(() => {
    if (!currentUser) {
      console.log('No current user for real-time subscription');
      return;
    }

    console.log('Setting up real-time subscription for user:', currentUser.id, currentUser.name);
    
    const cleanup = NotificationRealtimeService.setupRealtimeSubscription(
      currentUser.id,
      () => {
        console.log(`Real-time event triggered for ${currentUser.name}, reloading notifications`);
        setTimeout(() => {
          loadNotifications();
        }, 200); // 減少延遲提高響應性
      }
    );

    return cleanup;
  }, [currentUser, loadNotifications]);

  // 監聽用戶專屬的通知更新事件
  useEffect(() => {
    if (!currentUser) return;

    const handleUserNotificationUpdate = (event: CustomEvent) => {
      console.log(`收到用戶專屬通知更新事件 for ${currentUser.name}:`, event.detail);
      
      // 檢查是否為當前用戶的通知
      if (event.detail?.userId === currentUser.id) {
        console.log(`通知事件針對當前用戶 ${currentUser.name}，立即刷新`);
        setTimeout(() => {
          loadNotifications();
        }, 300);
      }
    };

    const handleNotificationUpdate = (event: CustomEvent) => {
      console.log(`收到通知更新事件 for ${currentUser.name}:`, event.detail);
      
      // 檢查是否與當前用戶相關
      if (event.detail?.affectedUsers && Array.isArray(event.detail.affectedUsers)) {
        const isUserAffected = event.detail.affectedUsers.some((user: any) => user.id === currentUser.id);
        if (isUserAffected) {
          console.log(`通知事件包含當前用戶 ${currentUser.name}，立即刷新`);
          setTimeout(() => {
            loadNotifications();
          }, 500);
        } else {
          console.log(`通知事件不包含當前用戶 ${currentUser.name}，跳過刷新`);
        }
      } else {
        // 如果沒有特定用戶列表，則刷新所有用戶的通知
        console.log(`通用通知事件，為 ${currentUser.name} 刷新通知`);
        setTimeout(() => {
          loadNotifications();
        }, 800);
      }
    };

    const handleForceRefresh = (event: Event | CustomEvent) => {
      console.log(`收到強制刷新事件 for ${currentUser.name}`);
      if (event instanceof CustomEvent && event.detail) {
        console.log('Force refresh detail:', event.detail);
      }
      loadNotifications();
    };

    window.addEventListener('userNotificationUpdated', handleUserNotificationUpdate as EventListener);
    window.addEventListener('notificationUpdated', handleNotificationUpdate as EventListener);
    window.addEventListener('forceNotificationRefresh', handleForceRefresh as EventListener);
    
    return () => {
      window.removeEventListener('userNotificationUpdated', handleUserNotificationUpdate as EventListener);
      window.removeEventListener('notificationUpdated', handleNotificationUpdate as EventListener);
      window.removeEventListener('forceNotificationRefresh', handleForceRefresh as EventListener);
    };
  }, [loadNotifications, currentUser]);

  // Get notification actions
  const actions = useNotificationActions(
    currentUser?.id || null,
    notifications,
    setNotifications,
    setUnreadCount,
    loadNotifications
  );

  return { 
    notifications, 
    unreadCount,
    isLoading,
    refreshNotifications: loadNotifications,
    ...actions
  };
};
