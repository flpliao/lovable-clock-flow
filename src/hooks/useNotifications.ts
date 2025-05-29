
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

  // Load notifications from database
  const loadNotifications = async () => {
    if (!currentUser) {
      console.log('No current user, clearing notifications');
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    const formattedNotifications = await NotificationDatabaseService.loadNotifications(currentUser.id);
    const unread = formattedNotifications.filter(n => !n.isRead).length;
    
    setNotifications(formattedNotifications);
    setUnreadCount(unread);
    console.log('Updated notifications state - total:', formattedNotifications.length, 'unread:', unread);
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

    const cleanup = NotificationRealtimeService.setupRealtimeSubscription(
      currentUser.id,
      loadNotifications
    );

    return cleanup;
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
    refreshNotifications: loadNotifications,
    ...actions
  };
};
