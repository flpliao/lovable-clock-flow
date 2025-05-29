
import { supabase } from '@/integrations/supabase/client';

export class NotificationRealtimeService {
  /**
   * Set up real-time subscription for notifications
   */
  static setupRealtimeSubscription(
    userId: string,
    onNotificationChange: () => void
  ): () => void {
    console.log('Setting up real-time subscription for notifications, user:', userId);
    
    const channel = supabase
      .channel('notifications-realtime')
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
          onNotificationChange();
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
          onNotificationChange();
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
          onNotificationChange();
        }
      )
      .subscribe((status) => {
        console.log('Notification subscription status:', status);
      });

    // Return cleanup function
    return () => {
      console.log('Cleaning up notification subscription');
      supabase.removeChannel(channel);
    };
  }
}
