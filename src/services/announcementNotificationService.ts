
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export class AnnouncementNotificationService {
  /**
   * Creates notifications for all users when a new announcement is published
   */
  static async createAnnouncementNotifications(
    announcementId: string, 
    announcementTitle: string, 
    currentUserId?: string
  ): Promise<void> {
    try {
      console.log('=== 開始創建公告通知 ===');
      console.log('公告ID:', announcementId);
      console.log('公告標題:', announcementTitle);
      console.log('當前用戶ID:', currentUserId);

      // Get all active staff (excluding the current user who created the announcement)
      console.log('正在獲取員工列表...');
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, name')
        .neq('id', currentUserId || '');

      if (staffError) {
        console.error('Error fetching staff for notifications:', staffError);
        throw staffError;
      }

      if (!staffData || staffData.length === 0) {
        console.log('沒有找到需要通知的員工');
        toast({
          title: "提醒",
          description: "沒有找到需要通知的員工",
        });
        return;
      }

      console.log(`找到 ${staffData.length} 位員工需要通知`);

      // 使用 create_notification 函數批量創建通知
      console.log('開始批量創建通知...');
      const notificationPromises = staffData.map(async (staff) => {
        try {
          const { data: notificationId, error } = await supabase.rpc('create_notification', {
            p_user_id: staff.id,
            p_title: '新公告發布',
            p_message: `新公告已發布: ${announcementTitle}`,
            p_type: 'announcement',
            p_announcement_id: announcementId,
            p_leave_request_id: null,
            p_action_required: false
          });

          if (error) {
            console.error(`為用戶 ${staff.name} 創建通知失敗:`, error);
            return null;
          }

          console.log(`為用戶 ${staff.name} 創建通知成功，ID: ${notificationId}`);
          return notificationId;
        } catch (error) {
          console.error(`為用戶 ${staff.name} 創建通知異常:`, error);
          return null;
        }
      });

      const results = await Promise.all(notificationPromises);
      const successCount = results.filter(id => id !== null).length;

      console.log(`通知創建完成，成功創建 ${successCount}/${staffData.length} 條通知`);
      
      // Show success message
      toast({
        title: "通知已發送",
        description: `已為 ${successCount} 位用戶創建公告通知`,
      });

      // 強制觸發全域通知更新事件 - 改善實時性
      console.log('觸發實時更新事件...');
      
      // 立即觸發多個更新事件確保所有組件都能收到
      const triggerEvents = () => {
        // 觸發通知更新事件
        window.dispatchEvent(new CustomEvent('notificationUpdated', { 
          detail: { 
            type: 'announcement_created',
            announcementId: announcementId,
            timestamp: new Date().toISOString(),
            count: successCount,
            staffList: staffData.map(s => s.id)
          }
        }));
        
        // 強制刷新通知
        window.dispatchEvent(new CustomEvent('forceNotificationRefresh', {
          detail: { reason: 'announcement_created', announcementId }
        }));
        
        // 觸發公告更新事件
        window.dispatchEvent(new CustomEvent('refreshAnnouncements'));
        
        console.log('實時更新事件已觸發');
      };

      // 立即觸發一次
      triggerEvents();
      
      // 延遲再觸發一次，確保資料庫操作完成
      setTimeout(triggerEvents, 500);
      
      // 再延遲觸發一次，確保所有組件都能收到
      setTimeout(triggerEvents, 1500);

      console.log('=== 公告通知創建完成 ===');
    } catch (error) {
      console.error('Error in createAnnouncementNotifications:', error);
      toast({
        title: "通知發送失敗",
        description: `無法為用戶創建通知: ${error instanceof Error ? error.message : '未知錯誤'}`,
        variant: "destructive"
      });
      throw error;
    }
  }
}
