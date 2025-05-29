
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { NotificationDatabaseService } from '@/services/notificationDatabaseService';

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
        .neq('id', currentUserId || ''); // Exclude the current user

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

      console.log(`找到 ${staffData.length} 位員工需要通知:`, staffData);

      // 創建通知模板
      const notificationTemplate = {
        title: '新公告發布',
        message: `新公告已發布: ${announcementTitle}`,
        type: 'announcement' as const,
        data: {
          announcementId: announcementId,
          actionRequired: false
        }
      };

      console.log('通知模板:', notificationTemplate);

      const userIds = staffData.map(staff => staff.id);
      console.log('目標用戶ID列表:', userIds);

      // 使用改進的批量創建通知功能
      const success = await NotificationDatabaseService.createBulkNotifications(userIds, notificationTemplate);

      if (success) {
        console.log(`通知創建流程完成`);
        
        // Show success message
        toast({
          title: "通知已發送",
          description: `公告通知創建流程已完成`,
        });

        // 觸發實時更新事件
        console.log('觸發實時更新事件...');
        window.dispatchEvent(new CustomEvent('notificationUpdated', { 
          detail: { 
            type: 'announcement_created',
            announcementId: announcementId,
            userIds: userIds,
            timestamp: new Date().toISOString()
          }
        }));

        // 額外觸發通知刷新
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('forceNotificationRefresh'));
        }, 500);

      } else {
        throw new Error('Failed to create bulk notifications');
      }

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

  /**
   * 測試通知創建功能 - 改進版本
   */
  static async testNotificationCreation(userId: string): Promise<boolean> {
    try {
      console.log('=== 測試通知創建功能 ===');
      console.log('測試用戶ID:', userId);
      
      // 先測試資料庫連接
      const connectionTest = await NotificationDatabaseService.testDatabaseConnection(userId);
      
      if (!connectionTest) {
        console.error('資料庫連接測試失敗');
        toast({
          title: "測試失敗",
          description: "資料庫連接測試失敗，請檢查權限設定",
          variant: "destructive"
        });
        return false;
      }
      
      console.log('資料庫連接測試通過');
      
      // 創建實際測試通知
      const testNotification = {
        title: '測試通知',
        message: `測試通知創建功能，時間: ${new Date().toLocaleString()}`,
        type: 'system' as const,
        data: {
          actionRequired: false
        }
      };

      console.log('創建測試通知:', testNotification);
      const notificationId = await NotificationDatabaseService.addNotification(userId, testNotification);
      
      if (notificationId) {
        console.log('測試通知創建成功，ID:', notificationId);
        
        // 觸發實時更新
        window.dispatchEvent(new CustomEvent('notificationUpdated', { 
          detail: { 
            type: 'test_notification',
            notificationId: notificationId,
            timestamp: new Date().toISOString()
          }
        }));
        
        // 額外觸發通知刷新
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('forceNotificationRefresh'));
        }, 200);
        
        toast({
          title: "測試成功",
          description: "測試通知已創建",
        });
        
        console.log('=== 測試通知創建完成 ===');
        return true;
      } else {
        console.error('測試通知創建失敗 - 沒有返回通知ID');
        toast({
          title: "測試失敗",
          description: "無法創建測試通知，請檢查系統設定",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('測試通知創建時發生錯誤:', error);
      toast({
        title: "測試錯誤",
        description: `測試過程中發生錯誤: ${error instanceof Error ? error.message : '未知錯誤'}`,
        variant: "destructive"
      });
      return false;
    }
  }
}
