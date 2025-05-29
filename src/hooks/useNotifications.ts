
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
    console.log('Loading notifications for user:', currentUser.id, 'Name:', currentUser.name, 'Role:', currentUser.role);
    setIsLoading(true);

    try {
      const formattedNotifications = await NotificationDatabaseOperations.loadNotifications(currentUser.id);
      const unread = formattedNotifications.filter(n => !n.isRead).length;
      
      console.log('Raw loaded notifications:', formattedNotifications);
      console.log('Unread count:', unread);
      
      setNotifications(formattedNotifications);
      setUnreadCount(unread);
      console.log(`通知載入完成 - 用戶: ${currentUser.name} (${currentUser.role}), 總計: ${formattedNotifications.length}, 未讀: ${unread}`);
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
      console.log('User changed, loading notifications for:', currentUser.id, currentUser.name, currentUser.role);
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

    console.log('Setting up real-time subscription for user:', currentUser.id, currentUser.name, currentUser.role);
    
    const cleanup = NotificationRealtimeService.setupRealtimeSubscription(
      currentUser.id,
      () => {
        console.log(`Real-time event triggered for ${currentUser.name} (${currentUser.role}), reloading notifications`);
        loadNotifications();
      }
    );

    return cleanup;
  }, [currentUser, loadNotifications]);

  // 監聽各種通知更新事件
  useEffect(() => {
    if (!currentUser) return;

    const handleUserNotificationUpdate = (event: CustomEvent) => {
      console.log(`收到用戶專屬通知更新事件 for ${currentUser.name} (${currentUser.role}):`, event.detail);
      
      // 立即刷新通知
      console.log(`立即刷新 ${currentUser.name} (${currentUser.role}) 的通知`);
      loadNotifications();
    };

    const handleUserSpecificRefresh = (event: CustomEvent) => {
      console.log(`收到用戶專屬強制刷新事件 for ${currentUser.name} (${currentUser.role}):`, event.detail);
      loadNotifications();
    };

    const handleNotificationUpdate = (event: CustomEvent) => {
      console.log(`收到通知更新事件 for ${currentUser.name} (${currentUser.role}):`, event.detail);
      
      // 對於公告通知，所有用戶都應該刷新
      console.log(`通用通知事件，為 ${currentUser.name} (${currentUser.role}) 刷新通知`);
      loadNotifications();
    };

    const handleForceRefresh = (event: Event | CustomEvent) => {
      console.log(`收到強制刷新事件 for ${currentUser.name} (${currentUser.role})`);
      if (event instanceof CustomEvent && event.detail) {
        console.log('Force refresh detail:', event.detail);
      }
      loadNotifications();
    };

    // 註冊事件監聽器
    window.addEventListener('userNotificationUpdated', handleUserNotificationUpdate as EventListener);
    window.addEventListener(`forceNotificationRefresh-${currentUser.id}`, handleUserSpecificRefresh as EventListener);
    window.addEventListener('notificationUpdated', handleNotificationUpdate as EventListener);
    window.addEventListener('forceNotificationRefresh', handleForceRefresh as EventListener);
    
    return () => {
      window.removeEventListener('userNotificationUpdated', handleUserNotificationUpdate as EventListener);
      window.removeEventListener(`forceNotificationRefresh-${currentUser.id}`, handleUserSpecificRefresh as EventListener);
      window.removeEventListener('notificationUpdated', handleNotificationUpdate as EventListener);
      window.removeEventListener('forceNotificationRefresh', handleForceRefresh as EventListener);
    };
  }, [loadNotifications, currentUser]);

  // 定期自動刷新通知（每30秒）
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      console.log(`定期刷新通知 for ${currentUser.name} (${currentUser.role})`);
      loadNotifications();
    }, 30000); // 30秒

    return () => clearInterval(interval);
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
