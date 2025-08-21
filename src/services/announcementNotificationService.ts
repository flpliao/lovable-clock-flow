import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Notification } from '@/components/notifications/NotificationItem';

// Define User interface for this service
interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
}

// 定義關聯查詢返回的資料結構
interface AnnouncementWithReads {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  created_by_name: string;
  is_pinned: boolean;
  announcement_reads: Array<{
    user_id: string;
    read_at: string;
  }> | null;
}

export class AnnouncementNotificationService {
  /**
   * 獲取用戶的未讀公告作為通知
   * 查詢 announcements 表，左連接 announcement_reads 表，找出用戶未讀的公告
   */
  static async getUnreadAnnouncementsAsNotifications(userId: string): Promise<Notification[]> {
    try {
      console.log('獲取未讀公告作為通知 for user:', userId);

      // 使用更簡單的方法：先獲取所有活躍公告，再過濾未讀的
      const { data: allAnnouncements, error: announcementError } = await supabase
        .from('announcements')
        .select('id, title, content, category, created_at, created_by_name, is_pinned')
        .eq('is_active', true)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50);

      if (announcementError) {
        console.error('獲取公告失敗:', announcementError);
        return [];
      }

      if (!allAnnouncements || allAnnouncements.length === 0) {
        return [];
      }

      // 獲取用戶的已讀記錄
      const { data: readRecords, error: readError } = await supabase
        .from('announcement_reads')
        .select('announcement_id')
        .eq('user_id', userId);

      if (readError) {
        console.error('獲取已讀記錄失敗:', readError);
        return [];
      }

      const readAnnouncementIds = new Set(readRecords?.map(r => r.announcement_id) || []);

      // 過濾出未讀的公告
      const unreadAnnouncements = allAnnouncements.filter(announcement => 
        !readAnnouncementIds.has(announcement.id)
      );

      // 轉換為通知格式
      const notifications: Notification[] = unreadAnnouncements.map((announcement) => ({
        id: announcement.id,
        title: announcement.title,
        message: announcement.content.length > 100 
          ? announcement.content.substring(0, 100) + '...' 
          : announcement.content,
        type: 'announcement' as const,
        createdAt: announcement.created_at,
        isRead: false, // 這些都是未讀的公告
        data: {
          announcementId: announcement.id,
          actionRequired: false
        }
      }));

      console.log(`成功獲取 ${notifications.length} 筆未讀公告通知`);
      return notifications;
    } catch (error) {
      console.error('獲取未讀公告通知失敗:', error);
      return [];
    }
  }

  /**
   * 獲取用戶的所有公告通知（包括已讀和未讀）
   * 使用關聯查詢一次性獲取公告和已讀狀態 - 優化版本
   */
  static async getAllAnnouncementsAsNotificationsOptimized(userId: string): Promise<Notification[]> {
    try {
      console.log('獲取所有公告作為通知（優化版本）for user:', userId);
      
      // 使用關聯查詢，但在 SELECT 中過濾特定用戶的已讀記錄
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          id,
          title,
          content,
          category,
          created_at,
          created_by_name,
          is_pinned,
          announcement_reads!left (
            user_id,
            read_at
          )
        `)
        .eq('is_active', true)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('獲取公告通知失敗:', error);
        return [];
      }

      if (!data || data.length === 0) {
        return [];
          }
          
      // 轉換為通知格式
      const notifications: Notification[] = data.map((announcement: AnnouncementWithReads) => {
        // 檢查是否有該用戶的已讀記錄
        // 過濾出該用戶的已讀記錄
        const userReadRecord = announcement.announcement_reads?.find(read => read.user_id === userId);
        const hasReadRecord = !!userReadRecord;

        return {
          id: announcement.id,
          title: announcement.title,
          message: announcement.content.length > 100 
            ? announcement.content.substring(0, 100) + '...' 
            : announcement.content,
          type: 'announcement' as const,
          createdAt: announcement.created_at,
          isRead: hasReadRecord,
          data: {
            announcementId: announcement.id,
            actionRequired: false
          }
        };
      });

      console.log(`成功獲取 ${notifications.length} 筆公告通知（優化版本）`);
      return notifications;
        } catch (error) {
      console.error('獲取公告通知失敗（優化版本）:', error);
      return [];
        }
  }

  /**
   * 標記公告為已讀（使用現有的 announcement_reads 表）
   */
  static async markAnnouncementAsRead(announcementId: string, userId: string): Promise<boolean> {
    try {
      console.log('標記公告通知為已讀:', { announcementId, userId });
      
      // 使用現有的 RPC 函數
      const { error } = await supabase.rpc('mark_announcement_as_read', {
        user_uuid: userId,
        announcement_uuid: announcementId
      });

      if (error) {
        console.error('標記公告通知已讀失敗:', error);
        return false;
      }

      console.log('公告通知已成功標記為已讀');
      return true;
    } catch (error) {
      console.error('標記公告通知已讀失敗:', error);
      return false;
    }
      }
      
  /**
   * 標記所有公告為已讀
   */
  static async markAllAnnouncementsAsRead(userId: string): Promise<boolean> {
    try {
      console.log('標記所有公告通知為已讀 for user:', userId);
      
      // 獲取所有未讀的公告ID
      const { data: allAnnouncements, error: fetchError } = await supabase
        .from('announcements')
        .select('id')
        .eq('is_active', true);

      if (fetchError) {
        console.error('獲取公告失敗:', fetchError);
        return false;
      }

      if (!allAnnouncements || allAnnouncements.length === 0) {
        return true;
      }

      // 獲取用戶的已讀記錄
      const { data: readRecords, error: readError } = await supabase
        .from('announcement_reads')
        .select('announcement_id')
        .eq('user_id', userId);

      if (readError) {
        console.error('獲取已讀記錄失敗:', readError);
        return false;
      }

      const readAnnouncementIds = new Set(readRecords?.map(r => r.announcement_id) || []);

      // 找出未讀的公告
      const unreadAnnouncementIds = allAnnouncements
        .filter(announcement => !readAnnouncementIds.has(announcement.id))
        .map(announcement => announcement.id);

      if (unreadAnnouncementIds.length === 0) {
        console.log('沒有未讀公告需要標記');
        return true;
      }

      // 為每個未讀公告創建已讀記錄
      const readRecordsToInsert = unreadAnnouncementIds.map(announcementId => ({
        user_id: userId,
        announcement_id: announcementId,
        read_at: new Date().toISOString()
      }));

      const { error: insertError } = await supabase
        .from('announcement_reads')
        .insert(readRecordsToInsert);

      if (insertError) {
        console.error('批量標記已讀失敗:', insertError);
        return false;
      }

      console.log('所有公告通知已成功標記為已讀');
      return true;
    } catch (error) {
      console.error('標記所有公告通知已讀失敗:', error);
      return false;
    }
  }

  /**
   * 清空所有通知（實際上是標記所有公告為已讀）
   */
  static async clearAllNotifications(userId: string): Promise<boolean> {
    // 對於基於公告的通知系統，"清空"等同於"標記所有為已讀"
    return this.markAllAnnouncementsAsRead(userId);
  }
}

/**
 * 獲取所有需要接收通知的用戶
 */
const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('id, name, role_id, email, department, position')
      .not('email', 'is', null);

    if (error) {
      console.error('❌ 獲取用戶列表失敗:', error);
      return [];
    }

    return (data || []).map(staff => ({
      id: staff.id,
      name: staff.name || 'Unknown',
      role: staff.role_id || 'user', // Use role_id instead of role
      email: staff.email || '',
      department: staff.department || 'Unknown',
      position: staff.position || 'Unknown'
    }));
  } catch (error) {
    console.error('❌ 獲取用戶列表時發生錯誤:', error);
    return [];
  }
};
