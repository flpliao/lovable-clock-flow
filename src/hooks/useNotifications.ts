
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
    console.log('Loading notifications for user:', currentUser.id);
    setIsLoading(true);

    try {
      const formattedNotifications = await NotificationDatabaseOperations.loadNotifications(currentUser.id);
      const unread = formattedNotifications.filter(n => !n.isRead).length;
      
      console.log('Raw loaded notifications:', formattedNotifications);
      console.log('Unread count:', unread);
      
      setNotifications(formattedNotifications);
      setUnreadCount(unread);
      console.log('Updated notifications state - total:', formattedNotifications.length, 'unread:', unread);
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
      console.log('User changed, loading notifications for:', currentUser.id);
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

    console.log('Setting up real-time subscription for user:', currentUser.id);
    
    const cleanup = NotificationRealtimeService.setupRealtimeSubscription(
      currentUser.id,
      () => {
        console.log('Real-time event triggered, reloading notifications');
        setTimeout(() => {
          loadNotifications();
        }, 500); // 增加延遲確保資料庫操作完成
      }
    );

    return cleanup;
  }, [currentUser, loadNotifications]);

  // 監聽自定義通知更新事件
  useEffect(() => {
    const handleNotificationUpdate = (event: CustomEvent) => {
      console.log('收到通知更新事件:', event.detail);
      setTimeout(() => {
        loadNotifications();
      }, 1000); // 增加延遲確保通知已創建
    };

    const handleForceRefresh = () => {
      console.log('收到強制刷新事件');
      loadNotifications();
    };

    window.addEventListener('notificationUpdated', handleNotificationUpdate as EventListener);
    window.addEventListener('forceNotificationRefresh', handleForceRefresh as EventListener);
    
    return () => {
      window.removeEventListener('notificationUpdated', handleNotificationUpdate as EventListener);
      window.removeEventListener('forceNotificationRefresh', handleForceRefresh as EventListener);
    };
  }, [loadNotifications]);

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
