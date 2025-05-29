
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

      // 獲取所有員工，不過濾任何條件，確保包含所有人
      console.log('正在獲取所有員工列表...');
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, name, role, email, department, position')
        .order('name');

      if (staffError) {
        console.error('Error fetching staff for notifications:', staffError);
        throw staffError;
      }

      console.log('Staff query result:', staffData);
      console.log('所有員工詳細資訊:', staffData?.map(s => ({ 
        id: s.id, 
        name: s.name, 
        role: s.role,
        email: s.email,
        department: s.department,
        position: s.position
      })));

      if (!staffData || staffData.length === 0) {
        console.log('沒有找到任何員工');
        toast({
          title: "提醒",
          description: "沒有找到任何員工",
        });
        return;
      }

      console.log(`找到 ${staffData.length} 位員工需要通知`);

      // 特別檢查王小明是否在員工列表中
      const wangXiaoMing = staffData.find(staff => staff.name === '王小明' || staff.id === '550e8400-e29b-41d4-a716-446655440002');
      if (wangXiaoMing) {
        console.log('✅ 王小明在員工列表中:', wangXiaoMing);
      } else {
        console.log('❌ 王小明不在員工列表中');
        console.log('檢查是否有類似姓名的員工:', staffData.filter(s => s.name.includes('王') || s.name.includes('小明')));
      }

      // 為每個員工創建通知
      console.log('開始為所有員工創建通知...');
      const notificationPromises = staffData.map(async (staff) => {
        try {
          console.log(`為員工 ${staff.name} (${staff.id}) 創建通知...`);
          
          // 檢查用戶ID是否有效
          if (!staff.id || staff.id.trim() === '') {
            console.error(`員工 ${staff.name} 的ID無效:`, staff.id);
            return null;
          }
          
          // 直接插入通知表
          const { data: notification, error: insertError } = await supabase
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
            console.error(`為員工 ${staff.name} (${staff.id}) 創建通知失敗:`, insertError);
            return null;
          }

          console.log(`✅ 為員工 ${staff.name} 創建通知成功，通知ID: ${notification.id}`);
          return { 
            userId: staff.id, 
            notificationId: notification.id, 
            userName: staff.name, 
            userRole: staff.role 
          };
        } catch (error) {
          console.error(`為員工 ${staff.name} 創建通知異常:`, error);
          return null;
        }
      });

      const results = await Promise.all(notificationPromises);
      const successResults = results.filter(result => result !== null);
      const successCount = successResults.length;

      console.log(`通知創建完成，成功創建 ${successCount}/${staffData.length} 條通知`);
      console.log('成功的通知:', successResults);
      
      // 特別檢查王小明的通知是否創建成功
      const wangNotification = successResults.find(result => 
        result && (result.userName === '王小明' || result.userId === '550e8400-e29b-41d4-a716-446655440002')
      );
      if (wangNotification) {
        console.log('✅ 王小明的通知創建成功:', wangNotification);
      } else {
        console.log('❌ 王小明的通知創建失敗');
      }
      
      // Show success message
      toast({
        title: "通知已發送",
        description: `已為 ${successCount} 位用戶創建公告通知`,
      });

      // 立即觸發多重實時更新事件
      console.log('觸發實時更新事件...');
      
      const triggerUpdateEvents = () => {
        // 為每個成功創建通知的用戶觸發個別更新事件
        successResults.forEach(result => {
          if (result) {
            console.log(`觸發用戶 ${result.userName} (${result.userId}) 的通知更新事件`);
            
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
      
      // 延遲觸發確保資料庫操作完成和不同組件都能收到
      setTimeout(triggerUpdateEvents, 100);
      setTimeout(triggerUpdateEvents, 500);
      setTimeout(triggerUpdateEvents, 1000);
      setTimeout(triggerUpdateEvents, 2000);

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
