
import { useState, useEffect } from 'react';
import { Notification } from '@/components/notifications/NotificationItem';
import { useUser } from '@/contexts/UserContext';
import { NotificationDatabaseService } from '@/services/notificationDatabaseService';
import { NotificationRealtimeService } from '@/services/notificationRealtimeService';
import { useNotificationActions } from '@/hooks/useNotificationActions';

export const useNotifications = () => {
  const { currentUser } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Load notifications from database
  const loadNotifications = async () => {
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
      const formattedNotifications = await NotificationDatabaseService.loadNotifications(currentUser.id);
      const unread = formattedNotifications.filter(n => !n.isRead).length;
      
      setNotifications(formattedNotifications);
      setUnreadCount(unread);
      console.log('Updated notifications state - total:', formattedNotifications.length, 'unread:', unread);
      console.log('=== 通知載入完成 ===');
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
  }, [currentUser]);

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
        loadNotifications();
      }
    );

    return cleanup;
  }, [currentUser]);

  // 監聽自定義通知更新事件
  useEffect(() => {
    const handleNotificationUpdate = (event: CustomEvent) => {
      console.log('收到通知更新事件:', event.detail);
      // 立即重新載入通知
      loadNotifications();
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
  }, [currentUser]);

  // 定期重新載入通知（作為備用機制）
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      console.log('定期刷新通知 (每30秒)');
      loadNotifications();
    }, 30000); // 每30秒刷新一次

    return () => clearInterval(interval);
  }, [currentUser]);

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
