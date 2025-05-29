
import { supabase } from '@/integrations/supabase/client';

export class AnnouncementReadService {
  /**
   * Mark an announcement as read for the current user
   */
  static async markAnnouncementAsRead(announcementId: string, userId: string): Promise<void> {
    try {
      console.log('Marking announcement as read:', announcementId, 'for user:', userId);
      
      const { error } = await supabase.rpc('mark_announcement_as_read', {
        user_uuid: userId,
        announcement_uuid: announcementId
      });

      if (error) {
        console.error('標記已讀失敗:', error);
      }
    } catch (error) {
      console.error('標記已讀失敗:', error);
    }
  }

  /**
   * Check if an announcement has been read by the current user
   */
  static async checkAnnouncementRead(announcementId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('announcement_reads')
        .select('id')
        .eq('user_id', userId)
        .eq('announcement_id', announcementId)
        .maybeSingle();

      if (error) {
        console.error('檢查已讀狀態失敗:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('檢查已讀狀態失敗:', error);
      return false;
    }
  }
}
