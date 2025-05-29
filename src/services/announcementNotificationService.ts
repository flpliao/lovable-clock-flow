
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

      // Create notification records for each staff member
      const notifications = staffData.map(staff => ({
        user_id: staff.id,
        title: '新公告發布',
        message: `新公告已發布: ${announcementTitle}`,
        type: 'announcement',
        announcement_id: announcementId,
        is_read: false,
        action_required: false,
        created_at: new Date().toISOString()
      }));

      console.log('Inserting notifications:', notifications);

      // Batch insert notifications to database
      const { data: insertedData, error: notificationError } = await supabase
        .from('notifications')
        .insert(notifications)
        .select();

      if (notificationError) {
        console.error('Error creating notifications:', notificationError);
        throw notificationError;
      } else {
        console.log(`Successfully created ${notifications.length} notifications for announcement`);
        console.log('Inserted notification data:', insertedData);
        
        // Show success message
        toast({
          title: "通知已發送",
          description: `已為 ${notifications.length} 位用戶創建通知`,
        });
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
