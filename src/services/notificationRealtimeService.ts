import { supabase } from '@/integrations/supabase/client';

export class NotificationRealtimeService {
  /**
   * Set up real-time subscription for notifications - 優化版本
   */
  static setupRealtimeSubscription(userId: string, onNotificationChange: () => void): () => void {
    // 共用的處理函數
    const handleNotificationChange = (type: string, payload: unknown) => {
      onNotificationChange();

      window.dispatchEvent(
        new CustomEvent('userNotificationUpdated', {
          detail: {
            userId,
            type,
            payload,
            timestamp: new Date().toISOString(),
          },
        })
      );
    };

    const channel = supabase
      .channel(`notifications-realtime-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        payload => handleNotificationChange('INSERT', payload)
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        payload => handleNotificationChange('UPDATE', payload)
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        payload => handleNotificationChange('DELETE', payload)
      )
      .subscribe();

    // Return cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }

  /**
   * 測試實時連接
   */
  static testRealtimeConnection(): void {
    const testChannel = supabase.channel('test-connection').subscribe(status => {
      if (status === 'SUBSCRIBED') {
        supabase.removeChannel(testChannel);
      }
    });
  }

  /**
   * 強制觸發通知更新事件
   */
  static triggerNotificationUpdate(userId: string, announcementId?: string): void {
    const eventDetail = {
      userId,
      type: 'forced_update',
      announcementId,
      timestamp: new Date().toISOString(),
    };

    // 觸發主要的通知更新事件
    window.dispatchEvent(
      new CustomEvent('userNotificationUpdated', {
        detail: eventDetail,
      })
    );

    // 觸發強制刷新事件
    window.dispatchEvent(
      new CustomEvent('forceNotificationRefresh', {
        detail: { userId, reason: 'manual_trigger' },
      })
    );
  }
}
