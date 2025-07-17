import { Notification } from '@/components/notifications/NotificationItem';
import { useNotificationActions } from '@/hooks/useNotificationActions';
import { useCurrentUser } from '@/hooks/useStores';
import { NotificationRealtimeService } from '@/services/notificationRealtimeService';
import { NotificationDatabaseOperations } from '@/services/notifications';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useNotifications = () => {
  const currentUser = useCurrentUser();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const lastRefreshRef = useRef<Date>(new Date());
  const loadingRef = useRef(false);
  const hasInitialLoadRef = useRef(false);

  // Load notifications from database with debouncing
  const loadNotifications = useCallback(
    async (forceLoad = false) => {
      if (!currentUser || loadingRef.current) {
        return;
      }

      const now = new Date();
      // 防止頻繁刷新 - 至少間隔 2 秒，但首次載入或強制載入時不受限制
      if (
        !forceLoad &&
        hasInitialLoadRef.current &&
        now.getTime() - lastRefreshRef.current.getTime() < 2000
      ) {
        return;
      }

      loadingRef.current = true;
      setIsLoading(true);

      try {
        const formattedNotifications = await NotificationDatabaseOperations.loadNotifications(
          currentUser.id
        );
        const unread = formattedNotifications.filter(n => !n.isRead).length;

        setNotifications(formattedNotifications);
        setUnreadCount(unread);
        lastRefreshRef.current = now;
        hasInitialLoadRef.current = true;
      } catch (error) {
        console.error('Error loading notifications:', error);
      } finally {
        setIsLoading(false);
        loadingRef.current = false;
      }
    },
    [currentUser]
  );

  // Load notifications when user changes
  useEffect(() => {
    if (currentUser) {
      hasInitialLoadRef.current = false;
      loadNotifications(true);
    } else {
      setNotifications([]);
      setUnreadCount(0);
      hasInitialLoadRef.current = false;
    }
  }, [currentUser?.id, loadNotifications]);

  // Set up real-time subscription for notifications
  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const cleanup = NotificationRealtimeService.setupRealtimeSubscription(currentUser.id, () =>
      loadNotifications()
    );

    return cleanup;
  }, [currentUser?.id, loadNotifications]);

  // 監聽通知更新事件
  useEffect(() => {
    if (!currentUser) return;

    const handleNotificationUpdate = () => {
      // 防止頻繁刷新
      const now = new Date();
      if (now.getTime() - lastRefreshRef.current.getTime() > 1000) {
        loadNotifications();
      }
    };

    // 註冊事件監聽器
    window.addEventListener('notificationUpdated', handleNotificationUpdate);
    window.addEventListener('forceNotificationRefresh', handleNotificationUpdate);

    return () => {
      window.removeEventListener('notificationUpdated', handleNotificationUpdate);
      window.removeEventListener('forceNotificationRefresh', handleNotificationUpdate);
    };
  }, [currentUser?.id, loadNotifications]);

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
    ...actions,
  };
};
