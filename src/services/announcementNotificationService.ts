
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { NotificationBulkOperations, NotificationDatabaseTesting } from '@/services/notifications';
import { UserIdValidationService } from '@/services/userIdValidationService';

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
      console.log('當前用戶ID (原始):', currentUserId);

      // 使用統一的驗證服務
      const validCurrentUserId = currentUserId ? UserIdValidationService.validateUserId(currentUserId) : null;
      console.log('當前用戶ID (驗證後):', validCurrentUserId);

      // Get all active staff (excluding the current user who created the announcement)
      console.log('正在獲取員工列表...');
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, name')
        .neq('id', validCurrentUserId || ''); // Exclude the current user

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

      // 使用統一的驗證服務驗證所有用戶ID
      const userIds = staffData.map(staff => UserIdValidationService.validateUserId(staff.id));
      console.log('目標用戶ID列表 (驗證後):', userIds);

      // 使用批量創建通知功能
      const success = await NotificationBulkOperations.createBulkNotifications(userIds, notificationTemplate);

      if (success) {
        console.log(`通知創建流程完成，成功為 ${userIds.length} 位用戶創建通知`);
        
        // Show success message
        toast({
          title: "通知已發送",
          description: `已為 ${userIds.length} 位用戶創建公告通知`,
        });

        // 延遲觸發實時更新事件，確保資料庫操作完成
        setTimeout(() => {
          console.log('觸發實時更新事件...');
          window.dispatchEvent(new CustomEvent('notificationUpdated', { 
            detail: { 
              type: 'announcement_created',
              announcementId: announcementId,
              userIds: userIds,
              timestamp: new Date().toISOString()
            }
          }));
          
          // 也觸發強制刷新
          window.dispatchEvent(new CustomEvent('forceNotificationRefresh'));
        }, 1500);

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
   * 測試通知創建功能
   */
  static async testNotificationCreation(userId: string): Promise<boolean> {
    try {
      console.log('=== 測試通知創建功能 ===');
      console.log('測試用戶ID (原始):', userId);
      
      // 使用統一的驗證服務
      const validUserId = UserIdValidationService.validateUserId(userId);
      console.log('測試用戶ID (驗證後):', validUserId);
      
      // 先測試資料庫連接
      const connectionTest = await NotificationDatabaseTesting.testDatabaseConnection(validUserId);
      
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
      
      toast({
        title: "測試成功",
        description: "通知系統運作正常",
      });
      
      // 觸發實時更新
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('notificationUpdated', { 
          detail: { 
            type: 'test_notification',
            timestamp: new Date().toISOString()
          }
        }));
        
        window.dispatchEvent(new CustomEvent('forceNotificationRefresh'));
      }, 1000);
      
      console.log('=== 測試通知創建完成 ===');
      return true;
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
