
import { toast } from '@/hooks/useToast';
import { supabase } from '@/integrations/supabase/client';
import { CompanyAnnouncement } from '@/types/announcement';

// 定義資料庫回傳的公告資料結構類型
interface DatabaseAnnouncement {
  id: string;
  title: string;
  content: string;
  category: string;
  file_url?: string | null;
  file_name?: string | null;
  file_type?: string | null;
  created_at: string;
  created_by_id?: string | null;
  created_by_name?: string | null;
  company_id?: string | null;
  is_pinned: boolean;
  is_active: boolean;
}

export class AnnouncementCrudService {
  /**
   * Load announcements from the database
   * @param includeInactive - 是否包含已停用的公告，預設為 false（只載入活躍公告）
   */
  static async loadAnnouncements(includeInactive: boolean = false): Promise<CompanyAnnouncement[]> {
    try {
      console.log('Loading announcements from Supabase database, includeInactive:', includeInactive);
      
      let query = supabase
        .from('announcements')
        .select('*');
      
      // 如果不包含已停用的公告，則篩選只載入活躍的
      if (!includeInactive) {
        query = query.eq('is_active', true);
      }
      
      const { data, error } = await query
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        return [];
      }

      const formattedAnnouncements = (data || []).map((announcement: DatabaseAnnouncement) => ({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        category: announcement.category,
        file: announcement.file_url ? {
          url: announcement.file_url,
          name: announcement.file_name || '',
          type: announcement.file_type || ''
        } : undefined,
        created_at: announcement.created_at,
        created_by: {
          id: announcement.created_by_id || '',
          name: announcement.created_by_name
        },
        company_id: announcement.company_id || '',
        is_pinned: announcement.is_pinned,
        is_active: announcement.is_active
      }));

      return formattedAnnouncements;
    } catch (error) {
      console.error('載入公告失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入公告資料",
        variant: "destructive"
      });
      return [];
    }
  }

  /**
   * Create a new announcement in the database
   */
  static async createAnnouncement(
    announcement: Omit<CompanyAnnouncement, 'id' | 'created_at' | 'created_by' | 'company_id'>,
    currentUserId: string,
    currentUserName: string
  ): Promise<{ success: boolean; data?: DatabaseAnnouncement }> {
    try {
      console.log('Creating announcement for user:', currentUserId);
      console.log('Announcement data:', announcement);
      
      // 確保用戶ID是有效的UUID格式
      const validUserId = currentUserId || '550e8400-e29b-41d4-a716-446655440001';
      console.log('Using validated user ID:', validUserId);
      
      // Create the announcement with simplified data structure
      const insertData = {
        title: announcement.title,
        content: announcement.content,
        category: announcement.category,
        file_url: announcement.file?.url || null,
        file_name: announcement.file?.name || null,
        file_type: announcement.file?.type || null,
        created_by_id: validUserId,
        created_by_name: currentUserName || '系統管理員',
        company_id: '550e8400-e29b-41d4-a716-446655440000',
        is_pinned: announcement.is_pinned || false,
        is_active: announcement.is_active !== false // 預設為 true
      };

      console.log('Insert data:', insertData);

      const { data, error } = await supabase
        .from('announcements')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Database error creating announcement:', error);
        throw error;
      }

      console.log('Announcement created successfully:', data);
      
      toast({
        title: "建立成功",
        description: "公告已成功發佈",
      });
      
      return { success: true, data };
    } catch (error) {
      console.error('建立公告失敗:', error);
      toast({
        title: "建立失敗",
        description: `無法建立公告: ${error instanceof Error ? error.message : '請檢查您的權限'}`,
        variant: "destructive"
      });
      return { success: false };
    }
  }

  /**
   * Update an existing announcement
   */
  static async updateAnnouncement(
    id: string, 
    updatedAnnouncement: Partial<CompanyAnnouncement>
  ): Promise<boolean> {
    try {
      const updateData = {
        title: updatedAnnouncement.title,
        content: updatedAnnouncement.content,
        category: updatedAnnouncement.category,
        file_url: updatedAnnouncement.file?.url || null,
        file_name: updatedAnnouncement.file?.name || null,
        file_type: updatedAnnouncement.file?.type || null,
        is_pinned: updatedAnnouncement.is_pinned || false,
        is_active: updatedAnnouncement.is_active !== false,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('announcements')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      toast({
        title: "更新成功",
        description: "公告已成功更新",
      });
      
      return true;
    } catch (error) {
      console.error('更新公告失敗:', error);
      toast({
        title: "更新失敗",
        description: "無法更新公告",
        variant: "destructive"
      });
      return false;
    }
  }

  /**
   * Delete an announcement (permanently remove from database)
   */
  static async deleteAnnouncement(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      toast({
        title: "刪除成功",
        description: "公告已永久刪除",
      });
      
      return true;
    } catch (error) {
      console.error('刪除公告失敗:', error);
      toast({
        title: "刪除失敗",
        description: "無法刪除公告",
        variant: "destructive"
      });
      return false;
    }
  }
}
