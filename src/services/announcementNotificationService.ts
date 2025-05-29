
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

      // 首先檢查公告是否為啟用狀態
      console.log('檢查公告狀態...');
      const { data: announcementData, error: announcementError } = await supabase
        .from('announcements')
        .select('is_active, title')
        .eq('id', announcementId)
        .single();

      if (announcementError) {
        console.error('無法獲取公告資料:', announcementError);
        throw announcementError;
      }

      console.log('公告資料:', announcementData);

      if (!announcementData || !announcementData.is_active) {
        console.log('公告未啟用，跳過通知發送');
        toast({
          title: "提醒",
          description: "公告未啟用，不會發送通知",
        });
        return;
      }

      // Get all active staff (including all roles - admin and user)
      console.log('正在獲取所有員工列表（包含管理者）...');
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, name, role')
        .not('id', 'is', null); // 確保ID不為null

      if (staffError) {
        console.error('Error fetching staff for notifications:', staffError);
        throw staffError;
      }

      console.log('Staff query result:', staffData);

      if (!staffData || staffData.length === 0) {
        console.log('沒有找到需要通知的員工');
        toast({
          title: "提醒",
          description: "沒有找到需要通知的員工",
        });
        return;
      }

      console.log(`找到 ${staffData.length} 位員工需要通知:`, staffData.map(s => `${s.name}(${s.id}) - ${s.role}`));

      // 驗證每個員工ID是否有效
      console.log('驗證員工ID有效性...');
      const validStaff = staffData.filter(staff => {
        const isValid = staff.id && staff.id.trim() !== '';
        if (!isValid) {
          console.warn(`員工 ${staff.name} 的ID無效:`, staff.id);
        }
        return isValid;
      });

      console.log(`有效員工數量: ${validStaff.length}/${staffData.length}`);

      if (validStaff.length === 0) {
        console.log('沒有有效的員工ID');
        toast({
          title: "錯誤",
          description: "沒有有效的員工ID，無法發送通知",
          variant: "destructive"
        });
        return;
      }

      // 為所有有效員工創建通知
      console.log('開始批量創建通知（包含管理者）...');
      const notificationPromises = validStaff.map(async (staff) => {
        try {
          console.log(`為用戶 ${staff.name} (${staff.id}) - ${staff.role} 創建通知...`);
          
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
            
            // 如果 RPC 失敗，嘗試直接插入
            console.log(`嘗試直接插入通知給用戶 ${staff.name}...`);
            const { data: directInsert, error: insertError } = await supabase
              .from('notifications')
              .insert({
                user_id: staff.id,
                title: '新公告發布',
                message: `新公告已發布: ${announcementTitle}`,
                type: 'announcement',
                announcement_id: announcementId,
                action_required: false,
                is_read: false
              })
              .select('id')
              .single();

            if (insertError) {
              console.error(`直接插入通知也失敗:`, insertError);
              return null;
            }

            console.log(`直接插入通知成功，ID: ${directInsert.id}`);
            return { userId: staff.id, notificationId: directInsert.id, userName: staff.name, userRole: staff.role };
          }

          console.log(`為用戶 ${staff.name} (${staff.role}) 創建通知成功，ID: ${notificationId}`);
          return { userId: staff.id, notificationId, userName: staff.name, userRole: staff.role };
        } catch (error) {
          console.error(`為用戶 ${staff.name} 創建通知異常:`, error);
          return null;
        }
      });

      const results = await Promise.all(notificationPromises);
      const successResults = results.filter(result => result !== null);
      const successCount = successResults.length;

      console.log(`通知創建完成，成功創建 ${successCount}/${validStaff.length} 條通知`);
      console.log('成功的通知:', successResults);
      
      // Show success message
      toast({
        title: "通知已發送",
        description: `已為 ${successCount} 位用戶創建公告通知（包含管理者）`,
      });

      // 立即觸發實時更新事件
      console.log('觸發實時更新事件...');
      
      const triggerUpdateEvents = () => {
        // 為每個成功創建通知的用戶觸發個別更新事件
        successResults.forEach(result => {
          if (result) {
            console.log(`觸發用戶 ${result.userName} (${result.userRole}) 的通知更新事件`);
            
            // 用戶專屬通知事件
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
            affectedUsers: successResults.map(r => ({ id: r?.userId, name: r?.userName, role: r?.userRole }))
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
