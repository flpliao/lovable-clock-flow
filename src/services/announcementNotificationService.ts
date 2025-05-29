
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
      let staffQuery = supabase
        .from('staff')
        .select('id, name')
        .neq('role', 'admin'); // 排除管理員

      // 如果有當前用戶ID，排除創建者
      if (currentUserId) {
        staffQuery = staffQuery.neq('id', currentUserId);
      }

      const { data: staffData, error: staffError } = await staffQuery;

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

      console.log(`找到 ${staffData.length} 位員工需要通知:`, staffData.map(s => `${s.name}(${s.id})`));

      // 使用 create_notification 函數批量創建通知
      console.log('開始批量創建通知...');
      const notificationPromises = staffData.map(async (staff) => {
        try {
          console.log(`為用戶 ${staff.name} (${staff.id}) 創建通知...`);
          
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
          return { userId: staff.id, notificationId, userName: staff.name };
        } catch (error) {
          console.error(`為用戶 ${staff.name} 創建通知異常:`, error);
          return null;
        }
      });

      const results = await Promise.all(notificationPromises);
      const successResults = results.filter(result => result !== null);
      const successCount = successResults.length;

      console.log(`通知創建完成，成功創建 ${successCount}/${staffData.length} 條通知`);
      console.log('成功的通知:', successResults);
      
      // Show success message
      toast({
        title: "通知已發送",
        description: `已為 ${successCount} 位用戶創建公告通知`,
      });

      // 強制觸發實時更新事件 - 立即觸發多次確保所有組件收到
      console.log('觸發實時更新事件...');
      
      const triggerUpdateEvents = () => {
        // 為每個成功創建通知的用戶觸發個別更新事件
        successResults.forEach(result => {
          if (result) {
            console.log(`觸發用戶 ${result.userName} 的通知更新事件`);
            window.dispatchEvent(new CustomEvent('userNotificationUpdated', { 
              detail: { 
                userId: result.userId,
                notificationId: result.notificationId,
                type: 'announcement_created',
                announcementId: announcementId,
                timestamp: new Date().toISOString()
              }
            }));
            
            // 針對特定用戶觸發強制刷新
            window.dispatchEvent(new CustomEvent(`forceNotificationRefresh-${result.userId}`, {
              detail: { 
                reason: 'announcement_created',
                announcementId,
                timestamp: new Date().toISOString()
              }
            }));
          }
        });

        // 觸發全域通知更新事件
        window.dispatchEvent(new CustomEvent('notificationUpdated', { 
          detail: { 
            type: 'announcement_created',
            announcementId: announcementId,
            timestamp: new Date().toISOString(),
            count: successCount,
            affectedUsers: successResults.map(r => ({ id: r?.userId, name: r?.userName }))
          }
        }));
        
        // 強制刷新通知
        window.dispatchEvent(new CustomEvent('forceNotificationRefresh', {
          detail: { 
            reason: 'announcement_created', 
            announcementId,
            timestamp: new Date().toISOString(),
            userCount: successCount
          }
        }));
        
        console.log('實時更新事件已觸發');
      };

      // 立即觸發
      triggerUpdateEvents();
      
      // 延遲觸發確保資料庫操作完成
      setTimeout(triggerUpdateEvents, 500);
      
      // 再延遲觸發確保所有組件都能收到
      setTimeout(triggerUpdateEvents, 1500);

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
