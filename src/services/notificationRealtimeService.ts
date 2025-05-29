
import { supabase } from '@/integrations/supabase/client';

export class NotificationRealtimeService {
  /**
   * Set up real-time subscription for notifications - 優化版本
   */
  static setupRealtimeSubscription(
    userId: string,
    onNotificationChange: () => void
  ): () => void {
    console.log('Setting up real-time subscription for notifications, user:', userId);
    
    const channel = supabase
      .channel(`notifications-realtime-${userId}`) // 為每個用戶創建唯一的 channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log(`Real-time INSERT notification received for user ${userId}:`, payload);
          // 立即調用以提高響應性
          setTimeout(() => {
            onNotificationChange();
          }, 200);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log(`Real-time UPDATE notification received for user ${userId}:`, payload);
          setTimeout(() => {
            onNotificationChange();
          }, 200);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log(`Real-time DELETE notification received for user ${userId}:`, payload);
          setTimeout(() => {
            onNotificationChange();
          }, 200);
        }
      )
      .subscribe((status) => {
        console.log(`Notification subscription status for user ${userId}:`, status);
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to notifications for user: ${userId}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Error subscribing to notifications channel for user: ${userId}`);
        }
      });

    // Return cleanup function
    return () => {
      console.log(`Cleaning up notification subscription for user: ${userId}`);
      supabase.removeChannel(channel);
    };
  }

  /**
   * 測試實時連接
   */
  static testRealtimeConnection(): void {
    console.log('Testing realtime connection...');
    
    const testChannel = supabase
      .channel('test-connection')
      .subscribe((status) => {
        console.log('Test connection status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Realtime connection is working');
          supabase.removeChannel(testChannel);
        }
      });
  }

  /**
   * 強制觸發通知更新事件
   */
  static triggerNotificationUpdate(userId: string, announcementId?: string): void {
    console.log(`Triggering notification update for user: ${userId}`);
    
    window.dispatchEvent(new CustomEvent('notificationUpdated', { 
      detail: { 
        type: 'forced_update',
        userId: userId,
        announcementId: announcementId,
        timestamp: new Date().toISOString()
      }
    }));
    
    window.dispatchEvent(new CustomEvent('forceNotificationRefresh', {
      detail: { userId: userId, reason: 'manual_trigger' }
    }));
  }
}
