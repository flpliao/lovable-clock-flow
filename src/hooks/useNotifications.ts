
import { useState, useEffect } from 'react';
import { Notification } from '@/components/notifications/NotificationItem';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

    try {
      console.log('Loading notifications for user:', currentUser.id);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading notifications:', error);
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      console.log('Raw notifications data from database:', data);

      const formattedNotifications: Notification[] = (data || []).map((notification: any) => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type as Notification['type'],
        createdAt: notification.created_at,
        isRead: notification.is_read,
        data: {
          announcementId: notification.announcement_id,
          leaveRequestId: notification.leave_request_id,
          userId: notification.user_id,
          actionRequired: notification.action_required || false
        }
      }));

      console.log('Formatted notifications:', formattedNotifications);
      const unread = formattedNotifications.filter(n => !n.isRead).length;
      
      setNotifications(formattedNotifications);
      setUnreadCount(unread);
      console.log('Updated notifications state - total:', formattedNotifications.length, 'unread:', unread);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
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

    console.log('Setting up real-time subscription for notifications, user:', currentUser.id);
    
    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUser.id}`
        },
        (payload) => {
          console.log('Real-time INSERT notification received:', payload);
          loadNotifications(); // Reload all notifications
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUser.id}`
        },
        (payload) => {
          console.log('Real-time UPDATE notification received:', payload);
          loadNotifications(); // Reload all notifications
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUser.id}`
        },
        (payload) => {
          console.log('Real-time DELETE notification received:', payload);
          loadNotifications(); // Reload all notifications
        }
      )
      .subscribe((status) => {
        console.log('Notification subscription status:', status);
      });

    return () => {
      console.log('Cleaning up notification subscription');
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const markAsRead = async (id: string) => {
    if (!currentUser) return;

    try {
      console.log('Marking notification as read:', id);
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', currentUser.id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      // Update local state immediately
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      console.log('Notification marked as read successfully');
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser) return;

    try {
      console.log('Marking all notifications as read for user:', currentUser.id);
      
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', currentUser.id)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);
      console.log('All notifications marked as read successfully');

      toast({
        title: "已標記為已讀",
        description: "所有通知已標記為已讀"
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const clearNotifications = async () => {
    if (!currentUser) return;

    try {
      console.log('Clearing all notifications for user:', currentUser.id);
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', currentUser.id);

      if (error) {
        console.error('Error clearing notifications:', error);
        return;
      }

      setNotifications([]);
      setUnreadCount(0);
      console.log('All notifications cleared successfully');
      
      toast({
        title: "通知已清空",
        description: "所有通知已被清空"
      });
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    if (!currentUser) {
      console.log('No current user for adding notification');
      return '';
    }

    try {
      console.log('Adding notification for user:', currentUser.id, 'notification:', notification);
      
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: currentUser.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          announcement_id: notification.data?.announcementId,
          leave_request_id: notification.data?.leaveRequestId,
          action_required: notification.data?.actionRequired || false
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding notification:', error);
        return '';
      }

      console.log('Notification added successfully:', data);
      
      // Reload notifications to get the latest data
      await loadNotifications();
      
      // Also show a toast for real-time feedback
      toast({
        title: notification.title,
        description: notification.message,
        duration: 5000
      });
      
      return data?.id || '';
    } catch (error) {
      console.error('Error adding notification:', error);
      return '';
    }
  };

  return { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications,
    addNotification,
    refreshNotifications: loadNotifications
  };
};
