
import { supabase } from '@/integrations/supabase/client';

export class NotificationRealtimeService {
  /**
   * Set up real-time subscription for notifications - 改進版本
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
          console.log('Real-time INSERT notification received:', payload);
          // 延遲一點調用以確保資料庫操作完成
          setTimeout(() => {
            onNotificationChange();
          }, 100);
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
          console.log('Real-time UPDATE notification received:', payload);
          setTimeout(() => {
            onNotificationChange();
          }, 100);
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
          console.log('Real-time DELETE notification received:', payload);
          setTimeout(() => {
            onNotificationChange();
          }, 100);
        }
      )
      .subscribe((status) => {
        console.log('Notification subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to notifications for user:', userId);
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to notifications channel');
        }
      });

    // Return cleanup function
    return () => {
      console.log('Cleaning up notification subscription for user:', userId);
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
}
