
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
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      console.log('Loading notifications for user:', currentUser.id);
      
      // 使用 any 類型暫時解決 TypeScript 類型問題
      const { data, error } = await (supabase as any)
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

      setNotifications(formattedNotifications);
      setUnreadCount(formattedNotifications.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  // Load notifications when user changes
  useEffect(() => {
    loadNotifications();
  }, [currentUser]);

  const markAsRead = async (id: string) => {
    if (!currentUser) return;

    try {
      const { error } = await (supabase as any)
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', currentUser.id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!currentUser) return;

    try {
      const { error } = await (supabase as any)
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
      const { error } = await (supabase as any)
        .from('notifications')
        .delete()
        .eq('user_id', currentUser.id);

      if (error) {
        console.error('Error clearing notifications:', error);
        return;
      }

      setNotifications([]);
      setUnreadCount(0);
      
      toast({
        title: "通知已清空",
        description: "所有通知已被清空"
      });
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    if (!currentUser) return '';

    try {
      const { data, error } = await (supabase as any)
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
