
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { CompanyAnnouncement } from '@/types/announcement';

export const useSupabaseAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<CompanyAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentUser, isAdmin } = useUser();

  // 載入公告
  const loadAnnouncements = async () => {
    try {
      // Use raw SQL query since the table might not be in the types yet
      const { data, error } = await supabase.rpc('get_announcements');
      
      if (error) {
        // Fallback to direct query if RPC doesn't exist
        console.log('RPC failed, trying direct query:', error);
        
        // Try direct query using any type to bypass TypeScript checking
        const { data: directData, error: directError } = await (supabase as any)
          .from('announcements')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (directError) {
          console.error('Direct query also failed:', directError);
          setAnnouncements([]);
          return;
        }

        const formattedAnnouncements = directData?.map((announcement: any) => ({
          id: announcement.id,
          title: announcement.title,
          content: announcement.content,
          created_at: announcement.created_at,
          created_by: {
            id: announcement.author_id || '',
            name: announcement.author_name
          },
          company_id: '550e8400-e29b-41d4-a716-446655440000',
          is_pinned: false,
          is_active: true,
          category: announcement.type as any
        })) || [];

        setAnnouncements(formattedAnnouncements);
        return;
      }

      // Process RPC response if successful
      const formattedAnnouncements = (data || []).map((announcement: any) => ({
        id: announcement.id,
        title: announcement.title,
        content: announcement.content,
        created_at: announcement.created_at,
        created_by: {
          id: announcement.author_id || '',
          name: announcement.author_name
        },
        company_id: '550e8400-e29b-41d4-a716-446655440000',
        is_pinned: false,
        is_active: true,
        category: announcement.type as any
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

  // 建立公告
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
      // Use raw SQL insert since the table might not be in types yet
      const { error } = await supabase.rpc('create_announcement', {
        p_title: newAnnouncement.title,
        p_content: newAnnouncement.content,
        p_type: newAnnouncement.category || 'general',
        p_author_id: currentUser.id,
        p_author_name: currentUser.name
      });

      if (error) {
        console.error('RPC failed, trying direct insert:', error);
        
        // Fallback to direct insert using any type
        const { error: directError } = await (supabase as any)
          .from('announcements')
          .insert({
            title: newAnnouncement.title,
            content: newAnnouncement.content,
            type: newAnnouncement.category || 'general',
            priority: 'normal',
            target_audience: 'all',
            author_id: currentUser.id,
            author_name: currentUser.name,
            is_published: true,
            publish_date: new Date().toISOString()
          });

        if (directError) throw directError;
      }

      await loadAnnouncements();
      
      toast({
        title: "建立成功",
        description: "公告已成功發佈",
      });
      
      return true;
    } catch (error) {
      console.error('建立公告失敗:', error);
      toast({
        title: "建立失敗",
        description: "無法建立公告",
        variant: "destructive"
      });
      return false;
    }
  };

  // 更新公告
  const updateAnnouncement = async (id: string, updatedAnnouncement: Partial<CompanyAnnouncement>) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以編輯公告",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await (supabase as any)
        .from('announcements')
        .update({
          title: updatedAnnouncement.title,
          content: updatedAnnouncement.content,
          type: updatedAnnouncement.category || 'general'
        })
        .eq('id', id);

      if (error) throw error;

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

  // 刪除公告
  const deleteAnnouncement = async (id: string) => {
    if (!isAdmin()) {
      toast({
        title: "權限不足",
        description: "只有管理員可以刪除公告",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await (supabase as any)
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;

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
    updateAnnouncement,
    deleteAnnouncement,
    refreshData: loadAnnouncements
  };
};
