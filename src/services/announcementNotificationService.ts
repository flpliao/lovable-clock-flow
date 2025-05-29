
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
      console.log('Creating notifications for announcement:', announcementId, 'with title:', announcementTitle);
      
      // Get all active staff (excluding the current user who created the announcement)
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, name')
        .neq('id', currentUserId || ''); // Exclude the current user

      if (staffError) {
        console.error('Error fetching staff for notifications:', staffError);
        throw staffError;
      }

      if (!staffData || staffData.length === 0) {
        console.log('No staff found for notifications');
        return;
      }

      console.log(`Found ${staffData.length} staff members for notifications:`, staffData);

      // 使用批量創建通知的新方法
      const notificationTemplate = {
        title: '新公告發布',
        message: `新公告已發布: ${announcementTitle}`,
        type: 'announcement' as const,
        data: {
          announcementId: announcementId,
          actionRequired: false
        }
      };

      const userIds = staffData.map(staff => staff.id);
      const success = await NotificationDatabaseService.createBulkNotifications(userIds, notificationTemplate);

      if (success) {
        console.log(`Successfully created notifications for ${userIds.length} users`);
        
        // Show success message
        toast({
          title: "通知已發送",
          description: `已為 ${userIds.length} 位用戶創建通知`,
        });
      } else {
        throw new Error('Failed to create bulk notifications');
      }
    } catch (error) {
      console.error('Error in createAnnouncementNotifications:', error);
      toast({
        title: "通知發送失敗",
        description: "無法為用戶創建通知",
        variant: "destructive"
      });
      throw error;
    }
  }
}
