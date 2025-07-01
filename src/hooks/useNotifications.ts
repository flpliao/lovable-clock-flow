import { useState, useEffect, useCallback, useRef } from 'react';
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
  const lastRefreshRef = useRef<Date>(new Date());
  const loadingRef = useRef(false);
  const hasInitialLoadRef = useRef(false);

  // Load notifications from database with debouncing
  const loadNotifications = useCallback(async (forceLoad = false) => {
    if (!currentUser || loadingRef.current) {
      return;
    }

    const now = new Date();
    // 防止頻繁刷新 - 至少間隔 2 秒，但首次載入或強制載入時不受限制
    if (!forceLoad && hasInitialLoadRef.current && now.getTime() - lastRefreshRef.current.getTime() < 2000) {
      console.log('跳過載入通知（時間間隔未達）');
      return;
    }

    console.log('=== 開始載入通知 ===');
    console.log('Loading notifications for user:', currentUser.id, 'Name:', currentUser.name, 'Role:', currentUser?.role_id);
    
    loadingRef.current = true;
    setIsLoading(true);

    try {
      const formattedNotifications = await NotificationDatabaseOperations.loadNotifications(currentUser.id);
      const unread = formattedNotifications.filter(n => !n.isRead).length;
      
      console.log('Raw loaded notifications:', formattedNotifications.length);
      console.log('Unread count:', unread);
      
      setNotifications(formattedNotifications);
      setUnreadCount(unread);
      lastRefreshRef.current = now;
      hasInitialLoadRef.current = true;
      console.log(`通知載入完成 - 用戶: ${currentUser.name} (${currentUser?.role_id}), 總計: ${formattedNotifications.length}, 未讀: ${unread}`);
      
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [currentUser]);

  // Load notifications when user changes - only once
  useEffect(() => {
    if (currentUser) {
      console.log('User changed, loading notifications for:', currentUser.id, currentUser.name, currentUser?.role_id);
      hasInitialLoadRef.current = false;
      loadNotifications(true);
    } else {
      console.log('No user, clearing notifications');
      setNotifications([]);
      setUnreadCount(0);
      hasInitialLoadRef.current = false;
    }
  }, [currentUser?.id, loadNotifications]);

  // Set up real-time subscription for notifications - only once
  useEffect(() => {
    if (!currentUser) {
      return;
    }

    console.log('Setting up real-time subscription for user:', currentUser.id, currentUser.name, currentUser?.role_id);
    
    const cleanup = NotificationRealtimeService.setupRealtimeSubscription(
      currentUser.id,
      () => {
        console.log(`Real-time event triggered for ${currentUser.name} (${currentUser?.role_id}), reloading notifications`);
        loadNotifications();
      }
    );

    return cleanup;
  }, [currentUser?.id, loadNotifications]);

  // 監聽通知更新事件 - 減少事件監聽器數量
  useEffect(() => {
    if (!currentUser) return;

    const handleNotificationUpdate = (event: CustomEvent) => {
      console.log(`收到通知更新事件 for ${currentUser.name} (${currentUser?.role_id}):`, event.detail);
      
      // 檢查是否需要刷新（防止頻繁刷新）
      const now = new Date();
      if (now.getTime() - lastRefreshRef.current.getTime() > 1000) { // 至少間隔 1 秒
        loadNotifications();
      }
    };

    // 只註冊關鍵的事件監聽器
    window.addEventListener('notificationUpdated', handleNotificationUpdate as EventListener);
    window.addEventListener('forceNotificationRefresh', handleNotificationUpdate as EventListener);
    
    return () => {
      window.removeEventListener('notificationUpdated', handleNotificationUpdate as EventListener);
      window.removeEventListener('forceNotificationRefresh', handleNotificationUpdate as EventListener);
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
    ...actions
  };
};
