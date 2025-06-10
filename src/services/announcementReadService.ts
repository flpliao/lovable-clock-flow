
import { supabase } from '@/integrations/supabase/client';

export class AnnouncementReadService {
  /**
   * Mark an announcement as read for the current user
   */
  static async markAnnouncementAsRead(announcementId: string, userId: string): Promise<void> {
    try {
      console.log('呼叫資料庫函數標記公告已讀:', { announcementId, userId });
      
      const { error } = await supabase.rpc('mark_announcement_as_read', {
        user_uuid: userId,
        announcement_uuid: announcementId
      });

      if (error) {
        console.error('資料庫函數標記已讀失敗:', error);
        throw new Error(`標記已讀失敗: ${error.message}`);
      }
      
      console.log('資料庫函數執行成功');
    } catch (error) {
      console.error('標記已讀操作失敗:', error);
      throw error;
    }
  }

  /**
   * Check if an announcement has been read by the current user
   * 確保返回明確的布林值
   */
  static async checkAnnouncementRead(announcementId: string, userId: string): Promise<boolean> {
    try {
      console.log('查詢公告已讀狀態:', { announcementId, userId });
      
      const { data, error } = await supabase
        .from('announcement_reads')
        .select('id')
        .eq('user_id', userId)
        .eq('announcement_id', announcementId)
        .maybeSingle();

      if (error) {
        console.error('查詢已讀狀態失敗:', error);
        throw new Error(`查詢已讀狀態失敗: ${error.message}`);
      }

      // 明確返回布林值：如果有記錄則為已讀，否則為未讀
      const isRead = data !== null;
      console.log('已讀狀態查詢結果:', { hasRecord: !!data, isRead });
      return isRead;
    } catch (error) {
      console.error('檢查已讀狀態失敗:', error);
      throw error;
    }
  }
}
