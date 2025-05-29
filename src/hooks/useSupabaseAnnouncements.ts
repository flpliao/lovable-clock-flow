import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { CompanyAnnouncement } from '@/types/announcement';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<CompanyAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser, isAdmin } = useUser();

  // 載入公告 - Using Supabase database
  const loadAnnouncements = async () => {
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
        setAnnouncements([]);
        return;
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

      setAnnouncements(formattedAnnouncements);
    } catch (error) {
      console.error('載入公告失敗:', error);
      toast({
        title: "載入失敗",
        description: "無法載入公告資料",
        variant: "destructive"
      });
      setAnnouncements([]);
    }
  };

  // 為所有用戶創建公告通知
  const createAnnouncementNotifications = async (announcementId: string, announcementTitle: string) => {
    try {
      console.log('Creating notifications for announcement:', announcementId);
      
      // 取得所有活躍的員工（排除目前建立公告的管理員）
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, name')
        .neq('id', currentUser?.id || ''); // 排除目前的用戶

      if (staffError) {
        console.error('Error fetching staff for notifications:', staffError);
        return;
      }

      if (!staffData || staffData.length === 0) {
        console.log('No staff found for notifications');
        return;
      }

      console.log('Found staff for notifications:', staffData);

      // 為每個員工創建通知記錄
      const notifications = staffData.map(staff => ({
        user_id: staff.id,
        title: '新公告發布',
        message: `${announcementTitle}`,
        type: 'announcement',
        announcement_id: announcementId,
        is_read: false,
        action_required: false,
        created_at: new Date().toISOString()
      }));

      console.log('Creating notifications:', notifications);

      // 批量插入通知到資料庫
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (notificationError) {
        console.error('Error creating notifications:', notificationError);
      } else {
        console.log(`Successfully created ${notifications.length} notifications for announcement`);
      }
    } catch (error) {
      console.error('Error in createAnnouncementNotifications:', error);
    }
  };

  // 建立公告 - Using Supabase database
  const createAnnouncement = async (newAnnouncement: Omit<CompanyAnnouncement, 'id' | 'created_at' | 'created_by' | 'company_id'>) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以建立公告",
        variant: "destructive"
      });
      return false;
    }

    if (!currentUser) {
      toast({
        title: "錯誤",
        description: "請先登入",
        variant: "destructive"
      });
      return false;
    }

    try {
      console.log('Creating announcement for user:', currentUser.id);
      
      // 確保使用與 staff 表格匹配的用戶 ID
      const { data, error } = await supabase
        .from('announcements')
        .insert({
          title: newAnnouncement.title,
          content: newAnnouncement.content,
          category: newAnnouncement.category,
          file_url: newAnnouncement.file?.url,
          file_name: newAnnouncement.file?.name,
          file_type: newAnnouncement.file?.type,
          created_by_id: currentUser.id, // 使用當前用戶的 ID
          created_by_name: currentUser.name,
          company_id: '550e8400-e29b-41d4-a716-446655440000', // Default company ID
          is_pinned: newAnnouncement.is_pinned,
          is_active: newAnnouncement.is_active
        })
        .select()
        .single();

      if (error) {
        console.error('Database error creating announcement:', error);
        throw error;
      }

      console.log('Announcement created successfully:', data);
      
      // 如果公告是啟用狀態，為所有用戶創建通知
      if (newAnnouncement.is_active) {
        console.log('Creating notifications for active announcement');
        await createAnnouncementNotifications(data.id, newAnnouncement.title);
      }
      
      await loadAnnouncements();
      
      toast({
        title: "建立成功",
        description: "公告已成功發佈，通知已發送給所有用戶",
      });
      
      return true;
    } catch (error) {
      console.error('建立公告失敗:', error);
      toast({
        title: "建立失敗",
        description: "無法建立公告，請檢查您的權限",
        variant: "destructive"
      });
      return false;
    }
  };

  // 更新公告 - Using Supabase database
  const updateAnnouncementData = async (id: string, updatedAnnouncement: Partial<CompanyAnnouncement>) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯公告",
        variant: "destructive"
      });
      return false;
    }

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

      await loadAnnouncements();
      
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
  };

  // 刪除公告 - Using Supabase database (soft delete)
  const deleteAnnouncementData = async (id: string) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以刪除公告",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      await loadAnnouncements();
      
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
  };

  // 標記公告為已讀
  const markAnnouncementAsRead = async (announcementId: string) => {
    if (!currentUser) return;

    try {
      console.log('Marking announcement as read:', announcementId, 'for user:', currentUser.id);
      
      const { error } = await supabase.rpc('mark_announcement_as_read', {
        user_uuid: currentUser.id,
        announcement_uuid: announcementId
      });

      if (error) {
        console.error('標記已讀失敗:', error);
      }
    } catch (error) {
      console.error('標記已讀失敗:', error);
    }
  };

  // 檢查公告是否已讀
  const checkAnnouncementRead = async (announcementId: string): Promise<boolean> => {
    if (!currentUser) return false;

    try {
      const { data, error } = await supabase
        .from('announcement_reads')
        .select('id')
        .eq('user_id', currentUser.id)
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
  };

  // 初始載入
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await loadAnnouncements();
      setLoading(false);
    };
    loadData();
  }, []);

  return {
    announcements,
    loading,
    createAnnouncement,
    updateAnnouncement: updateAnnouncementData,
    deleteAnnouncement: deleteAnnouncementData,
    markAnnouncementAsRead,
    checkAnnouncementRead,
    refreshData: loadAnnouncements
  };
};
