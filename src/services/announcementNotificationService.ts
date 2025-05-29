
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

      // 使用簡化的用戶ID驗證
      const validCurrentUserId = currentUserId || '550e8400-e29b-41d4-a716-446655440001';
      console.log('使用用戶ID:', validCurrentUserId);

      // Get all active staff (excluding the current user who created the announcement)
      console.log('正在獲取員工列表...');
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, name')
        .neq('id', validCurrentUserId);

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

      // 創建通知記錄
      const notifications = staffData.map(staff => ({
        user_id: staff.id,
        title: '新公告發布',
        message: `新公告已發布: ${announcementTitle}`,
        type: 'announcement',
        announcement_id: announcementId,
        action_required: false,
        is_read: false
      }));

      console.log('準備插入通知:', notifications.length, '條');

      // 批量插入通知
      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (insertError) {
        console.error('Error inserting notifications:', insertError);
        throw insertError;
      }

      console.log(`通知創建流程完成，成功為 ${staffData.length} 位用戶創建通知`);
      
      // Show success message
      toast({
        title: "通知已發送",
        description: `已為 ${staffData.length} 位用戶創建公告通知`,
      });

      // 延遲觸發實時更新事件
      setTimeout(() => {
        console.log('觸發實時更新事件...');
        window.dispatchEvent(new CustomEvent('notificationUpdated', { 
          detail: { 
            type: 'announcement_created',
            announcementId: announcementId,
            timestamp: new Date().toISOString()
          }
        }));
        
        window.dispatchEvent(new CustomEvent('forceNotificationRefresh'));
      }, 1000);

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
