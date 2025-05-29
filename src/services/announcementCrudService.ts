
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CompanyAnnouncement } from '@/types/announcement';

export class AnnouncementCrudService {
  /**
   * Load all active announcements from the database
   */
  static async loadAnnouncements(): Promise<CompanyAnnouncement[]> {
    try {
      console.log('Loading announcements from Supabase database');
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        return [];
      }

      const formattedAnnouncements = (data || []).map((announcement: any) => ({
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
  ): Promise<{ success: boolean; data?: any }> {
    try {
      console.log('Creating announcement for user:', currentUserId);
      console.log('Announcement data:', announcement);
      
      // Create the announcement
      const { data, error } = await supabase
        .from('announcements')
        .insert({
          title: announcement.title,
          content: announcement.content,
          category: announcement.category,
          file_url: announcement.file?.url,
          file_name: announcement.file?.name,
          file_type: announcement.file?.type,
          created_by_id: currentUserId,
          created_by_name: currentUserName,
          company_id: '550e8400-e29b-41d4-a716-446655440000',
          is_pinned: announcement.is_pinned,
          is_active: announcement.is_active
        })
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
        description: "無法建立公告，請檢查您的權限",
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
      const { error } = await supabase
        .from('announcements')
        .update({
          title: updatedAnnouncement.title,
          content: updatedAnnouncement.content,
          category: updatedAnnouncement.category,
          file_url: updatedAnnouncement.file?.url,
          file_name: updatedAnnouncement.file?.name,
          file_type: updatedAnnouncement.file?.type,
          is_pinned: updatedAnnouncement.is_pinned,
          is_active: updatedAnnouncement.is_active
        })
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
   * Delete an announcement (soft delete)
   */
  static async deleteAnnouncement(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      toast({
        title: "刪除成功",
        description: "公告已成功刪除",
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
